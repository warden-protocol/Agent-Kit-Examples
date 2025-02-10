export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const FLOW_RANDOM_ABI = [
  {
    inputs: [
      { internalType: "uint64", name: "min", type: "uint64" },
      { internalType: "uint64", name: "max", type: "uint64" },
    ],
    name: "getRandomInRange",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getRandomNumber",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "randomNumber",
        type: "uint64",
      },
      { indexed: false, internalType: "uint64", name: "min", type: "uint64" },
      { indexed: false, internalType: "uint64", name: "max", type: "uint64" },
    ],
    name: "RandomInRangeGenerated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "randomNumber",
        type: "uint64",
      },
    ],
    name: "RandomNumberGenerated",
    type: "event",
  },
]