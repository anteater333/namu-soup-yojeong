import {
  assertEquals,
  assertInstanceOf,
} from "https://deno.land/std@0.172.0/testing/asserts.ts";
import { getNamuRanking, saveNamuRanking } from "./main.ts";

Deno.test(async function 랭킹은_길이가_10인_배열() {
  const namuRanking = await getNamuRanking();
  assertInstanceOf(namuRanking, Array);

  assertEquals(namuRanking.length, 10);
});

Deno.test(async function 랭킹을_서버에_저장하면_201_코드를_받는다() {
  const expectedResult = 201;

  assertEquals((await saveNamuRanking()).resultCode, expectedResult);
});
