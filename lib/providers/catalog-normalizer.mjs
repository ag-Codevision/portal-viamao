import { isIP } from "node:net";
const names = new Intl.DisplayNames(["pt-BR"], { type: "region" });
export const normalizeName = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
export const countryCode = (code) =>
  String(code).toUpperCase() === "UK" ? "GB" : String(code).toUpperCase();
export function publicHttps(value) {
  try {
    const u = new URL(value);
    if (
      u.protocol !== "https:" ||
      u.username ||
      u.password ||
      isIP(u.hostname.replace(/^\[|\]$/g, "")) ||
      !u.hostname.includes(".") ||
      /^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(u.hostname) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(u.hostname) ||
      u.hostname.endsWith(".local") ||
      u.hostname.endsWith(".internal")
    )
      return null;
    return u.href;
  } catch {
    return null;
  }
}
export function youtubeId(value) {
  try {
    const url = new URL(value);
    if (
      ![
        "youtube.com",
        "www.youtube.com",
        "youtube-nocookie.com",
        "www.youtube-nocookie.com",
        "youtu.be",
      ].includes(url.hostname)
    )
      return null;
    const id =
      url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : url.pathname.startsWith("/embed/")
          ? url.pathname.split("/")[2]
          : url.searchParams.get("v");
    return /^[A-Za-z0-9_-]{11}$/.test(id ?? "") ? id : null;
  } catch {
    return null;
  }
}
export function buildCatalog({
  gardenCountries,
  gardenChannels,
  countries,
  subdivisions,
  cities,
  channels,
  feeds,
  streams,
  blocklist,
  importedAt,
  failedCountries = [],
}) {
  const blocked = new Set(blocklist.map((item) => item.channel));
  const meta = new Map(channels.map((channel) => [channel.id, channel]));
  const cityMap = new Map(cities.map((city) => [city.code, city]));
  const stateMap = new Map(subdivisions.map((state) => [state.code, state]));
  const streamsByChannel = new Map(),
    channelsByUrl = new Map(),
    channelsByName = new Map(),
    feedsByChannel = new Map();
  for (const channel of channels) {
    const key = `${countryCode(channel.country)}:${normalizeName(channel.name)}`;
    const group = channelsByName.get(key) ?? [];
    group.push(channel);
    channelsByName.set(key, group);
  }
  for (const stream of streams) {
    if (!stream.channel) continue;
    const group = streamsByChannel.get(stream.channel) ?? [];
    group.push(stream);
    streamsByChannel.set(stream.channel, group);
    const valid = publicHttps(stream.url);
    if (valid) {
      const set = channelsByUrl.get(valid) ?? new Set();
      set.add(stream.channel);
      channelsByUrl.set(valid, set);
    }
  }
  for (const feed of feeds) {
    const group = feedsByChannel.get(feed.channel) ?? [];
    group.push(feed);
    feedsByChannel.set(feed.channel, group);
  }
  const forbidden = (channel) =>
    channel &&
    (channel.is_nsfw ||
      channel.closed ||
      channel.replaced_by ||
      blocked.has(channel.id));
  function locations(id, country) {
    const result = new Map();
    for (const feed of feedsByChannel.get(id) ?? []) {
      for (const area of feed.broadcast_area ?? []) {
        let state, city;
        if (area.startsWith("ct/")) {
          city = cityMap.get(area.slice(3));
          if (city?.country !== country) continue;
          state = stateMap.get(city.subdivision);
        } else if (area.startsWith("s/")) {
          state = stateMap.get(area.slice(2));
          if (state?.country !== country) continue;
        } else continue;
        const key = city?.code ?? state?.code;
        if (key)
          result.set(key, {
            stateCode: state?.code ?? null,
            stateName: state?.name ?? null,
            cityCode: city?.code ?? null,
            cityName: city?.name ?? null,
          });
      }
    }
    return [...result.values()];
  }
  function sources(rawStreams = [], rawYoutube = []) {
    const result = new Map();
    for (const value of Array.isArray(rawStreams) ? rawStreams : []) {
      const url = publicHttps(typeof value === "string" ? value : value?.url);
      if (!url) continue;
      if (typeof value === "object" && (value.referrer || value.user_agent))
        continue;
      const yt = youtubeId(url);
      const kind = yt ? "youtube" : /\.m3u8(?:$|\?)/i.test(url) ? "hls" : null;
      if (!kind) continue;
      const key = yt ?? url;
      result.set(key, {
        kind,
        url: yt ? `https://www.youtube-nocookie.com/embed/${yt}` : url,
        quality: typeof value === "object" ? (value.quality ?? null) : null,
      });
    }
    for (const value of Array.isArray(rawYoutube) ? rawYoutube : []) {
      const id = youtubeId(value);
      if (id)
        result.set(id, {
          kind: "youtube",
          url: `https://www.youtube-nocookie.com/embed/${id}`,
          quality: null,
        });
    }
    return [...result.values()];
  }
  const items = new Map(),
    matched = new Set();
  for (const raw of gardenChannels) {
    if (!/^[A-Za-z0-9_-]{6,80}$/.test(raw.nanoid ?? "")) continue;
    const country = countryCode(raw.country);
    if (!/^[A-Z]{2}$/.test(country) || typeof raw.name !== "string") continue;
    const sourceList = sources(raw.stream_urls, raw.youtube_urls);
    if (!sourceList.length) continue;
    const candidates = new Set(
      sourceList.flatMap((source) => [
        ...(channelsByUrl.get(source.url) ?? []),
      ]),
    );
    if ([...candidates].some((id) => forbidden(meta.get(id)))) continue;
    let channel = candidates.size === 1 ? meta.get([...candidates][0]) : null;
    if (!channel) {
      const byName =
        channelsByName.get(`${country}:${normalizeName(raw.name)}`) ?? [];
      if (byName.some(forbidden)) continue;
      if (byName.length === 1) channel = byName[0];
    }
    if (channel?.country !== country) channel = null;
    if (forbidden(channel)) continue;
    if (channel) matched.add(channel.id);
    const id = `garden:${raw.nanoid}`;
    if (items.has(id)) continue;
    items.set(id, {
      id,
      name: raw.name,
      country,
      countryName: names.of(country) ?? country,
      gardenCountry: String(raw.country).toLowerCase(),
      gardenId: raw.nanoid,
      iptvId: channel?.id ?? null,
      website: publicHttps(channel?.website),
      sources: sourceList,
      geoBlocked: raw.isGeoBlocked === true,
      locations: locations(channel?.id, country),
      provenance: channel ? ["tv-garden", "iptv-org"] : ["tv-garden"],
    });
  }
  for (const channel of channels) {
    if (matched.has(channel.id) || forbidden(channel)) continue;
    const rawStreams = streamsByChannel.get(channel.id) ?? [];
    const sourceList = sources(rawStreams);
    if (!sourceList.length) continue;
    const country = countryCode(channel.country);
    items.set(`iptv:${channel.id}`, {
      id: `iptv:${channel.id}`,
      name: channel.name,
      country,
      countryName: names.of(country) ?? country,
      gardenCountry: null,
      gardenId: null,
      iptvId: channel.id,
      website: publicHttps(channel.website),
      sources: sourceList,
      geoBlocked: rawStreams.some((s) => s.labels?.includes("Geo-blocked")),
      locations: locations(channel.id, country),
      provenance: ["iptv-org"],
    });
  }
  const list = [...items.values()].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR"),
  );
  const counts = new Map();
  for (const item of list)
    counts.set(item.country, (counts.get(item.country) ?? 0) + 1);
  const countryList = [...counts]
    .map(([code, count]) => ({
      code,
      name:
        names.of(code) ??
        countries.find((country) => country.code === code)?.name ??
        code,
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  return {
    schemaVersion: 1,
    importedAt,
    sourceUrls: [
      "https://tvgarden.world/api/tv/countries_metadata.json",
      "https://tvgarden.world/api/tv/countries/{code}.json",
      "https://iptv-org.github.io/api/",
    ],
    statistics: {
      channels: list.length,
      countries: countryList.length,
      brazil: list.filter((item) => item.country === "BR").length,
      tvGardenCountries: gardenCountries.length,
      tvGardenExpected: gardenCountries.reduce(
        (sum, country) => sum + country.expectedCount,
        0,
      ),
      withLocations: list.filter((item) => item.locations.length).length,
    },
    failedCountries,
    countries: countryList,
    channels: list,
  };
}
