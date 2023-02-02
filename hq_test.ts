import { orderSoupYojeong, resetCooldown } from "./hq.ts";
import {
  assertEquals,
  assertInstanceOf,
  assertArrayIncludes,
} from "./deps/asserts.ts";

const baseurl = "http://localhost:4242";
const apiTestServer = "http://localhost:8080";

Deno.test(async function 실검_저장_요청이_성공한다() {
  const req = new Request(baseurl);
  const res = await orderSoupYojeong(req);

  assertEquals(res.status, 200);

  resetCooldown();
});

Deno.test(async function 요청이_성공하면_저장했던_실검을_반환한다() {
  const req = new Request(baseurl);
  const res = await orderSoupYojeong(req);
  const result = await res.json();

  assertInstanceOf(result, Array);

  const apiReq = new Request(`${apiTestServer}/api`);
  const savedRanking = (
    await (await fetch(apiReq, { method: "GET" })).json()
  )[0].map((a: { keyword: string }) => a.keyword);

  assertArrayIncludes(result, savedRanking);

  resetCooldown();
});

Deno.test(async function 요청을_연속해_보내면_두번째_요청은_실패한다() {
  const req = new Request(baseurl);
  const res = await orderSoupYojeong(req);

  assertEquals(res.status, 200);

  const res2 = await orderSoupYojeong(req);

  assertEquals(res2.status, 429);

  resetCooldown();
});
