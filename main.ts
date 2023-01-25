export async function getNamuRanking() {
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

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
}
