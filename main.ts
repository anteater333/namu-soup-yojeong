const NAMU_API = "https://search.namu.wiki/api/ranking";
const SOUP_API = "http://localhost:8080/api";

export async function getNamuTrending(): Promise<{
  namuTrending: Array<string>;
  resultCode: number;
}> {
  const result = await fetch(NAMU_API, {
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

  return {
    namuTrending: result.status === 200 ? await result.json() : undefined,
    resultCode: result.status,
  };
}

export async function saveNamuTrending(trending: Array<string>) {
  const newNamuTrendingData = {
    trendings: trending,
    pwd: Deno.env.get("AGENT_SECRET"),
  };
  const result = await fetch(SOUP_API, {
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
  const result = await fetch(SOUP_API, {
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

export async function operationSoupYojeong() {
  console.log(`Hello, this is agent soup-yojeong operating. >:)\n`);
  try {
    console.log(`1. Crawling namu trendings from ${NAMU_API}`);
    const { namuTrending: newTrendings, resultCode: getResultCode } =
      await getNamuTrending();

    if (getResultCode === 200) {
      console.log(`Current namu trendings are...\n`);
      console.log(`[ ${newTrendings.join(", ")} ]`);
    } else {
      console.error(
        `Caught error during crawling namu trending - ${getResultCode}`
      );
      return;
    }

    console.log(`\n2. Saving namu trendings to soup-server ${SOUP_API}\n`);

    const { resultCode: saveResultCode } = await saveNamuTrending(newTrendings);

    if (saveResultCode === 201) {
      console.log(`Successfully saved trendings`);
    } else {
      console.error(
        `Caught error during saving namu trendings - ${saveResultCode}`
      );
      return;
    }

    console.log(`\n3. Checking saved soup trendings from ${SOUP_API}\n`);

    const {
      savedDate,
      savedTrending,
      resultCode: getSavedResultCode,
    } = await getSavedTrending();

    if (getSavedResultCode === 200) {
      console.log(`Current soup trendings are...\n`);
      console.log(
        `[ ${savedTrending
          .map((t: { keyword: string }) => t.keyword)
          .join(", ")} ]`
      );
      console.log(`--- ${savedDate}`);
    } else {
      console.error(`Caught error during checking saved soup trendings`);
      return;
    }

    return newTrendings;
  } catch (e) {
    console.error(`Caught error during crawling namu trending:`);
    console.error(e);

    console.log(`\nSoup-yojeong failed >:<`);
  }
}

if (import.meta.main) {
  await operationSoupYojeong();
}
