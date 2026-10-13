import { NextResponse } from "next/server";
import { getTvCatalog } from "@/lib/data/world-tv-repository";
import { tvFilterSchema } from "@/lib/data/world-tv-query";
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const parsed = tvFilterSchema.safeParse({
    country: params.get("pais") ?? "BR",
    state: params.get("estado") ?? "",
    city: params.get("cidade") ?? "",
    query: params.get("q") ?? "",
    page: params.get("pagina") ?? 1,
  });
  if (!parsed.success)
    return NextResponse.json(
      { error: "Filtros inválidos. Revise país, estado, cidade e busca." },
      { status: 400 },
    );
  try {
    return NextResponse.json(await getTvCatalog(parsed.data), {
      headers: { "Cache-Control": "public, max-age=300" },
    });
  } catch {
    return NextResponse.json(
      { error: "O catálogo local não pôde ser carregado. Tente novamente." },
      { status: 503 },
    );
  }
}
