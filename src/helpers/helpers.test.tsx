import { mergeObjectArrays, sortObjectArray } from "./ObjectArraysOper";

test("merge arrays of object", () => {
  const firstArr = [{ name: "a" }, { name: "c" }, { name: "d" }];
  const secondArr = [{ nick: "b" }, { nick: "e" }, { nick: "z" }];
  expect(mergeObjectArrays(firstArr, "name", secondArr, "nick")).toEqual([
    { name: "a" },
    { nick: "b" },
    { name: "c" },
    { name: "d" },
    { nick: "e" },
    { nick: "z" },
  ]);
});

test("sort arrays of object", () => {
  const arr = [{ name: "z" }, { name: "a" }, { name: "d" }];

  expect(sortObjectArray(arr, "name")).toEqual([
    { name: "a" },
    { name: "d" },
    { name: "z" },
  ]);
});
