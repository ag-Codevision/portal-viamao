import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("lista lateral, país, estado/cidade, seleção e persistência", async ({
  page,
}) => {
  await page.route("https://tvgarden.world/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<html lang="pt-BR"><body>Player de teste</body></html>',
    }),
  );
  await page.goto("/ao-vivo");
  await expect(
    page.locator('.world-tv-channel[aria-pressed="true"]'),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Escolha um canal para assistir" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "O mundo, na sua tela." }),
  ).toBeVisible();
  await expect(page.locator(".world-tv-channel")).toHaveCount(25);
  await page.getByLabel("Estado / região").selectOption("BR-RS");
  await expect(page).toHaveURL(/estado=BR-RS/);
  const cityOptions = await page
    .getByLabel("Cidade (cobertura)")
    .locator("option")
    .evaluateAll((options) =>
      options.map((option) => (option as HTMLOptionElement).value),
    );
  expect(cityOptions.length).toBeGreaterThan(2);
  await page.getByLabel("Cidade (cobertura)").selectOption("BRPOA");
  await expect(page).toHaveURL(/cidade=BRPOA/);
  await expect(page.locator(".world-tv-channel").first()).toContainText(
    "Porto Alegre",
  );
  await page.getByLabel("País", { exact: true }).selectOption("GB");
  await expect(page).toHaveURL(/pais=GB/);
  await expect(page).not.toHaveURL(/estado=|cidade=/);
  await page
    .getByLabel("Buscar canal", { exact: true })
    .fill("inexistente-zzzz");
  await page
    .getByRole("button", { name: "Buscar canais", exact: true })
    .click();
  await expect(page.getByText("Nenhum canal encontrado.")).toBeVisible();
  await page
    .getByRole("button", { name: "Limpar filtros", exact: true })
    .click();
  await expect(page.locator(".world-tv-channel").first()).toBeVisible();
  await page.getByRole("button", { name: "Próxima página de canais" }).click();
  await expect(page).toHaveURL(/pagina=2/);
  await page.getByRole("button", { name: "Página anterior de canais" }).click();
  const candidate = page
    .locator(".world-tv-channel")
    .filter({ hasText: "Via TV Garden" })
    .first();
  await candidate.click();
  await expect(candidate).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".world-tv-view iframe")).toHaveCount(1);
  await page.reload();
  await expect(
    page.locator(".world-tv-channel[aria-pressed=true]"),
  ).toHaveCount(1);
  await expect(page.locator(".world-tv-view iframe")).toHaveCount(0);
});
test("iframe autorizado só é montado por gesto e não recebe autoplay", async ({
  page,
}) => {
  await page.route("https://tvgarden.world/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<html lang="pt-BR"><body>Player externo de teste</body></html>',
    }),
  );
  await page.goto("/ao-vivo?pais=GB");
  const candidate = page
    .locator(".world-tv-channel")
    .filter({ hasText: "Via TV Garden" })
    .first();
  await candidate.click();
  await expect(
    page.getByRole("button", { name: "Carregar player" }),
  ).toHaveCount(0);
  const iframe = page.locator(".world-tv-view iframe");
  await expect(iframe).toHaveAttribute(
    "src",
    /^https:\/\/tvgarden\.world\/tv\/uk\/[A-Za-z0-9_-]+$/,
  );
  await expect(iframe).toHaveAttribute(
    "sandbox",
    "allow-scripts allow-same-origin allow-presentation",
  );
  await expect(iframe).not.toHaveAttribute("allow", /autoplay/);
  await page.getByRole("button", { name: "Fechar player" }).click();
  await expect(iframe).toHaveCount(0);
});
test("erro de catálogo tem retry e filtros inválidos retornam 400", async ({
  page,
  request,
}) => {
  const invalid = await request.get("/api/tv/catalog?pais=../../");
  expect(invalid.status()).toBe(400);
  const data = await request.get("/api/tv/catalog?pais=BR");
  const body = await data.json();
  expect(body.items.length).toBeLessThanOrEqual(25);
  expect(
    body.items.every((item: Record<string, unknown>) => !("sources" in item)),
  ).toBe(true);
  await page.goto("/ao-vivo");
  await page.route("**/api/tv/catalog?**", (route) =>
    route.fulfill({
      status: 503,
      json: { error: "Catálogo temporariamente indisponível" },
    }),
  );
  await page
    .getByRole("button", { name: "Buscar canais", exact: true })
    .click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Catálogo temporariamente indisponível" }),
  ).toBeVisible();
  await page.unroute("**/api/tv/catalog?**");
  await page
    .getByRole("button", { name: "Tentar novamente", exact: true })
    .click();
  await expect(page.locator(".world-tv-channel")).toHaveCount(25);
  await expect(page.locator(".world-tv-error")).toHaveCount(0);
});
test("YouTube abre com um clique e a troca desmonta o player anterior", async ({
  page,
}) => {
  await page.route("https://www.youtube-nocookie.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: '<html lang="pt-BR"><body>Player YouTube de teste</body></html>',
    }),
  );
  await page.goto("/ao-vivo?pais=BR");
  await page.getByLabel("Buscar canal", { exact: true }).fill("CNN Brasil");
  await page
    .getByRole("button", { name: "Buscar canais", exact: true })
    .click();
  const channel = page
    .locator(".world-tv-channel")
    .filter({ hasText: "Player YouTube" })
    .first();
  await channel.click();
  const iframe = page.locator(".world-tv-view iframe");
  await expect(iframe).toHaveAttribute(
    "src",
    /^https:\/\/www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}\?playsinline=1&autoplay=1&mute=1$/,
  );
  await expect(iframe).toHaveAttribute("allow", /autoplay/);
  await expect(
    page.getByRole("button", { name: "Carregar player" }),
  ).toHaveCount(0);
  await page.getByLabel("Buscar canal", { exact: true }).fill("TV Camara");
  await page
    .getByRole("button", { name: "Buscar canais", exact: true })
    .click();
  await page
    .locator(".world-tv-channel")
    .filter({ hasText: "Sinal oficial" })
    .click();
  await expect(iframe).toHaveCount(0);
  await expect(page.locator(".world-tv-view video")).toHaveCount(1);
  expect(
    await page
      .locator("video")
      .evaluate((element) => (element as HTMLVideoElement).muted),
  ).toBe(true);
  await page.getByRole("button", { name: "Fechar player" }).click();
  await expect(page.locator(".world-tv-view video")).toHaveCount(0);
});
test("acessibilidade e layout lateral responsivo", async ({ page }) => {
  await page.goto("/ao-vivo");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
