export const multiply = (a: number, b: number): number => {
  return a * b;
};

export const divide = function(a: number, b: number): number {
  return a / b;
};

export function withSubfunctions(x: number): number {
  const helper = (y: number) => y * 2;

  function anotherHelper(z: number): number {
    return z + 1;
  }

  return helper(x) + anotherHelper(x);
}
