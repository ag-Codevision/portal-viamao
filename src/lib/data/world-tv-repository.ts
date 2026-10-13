import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { TvSnapshot, TvFilters } from "@/types/world-tv";
import { queryCatalog } from "./world-tv-query";
import { presentChannel } from "./world-tv-policy";
let snapshotPromise: Promise<TvSnapshot> | undefined;
const loadSnapshot = cache(async () => {
  snapshotPromise ??= readFile(
    path.join(process.cwd(), "data", "tvgarden-tv.json"),
    "utf8",
  )
    .then((text) => {
      const snapshot = JSON.parse(text) as TvSnapshot;
      if (
        snapshot.schemaVersion !== 1 ||
        !Array.isArray(snapshot.channels) ||
        !snapshot.channels.length
      )
        throw new Error("Snapshot TV indisponível. Execute npm run tv:sync.");
      return snapshot;
    })
    .catch((error) => {
      snapshotPromise = undefined;
      throw error;
    });
  return snapshotPromise;
});
export async function getTvCatalog(filters: TvFilters) {
  return queryCatalog(await loadSnapshot(), filters);
}
export async function getWorldChannel(id: string) {
  const snapshot = await loadSnapshot();
  const channel = snapshot.channels.find((channel) => channel.id === id);
  return channel ? presentChannel(channel) : null;
}
export async function getDefaultWorldChannel() {
  const snapshot = await loadSnapshot();
  const channel =
    snapshot.channels.find((channel) => channel.iptvId === "TVCamara.br") ??
    snapshot.channels.find((channel) => channel.country === "BR") ??
    snapshot.channels[0];
  return presentChannel(channel);
}
