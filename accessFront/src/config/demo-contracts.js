// Auto-generated contract addresses
// Generated at: 2026-01-28T17:52:25.926Z

export const DEMO_CONTRACTS = {
  KRNLVerifier: "0xf18503592c2Fa7a7300ca01B5Af20439Ab1AB2b8",
  NGORegistryDemo: "0x02571282492cfE0aaCDB87be2B1f940C59a4F224",
  network: "sepolia",
  chainId: 11155111
};

export const KRNL_VERIFIER_ABI = [
  {
    "inputs": [
      { "internalType": "bytes", "name": "proof", "type": "bytes" },
      { "internalType": "address", "name": "subject", "type": "address" }
    ],
    "name": "verifyProof",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const NGO_REGISTRY_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "bytes", "name": "proof", "type": "bytes" },
          { "internalType": "bytes", "name": "extraData", "type": "bytes" }
        ],
        "internalType": "struct NGORegistryDemo.AuthData",
        "name": "authData",
        "type": "tuple"
      }
    ],
    "name": "registerNGO",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "ngo", "type": "address" }],
    "name": "isVerifiedNGO",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllNGOs",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  }
];
