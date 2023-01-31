import { getSavedTrending, saveNamuTrending } from "./main.ts";

Deno.bench(async function getSavedTrendingMany() {
  await getSavedTrending();
});

Deno.bench(async function saveNamuTrendingMany() {
  await saveNamuTrending(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]);
});
