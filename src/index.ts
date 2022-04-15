const world = "world";

export function hello(worldStr: string = world): string {
  return `Hello ${worldStr}!`;
}