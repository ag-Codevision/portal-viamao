import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createOpenVideoRepository,
} from "../src/lib/data/open-video-repository";
import {
  openVideoSources,
  publicChannel,
} from "../src/lib/data/open-video-sources";

test("repositório de filmes em domínio público retorna filmes autorizados", async () => {
  const repository = createOpenVideoRepository();
  assert.equal(await repository.getVideo("canal-arbitrario"), null);

  const video = await repository.getVideo("o-imigrante-charlie-chaplin");
  assert.ok(video);
  assert.equal(video.availability, "ready");
  assert.equal(video.license, "Domínio Público");
  assert.equal(video.director, "Charles Chaplin");
  assert.equal(video.provider, "Internet Archive");
  assert.match(video.playbackUrl!, /archive\.org\/download\/TheImmigrant/);
  assert.match(video.embedUrl!, /archive\.org\/embed\/TheImmigrant/);
});

test("filmes de Georges Méliès e Buster Keaton constam no acervo livre", async () => {
  const repository = createOpenVideoRepository();
  const melies = await repository.getVideo("viagem-a-lua-georges-melies");
  assert.ok(melies);
  assert.equal(melies.year, 1902);
  assert.equal(melies.director, "Georges Méliès");

  const keaton = await repository.getVideo("a-general-buster-keaton");
  assert.ok(keaton);
  assert.equal(keaton.year, 1926);

  const list = await repository.listVideos();
  assert.ok(list.length >= 5);
});

test("canal público usa URL de incorporação publicada pela emissora", () => {
  assert.equal(new URL(publicChannel.embedUrl).hostname, "www2.camara.leg.br");
  assert.equal(publicChannel.embedUrl.endsWith("/embedAoVivo.html"), true);
  assert.equal(
    publicChannel.streamUrl,
    "https://stream3.camara.gov.br/tv1/manifest.m3u8",
  );
});
