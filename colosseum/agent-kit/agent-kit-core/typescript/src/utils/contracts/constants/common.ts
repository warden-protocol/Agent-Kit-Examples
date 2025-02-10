export const DEFAULT_PAGINATION = {
  key: "0x",
  offset: 0n,
  limit: 100n,
  countTotal: true,
  reverse: false,
} as const;

export const DEFAULT_EXPRESSION = "any(1, warden.space.owners)";
