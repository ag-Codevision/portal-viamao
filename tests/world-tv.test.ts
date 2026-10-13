import { test } from "node:test";
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import {
  decodeJson,
  createTvGardenProvider,
} from "../lib/providers/tv-garden.mjs";
import {
  buildCatalog,
  publicHttps,
  youtubeId,
} from "../lib/providers/catalog-normalizer.mjs";
import { presentChannel } from "../src/lib/data/world-tv-policy";
import { queryCatalog, tvFilterSchema } from "../src/lib/data/world-tv-query";
import type { TvSnapshot } from "../src/types/world-tv";
const fixture = {
  gardenCountries: [
    { code: "BR", expectedCount: 3 },
    { code: "UK", expectedCount: 1 },
  ],
  gardenChannels: [
    {
      nanoid: "regional1",
      name: "Canal Regional",
      country: "br",
      stream_urls: ["https://regional.example/live.m3u8"],
      youtube_urls: [],
    },
    {
      nanoid: "camara001",
      name: "TV Camara",
      country: "br",
      stream_urls: ["https://stream3.camara.gov.br/tv1/manifest.m3u8"],
      youtube_urls: [],
    },
    {
      nanoid: "blocked01",
      name: "Bloqueado",
      country: "br",
      stream_urls: ["https://blocked.example/live.m3u8"],
    },
    {
      nanoid: "british01",
      name: "Canal britânico",
      country: "uk",
      youtube_urls: ["https://www.youtube.com/watch?v=abcdefghijk"],
      stream_urls: [],
    },
  ],
  countries: [],
  subdivisions: [{ code: "BR-RS", country: "BR", name: "Rio Grande do Sul" }],
  cities: [
    {
      code: "BRPOA",
      country: "BR",
      subdivision: "BR-RS",
      name: "Porto Alegre",
    },
  ],
  channels: [
    {
      id: "regional.br",
      name: "Canal Regional",
      country: "BR",
      website: "https://regional.example/",
    },
    {
      id: "TVCamara.br",
      name: "TV Camara",
      country: "BR",
      website: "https://www.camara.leg.br/tv",
    },
    { id: "blocked.br", name: "Bloqueado", country: "BR" },
    {
      id: "extra.br",
      name: "Canal extra",
      country: "BR",
      website: "https://extra.example/",
    },
  ],
  feeds: [{ channel: "regional.br", broadcast_area: ["ct/BRPOA"] }],
  streams: [
    { channel: "regional.br", url: "https://regional.example/live.m3u8" },
    {
      channel: "TVCamara.br",
      url: "https://stream3.camara.gov.br/tv1/manifest.m3u8",
    },
    { channel: "blocked.br", url: "https://blocked.example/live.m3u8" },
    { channel: "extra.br", url: "https://extra.example/live.m3u8" },
  ],
  blocklist: [{ channel: "blocked.br" }],
  importedAt: "2026-10-13T00:00:00Z",
};
const snapshot = buildCatalog(fixture) as TvSnapshot;
test("provider decodifica JSON e gzip sem depender de Content-Encoding", async () => {
  assert.deepEqual(
    decodeJson(
      gzipSync(JSON.stringify({ BR: { hasChannels: true, channelCount: 1 } })),
    ),
    { BR: { hasChannels: true, channelCount: 1 } },
  );
  assert.deepEqual(decodeJson(Buffer.from("[1,2]")), [1, 2]);
  let called = "";
  const provider = createTvGardenProvider(async (url) => {
    called = String(url);
    return new Response(gzipSync(JSON.stringify([])));
  });
  await provider.getChannels("BR");
  assert.equal(called, "https://tvgarden.world/api/tv/countries/br.json");
  await assert.rejects(() => provider.getChannels("../segredo"));
});
test("normalização junta fontes, remove blocklist e não inventa localização", () => {
  assert.equal(snapshot.channels.length, 4);
  assert.equal(
    snapshot.channels.some((channel) => channel.name === "Bloqueado"),
    false,
  );
  const regional = snapshot.channels.find(
    (channel) => channel.iptvId === "regional.br",
  )!;
  assert.equal(regional.locations[0].cityCode, "BRPOA");
  const camara = snapshot.channels.find(
    (channel) => channel.iptvId === "TVCamara.br",
  )!;
  assert.deepEqual(camara.locations, []);
  assert.equal(
    snapshot.channels.find((channel) => channel.gardenId === "british01")!
      .country,
    "GB",
  );
  assert.equal(snapshot.statistics.brazil, 3);
});
test("catálogo prioriza reprodução direta de stream HLS no player interno", () => {
  const regional = presentChannel(
    snapshot.channels.find((channel) => channel.iptvId === "regional.br")!,
  );
  assert.equal(regional.playback.kind, "hls");
  assert.equal(regional.playback.url, "https://regional.example/live.m3u8");
  const camara = presentChannel(
    snapshot.channels.find((channel) => channel.iptvId === "TVCamara.br")!,
  );
  assert.equal(camara.playback.kind, "hls");
  assert.equal(
    presentChannel(
      snapshot.channels.find((channel) => channel.iptvId === "extra.br")!,
    ).playback.kind,
    "hls",
  );
});
test("filtros por cobertura, acentos, vazios e país", () => {
  const filters = tvFilterSchema.parse({});
  const local = queryCatalog(snapshot, {
    ...filters,
    state: "BR-RS",
    city: "BRPOA",
  });
  assert.equal(local.total, 1);
  assert.equal(local.items[0].name, "Canal Regional");
  assert.equal(
    queryCatalog(snapshot, { ...filters, state: "__unknown__" }).total,
    2,
  );
  assert.equal(
    queryCatalog(snapshot, { ...filters, country: "GB", query: "britanico" })
      .total,
    1,
  );
  assert.equal(
    queryCatalog(snapshot, { ...filters, query: "inexistente" }).total,
    0,
  );
  assert.equal(tvFilterSchema.safeParse({ country: "../../" }).success, false);
  assert.equal(
    tvFilterSchema.safeParse({ query: "a".repeat(101) }).success,
    false,
  );
});
test("YouTube usa somente o player incorporável da plataforma", () => {
  const channel = snapshot.channels.find(
    (channel) => channel.gardenId === "british01",
  )!;
  assert.equal(presentChannel(channel).playback.kind, "youtube");
  assert.equal(
    presentChannel(channel).playback.url,
    "https://www.youtube-nocookie.com/embed/abcdefghijk",
  );
  assert.equal(
    presentChannel({
      ...channel,
      sources: [
        {
          kind: "youtube",
          url: "https://evil.example/embed/abcdefghijk",
          quality: null,
        },
      ],
    }).playback.kind,
    "external",
  );
});
test("paginações grandes limitam payload e ajustam a última página", () => {
  const many = {
    ...snapshot,
    channels: Array.from({ length: 70 }, (_, index) => ({
      ...snapshot.channels[0],
      id: `test-${index}`,
      country: "BR",
    })),
  };
  const result = queryCatalog(many, {
    country: "BR",
    state: "",
    city: "",
    query: "",
    page: 999,
  });
  assert.equal(result.page, 3);
  assert.equal(result.items.length, 20);
  assert.equal(
    queryCatalog(many, { ...result.filters, page: 1 }).items.length,
    25,
  );
});
test("origens inseguras e YouTube não oficiais são rejeitados", () => {
  assert.equal(publicHttps("http://origin.example/live.m3u8"), null);
  assert.equal(publicHttps("https://127.0.0.1/private"), null);
  assert.equal(publicHttps("https://[::ffff:192.168.1.1]/private"), null);
  assert.equal(publicHttps("https://user:password@origin.example/"), null);
  assert.equal(youtubeId("https://evil.example/watch?v=abcdefghijk"), null);
  assert.equal(
    youtubeId("https://www.youtube-nocookie.com/embed/abcdefghijk"),
    "abcdefghijk",
  );
});
