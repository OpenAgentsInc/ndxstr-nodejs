export const sleep = (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};
