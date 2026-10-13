import {
  getDefaultWorldChannel,
  getLiveNow,
  getSchedule,
  getTvCatalog,
  getWorldChannel,
} from "@/lib/data";
import { tvFilterSchema } from "@/lib/data/world-tv-query";
import { WorldTvBrowser } from "@/components/live/world-tv-browser";
import { demoDate, demoNow } from "@/mocks";
import { localTime } from "@/lib/utils";

export const metadata = { title: "TV ao Vivo · Portal Viamão" };

export default async function Live({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const value = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : undefined;
  const parsed = tvFilterSchema.safeParse({
    country: value("pais") ?? "BR",
    state: value("estado") ?? "",
    city: value("cidade") ?? "",
    query: value("q") ?? "",
    page: value("pagina") ?? 1,
  });
  const filters = parsed.success ? parsed.data : tvFilterSchema.parse({});
  const [catalog, live, slots] = await Promise.all([
    getTvCatalog(filters),
    getLiveNow(),
    getSchedule(value("data") ?? demoDate, "viamao"),
  ]);
  const selected = value("canal")
    ? await getWorldChannel(value("canal")!)
    : await getDefaultWorldChannel();

  return (
    <div className="container live-page-container">
      <WorldTvBrowser initialCatalog={catalog} initialChannel={selected} />

      <details className="local-tv-demo">
        <summary>TV de Viamão · grade demonstrativa</summary>
        <p className="muted">
          A TV local ainda não tem sinal real. Esta programação fictícia não
          corresponde a nenhum canal do catálogo mundial. Referência: 12/10/2026
          às 18:20, horário de Brasília.
        </p>
        <div className="now-next">
          <div>
            <p className="eyebrow">AGORA NA SIMULAÇÃO</p>
            <h2>{live.now?.label}</h2>
          </div>
          <div>
            <p className="eyebrow">A SEGUIR NA SIMULAÇÃO</p>
            <h2>{live.next?.label}</h2>
          </div>
        </div>
        <ol className="schedule-list">
          {slots.map((slot) => (
            <li
              key={slot.id}
              className={
                slot.startsAt <= demoNow && slot.endsAt > demoNow
                  ? "current-slot"
                  : ""
              }
            >
              <time dateTime={slot.startsAt}>
                {localTime(slot.startsAt)} — {localTime(slot.endsAt)}
              </time>
              <h3>{slot.label}</h3>
              <span>DEMONSTRAÇÃO</span>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
