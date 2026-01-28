// Core Contracts Config
export const CONTRACT_ADDRESSES = {
    // These should be updated after deployment on Sepolia
    NGOAccessControl: "0x8C226087944Cf3e8dc1bECFC5cC7BA96636cB56B",
    AccessRegistry: "0x0000000000000000000000000000000000000000",
    GrantManager: "0x0000000000000000000000000000000000000000",
    AccessToken: "0x0000000000000000000000000000000000000000",
    AccessGrant: "0xd70C6d6164a81C6221a2083787B7Cd787Fc9C0d7",
    RequestRegistry: "0x0000000000000000000000000000000000000000",
};

export const AccessRegistryAddress = CONTRACT_ADDRESSES.AccessRegistry;
export const GrantManagerAddress = CONTRACT_ADDRESSES.GrantManager;
export const AccessTokenAddress = CONTRACT_ADDRESSES.AccessToken;
export const NGOAccessControlAddress = CONTRACT_ADDRESSES.NGOAccessControl;
export const AccessGrantAddress = CONTRACT_ADDRESSES.AccessGrant;
export const RequestRegistryAddress = CONTRACT_ADDRESSES.RequestRegistry;

export const NGOAccessControlABI = [
  {
    "inputs": [{"internalType": "address", "name": "_ngoRegistry", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "isAuthorizedNGO",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registerAsNGO",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "account", "type": "address"},
      {"internalType": "enum NGOAccessControl.Role", "name": "role", "type": "uint8"}
    ],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "userRoles",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export const AccessGrantABI = [
  {
    "inputs": [{"internalType": "address", "name": "_accessControl", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "uint256", "name": "duration", "type": "uint256"}
    ],
    "name": "createGrant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "grantId", "type": "uint256"},
      {"internalType": "string", "name": "proposal", "type": "string"},
      {"internalType": "uint256", "name": "requestedAmount", "type": "uint256"}
    ],
    "name": "applyForGrant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGrants",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "address", "name": "ngo", "type": "address"},
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "uint256", "name": "amount", "type": "uint256"},
          {"internalType": "uint256", "name": "deadline", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"},
          {"internalType": "uint256", "name": "totalApplications", "type": "uint256"}
        ],
        "internalType": "struct AccessGrant.Grant[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const AccessRegistryABI = [];
export const GrantManagerABI = [];
export const AccessTokenABI = [];
export const RequestRegistryABI = [];

export const CONTRACT_ABIS = {
  accessRegistry: AccessRegistryABI,
  grantManager: GrantManagerABI,
  accessToken: AccessTokenABI,
  ngoAccessControl: NGOAccessControlABI,
  accessGrant: AccessGrantABI,
  requestRegistry: RequestRegistryABI
};

export const CONTRACT_FUNCTIONS = {
    submitRequest: "submitRequest",
};
