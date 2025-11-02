export function hasUnusedVar(): void {
  const unused = 42;
  return;
}

export function hasConsoleLog(): void {
  console.log("This should trigger an error");
}
