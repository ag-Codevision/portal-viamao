import { chromium } from "playwright";
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
});
let failures = 0;
try {
  const page = await browser.newPage();
  for (const slug of [
    "big-buck-bunny",
    "sintel",
    "elephants-dream",
    "tv-camara",
  ]) {
    await page.goto(
      `http://localhost:3003/${slug === "tv-camara" ? "ao-vivo" : `assistir/${slug}`}`,
    );
    if (slug === "tv-camara") {
      await page.getByLabel("Buscar canal", { exact: true }).fill("TV Camara");
      await page
        .getByRole("button", { name: "Buscar canais", exact: true })
        .click();
      await page
        .locator(".world-tv-channel")
        .filter({ hasText: "Sinal oficial" })
        .click();
    } else await page.getByRole("button", { name: "Carregar player" }).click();
    try {
      const video = page.locator(".external-player video");
      await video.waitFor({ timeout: 15000 });
      if (slug === "tv-camara")
        await page.waitForFunction(
          () =>
            Boolean(
              document.querySelector(".external-player video")?.currentSrc,
            ),
          {},
          { timeout: 15000 },
        );
      await video.evaluate((element) => {
        element.muted = true;
        element.play().catch(() => {});
      });
      let previousTime = null;
      let playing = false;
      let state;
      const started = Date.now();
      while (Date.now() - started < 30000) {
        state = await video.evaluate((element) => ({
          time: element.currentTime,
          ready: element.readyState,
          paused: element.paused,
          error: element.error?.message ?? null,
        }));
        if (
          previousTime !== null &&
          state.time > previousTime + 0.2 &&
          !state.paused &&
          state.ready >= 2
        ) {
          playing = true;
          break;
        }
        if (state.error) break;
        previousTime = state.time;
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      console.log(JSON.stringify({ slug, ...state, playing }));
      if (!playing) failures++;
    } catch (error) {
      failures++;
      console.log(
        JSON.stringify({
          slug,
          playing: false,
          error: error.message.split("\n")[0],
        }),
      );
    }
  }
} finally {
  await browser.close();
}
if (failures) process.exitCode = 1;
