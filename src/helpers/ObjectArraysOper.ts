export const sortObjectArray = <T extends Object, K extends keyof T>(
  array: T[],
  key: K
) => {
  return array.sort((a, b) => {
    const first = a[key];
    const second = b[key];
    if (first > second) return 1;
    if (first < second) return -1;
    return 0;
  });
};

export const mergeObjectArrays = <
  Obj extends Object,
  ObjKey extends keyof Obj,
  Obj2 extends object,
  Obj2Key extends keyof Obj2
>(
  objArr: Obj[],
  objKey: ObjKey,
  obj2Arr: Obj2[],
  obj2Key: Obj2Key
) => {
  const array = [];
  let lIndex = 0;
  let rIndex = 0;

  while (lIndex < objArr.length || rIndex < obj2Arr.length) {
    const lItem = objArr[lIndex];
    const rItem = obj2Arr[rIndex];

    if (lIndex >= objArr.length) {
      array.push({ ...obj2Arr[rIndex] });
      rIndex++;
    } else if (rIndex >= obj2Arr.length) {
      array.push({ ...objArr[lIndex] });
      lIndex++;
    }
    // @ts-expect-error
    else if (lItem[objKey] < rItem[obj2Key]) {
      array.push({ ...objArr[lIndex] });
      lIndex++;
    } else {
      array.push({ ...obj2Arr[rIndex] });
      rIndex++;
    }
  }
  console.log(array);
  return array;
};
