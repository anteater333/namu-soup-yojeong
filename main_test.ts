import {
  assertEquals,
  assertInstanceOf,
  assertNotEquals,
} from "https://deno.land/std@0.172.0/testing/asserts.ts";
import { getNamuTrending, saveNamuTrending, getSavedTrending } from "./main.ts";

Deno.test(async function 랭킹은_길이가_10인_문자열_배열이다() {
  const namuTrending = await getNamuTrending();

  assertInstanceOf(namuTrending, Array<string>);

  assertEquals(namuTrending.length, 10);
});

Deno.test(async function 랭킹을_서버에_저장하면_201_코드를_받는다() {
  const expectedResultCode = 201;

  assertEquals((await saveNamuTrending()).resultCode, expectedResultCode);
});

Deno.test(
  async function 서버에_저장된_랭킹은_길이가_10인_배열과_기준날짜로_이루어져있다() {
    const expectedSaveResultCode = 201;

    assertEquals((await saveNamuTrending()).resultCode, expectedSaveResultCode);

    const { resultCode, savedTrending, savedDate } = await getSavedTrending();
    const expectedGetResultCode = 200;

    assertEquals(resultCode, expectedGetResultCode);

    assertInstanceOf(savedTrending, Array);
    assertInstanceOf(new Date(savedDate), Date);
    assertNotEquals(new Date(savedDate), new Date("Invalid Date"));

    assertEquals(savedTrending.length, 10);
  }
);
