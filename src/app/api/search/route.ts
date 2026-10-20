import { NextResponse } from "next/server";
import { searchGlobal } from "@/lib/data/global-search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  try {
    const results = await searchGlobal(q);
    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json(
      { error: "Falha ao processar busca." },
      { status: 500 },
    );
  }
}
