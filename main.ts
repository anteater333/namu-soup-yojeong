import { dotEnvConfig } from "./deps.ts";

dotEnvConfig({ export: true });

export async function getNamuTrending(): Promise<Array<string>> {
  const result = await fetch("https://search.namu.wiki/api/ranking", {
    credentials: "omit",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      // "If-None-Match": 'W/"8f-ifC8pEihCYj9gV0JFs9sPvS4igM"',
    },
    referrer: "https://namu.wiki/",
    method: "GET",
    mode: "cors",
  });

  return await result.json();
}

export async function saveNamuTrending() {
  const newNamuTrendingData = {
    trendings: await getNamuTrending(),
    pwd: Deno.env.get("AGENT_SECRET"),
  };
  const result = await fetch("http://localhost:8080/api", {
    method: "PUT",
    cache: "no-cache",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newNamuTrendingData),
  });

  await result.body?.cancel();

  return { resultCode: result.status };
}

export async function getSavedTrending() {
  const result = await fetch("http://localhost:8080/api", {
    method: "GET",
    cache: "no-cache",
    mode: "cors",
  });

  const resultBody = await result.json();

  return {
    resultCode: result.status,
    savedTrending: result.status === 200 ? resultBody[0] : undefined,
    savedDate: result.status === 200 ? resultBody[1] : undefined,
  };
}
