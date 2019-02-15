export function rangeTo(n: number) {
  if (n === 0) return []
  return new Array(Math.abs(n)).fill(undefined).map((_, i) => n / Math.abs(n) * (i + 1))
}

export function cartesian<T>(arrs: Array<Array<T>>) {
  const product: Array<Array<T>> = []
  const max = arrs.length - 1;
  function inner(arr: Array<T>, i: number) {
    for (let j = 0, l = arrs[i].length; j < l; j++) {
      var a = arr.slice(0)
      a.push(arrs[i][j])
      if (i === max) {
        product.push(a);
      } else {
        inner(a, i+1)
      }
    }
  }
  inner([], 0);
  return product
}
