import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("rotas públicas, sem overflow, e acessibilidade", async ({ page }) => {
  for (const route of [
    "/",
    "/ao-vivo",
    "/programas",
    "/documentarios",
    "/programas/entre-aguas",
    "/assistir/entre-aguas-1",
    "/assistir/o-imigrante-charlie-chaplin",
    "/assistir/viagem-a-lua-georges-melies",
    "/assistir/a-general-buster-keaton",
    "/noticias",
    "/noticias/um-olhar-para-a-cidade",
    "/empregos",
    "/empregos/atendente-demo",
    "/empregos/publicar",
    "/sobre",
    "/contato",
    "/privacidade",
    "/termos",
    "/acessibilidade",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const a11y = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(a11y.violations, route).toEqual([]);
  }
});
test("busca, estado vazio e validação do formulário", async ({ page }) => {
  await page.goto("/programas");
  await page
    .getByRole("searchbox", { name: "Buscar programas" })
    .fill("inexistente");
  await page.getByRole("button", { name: "Buscar", exact: true }).click();
  await expect(page.getByText("Nenhum resultado por aqui")).toBeVisible();
  await page.getByRole("link", { name: "Limpar filtros" }).click();
  await expect(page.getByText("6 programas encontrados")).toBeVisible();
  await page.goto("/empregos/publicar");
  await page.getByRole("button", { name: "Simular envio gratuito" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Revise os campos",
  );
  await page.getByLabel("Título da vaga").fill("Atendente demonstrativo");
  await page.getByLabel("Empresa fictícia").fill("Empresa exemplo");
  await page.getByLabel("E-mail de exemplo").fill("teste@example.com");
  await page
    .getByLabel("Descrição e requisitos")
    .fill(
      "Descrição fictícia da vaga com informações suficientes para validar.",
    );
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Simular envio gratuito" }).click();
  await expect(
    page.getByRole("heading", { name: "Simulação concluída" }),
  ).toBeVisible();
});
test("menu móvel fecha com Escape e devolve foco", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Abrir menu" });
  await menu.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(menu).toBeFocused();
});
test("slug desconhecido retorna 404", async ({ page }) => {
  const response = await page.goto("/programas/inexistente");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Página não encontrada" }),
  ).toBeVisible();
});
test("mídia externa depende de ação e não reproduz automaticamente", async ({
  page,
}) => {
  await page.goto("/assistir/o-imigrante-charlie-chaplin");
  await expect(
    page.getByRole("heading", { level: 1, name: "O Imigrante (1917)" }),
  ).toBeVisible();
  await expect(page.locator("video")).toHaveAttribute(
    "src",
    /archive\.org\/download\/TheImmigrant\/The-Immigrant-v2\.mp4/,
  );
  await page.goto("/ao-vivo");
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.locator("video")).toHaveCount(0);
  await page.getByLabel("Buscar canal", { exact: true }).fill("TV Camara");
  await page
    .getByRole("button", { name: "Buscar canais", exact: true })
    .click();
  await page
    .locator(".world-tv-channel")
    .filter({ hasText: "Sinal oficial" })
    .click();
  await expect(page.locator("video")).toHaveAttribute(
    "data-source",
    "https://stream3.camara.gov.br/tv1/manifest.m3u8",
  );
  await expect(page.locator("video")).toHaveAttribute("autoplay", "");
  expect(
    await page
      .locator("video")
      .evaluate((video) => (video as HTMLVideoElement).muted),
  ).toBe(false);
});
test("busca encontra filmes reais de licença aberta", async ({ page }) => {
  await page.goto("/programas?q=Imigrante");
  await expect(
    page.getByRole("heading", { name: "O Imigrante (1917)", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Nenhum resultado por aqui")).not.toBeVisible();
  await expect(
    page.getByRole("link").filter({
      has: page.getByRole("heading", { name: "O Imigrante (1917)", exact: true }),
    }),
  ).toHaveAttribute("href", "/assistir/o-imigrante-charlie-chaplin");
});
