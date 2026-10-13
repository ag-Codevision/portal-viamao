import { gunzipSync } from "node:zlib";
export const TV_GARDEN_ORIGIN = "https://tvgarden.world";
export function decodeJson(bytes) {
  const buffer = Buffer.from(bytes);
  return JSON.parse(
    (buffer[0] === 0x1f && buffer[1] === 0x8b
      ? gunzipSync(buffer)
      : buffer
    ).toString("utf8"),
  );
}
export async function fetchJson(url, fetcher = fetch) {
  let error;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetcher(url, {
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return decodeJson(await response.arrayBuffer());
    } catch (cause) {
      error = cause;
    }
  }
  throw error;
}
export function createTvGardenProvider(fetcher = fetch) {
  return {
    async getCountries() {
      const raw = await fetchJson(
        `${TV_GARDEN_ORIGIN}/api/tv/countries_metadata.json`,
        fetcher,
      );
      if (!raw || Array.isArray(raw) || typeof raw !== "object")
        throw new Error("Metadados de países inválidos");
      return Object.entries(raw)
        .filter(
          ([code, value]) =>
            /^[A-Z]{2}$/.test(code) &&
            value?.hasChannels === true &&
            value.channelCount > 0,
        )
        .map(([code, value]) => ({
          code,
          name: String(value.country),
          expectedCount: Number(value.channelCount),
        }));
    },
    async getChannels(code) {
      if (!/^[a-zA-Z]{2}$/.test(code))
        throw new Error("Código de país inválido");
      const raw = await fetchJson(
        `${TV_GARDEN_ORIGIN}/api/tv/countries/${code.toLowerCase()}.json`,
        fetcher,
      );
      if (!Array.isArray(raw)) throw new Error("Lista de canais inválida");
      return raw;
    },
  };
}
