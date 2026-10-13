import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createTvGardenProvider,
  fetchJson,
} from "../lib/providers/tv-garden.mjs";
import { buildCatalog } from "../lib/providers/catalog-normalizer.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const destination = path.join(root, "data", "tvgarden-tv.json");
const provider = createTvGardenProvider();
const gardenCountries = await provider.getCountries();
console.log(
  `TV Garden: ${gardenCountries.length} países com canais anunciados.`,
);
const resources = [
  "countries",
  "subdivisions",
  "cities",
  "channels",
  "feeds",
  "streams",
  "blocklist",
];
const iptv = Object.fromEntries(
  await Promise.all(
    resources.map(async (name) => {
      const data = await fetchJson(
        `https://iptv-org.github.io/api/${name}.json`,
      );
      if (!Array.isArray(data)) throw new Error(`IPTV-org ${name} inválido`);
      return [name, data];
    }),
  ),
);
let previous = null;
try {
  previous = JSON.parse(await readFile(destination, "utf8"));
} catch {}
const results = [],
  failedCountries = [];
let index = 0,
  completed = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (index < gardenCountries.length) {
      const country = gardenCountries[index++];
      try {
        const data = await provider.getChannels(country.code);
        results.push(
          ...data.map((channel) => ({
            ...channel,
            country: country.code.toLowerCase(),
          })),
        );
      } catch (error) {
        failedCountries.push({
          code: country.code,
          reason: String(error.message),
        });
        for (const item of previous?.channels ?? []) {
          if (item.gardenCountry === country.code.toLowerCase())
            results.push({
              nanoid: item.gardenId,
              name: item.name,
              country: item.gardenCountry,
              stream_urls: item.sources
                .filter((source) => source.kind === "hls")
                .map((source) => source.url),
              youtube_urls: item.sources
                .filter((source) => source.kind === "youtube")
                .map((source) => source.url),
              isGeoBlocked: item.geoBlocked,
            });
        }
      }
      completed++;
      if (completed % 20 === 0)
        console.log(
          `Importados ${completed}/${gardenCountries.length} países.`,
        );
    }
  }),
);
if (!results.length)
  throw new Error(
    "Nenhum canal TV Garden importado; snapshot anterior preservado.",
  );
const snapshot = buildCatalog({
  gardenCountries,
  gardenChannels: results,
  ...iptv,
  importedAt: new Date().toISOString(),
  failedCountries,
});
await mkdir(path.dirname(destination), { recursive: true });
await writeFile(`${destination}.tmp`, JSON.stringify(snapshot), "utf8");
await rename(`${destination}.tmp`, destination);
console.log(JSON.stringify(snapshot.statistics));
if (failedCountries.length)
  console.log(
    `Aviso: ${failedCountries.length} países preservados do snapshot anterior quando disponíveis.`,
  );
