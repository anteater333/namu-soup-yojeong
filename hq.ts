/** Soup-yojeong HQ */

import { serve } from "./deps/http.ts";
import { operationSoupYojeong } from "./main.ts";
import { dotEnvConfig } from "./deps/default.ts";

dotEnvConfig({ export: true });

const cooldown = 30000;
let cooldownTimeoutId: number;
let isCooling = false;

export async function orderSoupYojeong(_req: Request) {
  if (isCooling) {
    return new Response(null, { status: 429 });
  }

  isCooling = true;
  cooldownTimeoutId = setTimeout(() => {
    isCooling = false;
  }, cooldown);

  const newTrendings = await operationSoupYojeong();

  if (!newTrendings) return new Response(null, { status: 500 });

  return new Response(
    new Blob([JSON.stringify(newTrendings)], {
      type: "application/json",
    })
  );
}

export function resetCooldown() {
  isCooling = false;
  clearTimeout(cooldownTimeoutId);
}

export function launchSoupYojeongService() {
  console.log("service-lotating");
}

if (import.meta.main) {
  const hqPort = Deno.env.get("HQ_PORT");
  serve(orderSoupYojeong, { port: hqPort ? parseInt(hqPort) : 4242 });

  launchSoupYojeongService();
}
