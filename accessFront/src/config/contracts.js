// Contract addresses and ABIs for the Access Chain Core contracts
export const CONTRACT_ADDRESSES = {
    // Main contracts
    NGOAccessControl: "0xCe69C39257a15Db211D5e8ef90CC57f37581864E",
    RequestRegistry: "0x1B2bA62E084280320318bb0825544e30fd7EB20C",
    AccessGrant: "0x0495032F128d1C47474109fa0880C0b55eF08b4E",
    AccessToken: "0x1fb4c0DAc53fEEf34eea04d94276638089802189",
    AccessNFT: "0xef220aE4765B15666897Da2f181D5bC8Bc5b30BF",
    AccessDAO: "0xC24aEDAb8EC4e44C0E69D4F3Dbc4B3e35dc67d5c",
    
    // Aliases with consistent casing for backward compatibility
    ngoAccessControl: "0xCe69C39257a15Db211D5e8ef90CC57f37581864E",
    requestRegistry: "0x1B2bA62E084280320318bb0825544e30fd7EB20C",
    accessGrant: "0x0495032F128d1C47474109fa0880C0b55eF08b4E",
    accessToken: "0x1fb4c0DAc53fEEf34eea04d94276638089802189",
    accessNFT: "0xef220aE4765B15666897Da2f181D5bC8Bc5b30BF",
    accessDAO: "0xC24aEDAb8EC4e44C0E69D4F3Dbc4B3e35dc67d5c"
};

// Individual contract address exports
export const NGOAccessControlAddress = "0xCe69C39257a15Db211D5e8ef90CC57f37581864E";
export const RequestRegistryAddress = "0x1B2bA62E084280320318bb0825544e30fd7EB20C";
export const AccessGrantAddress = "0x0495032F128d1C47474109fa0880C0b55eF08b4E";
export const AccessTokenAddress = "0x1fb4c0DAc53fEEf34eea04d94276638089802189";
export const AccessNFTAddress = "0xef220aE4765B15666897Da2f181D5bC8Bc5b30BF";
export const AccessDAOAddress = "0xC24aEDAb8EC4e44C0E69D4F3Dbc4B3e35dc67d5c";

// NGO Access Control Contract ABI
export const NGOAccessControlABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      }
    ],
    "name": "NGOAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      }
    ],
    "name": "NGORemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      }
    ],
    "name": "addNGO",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNGOs",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isAuthorizedAdmin",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isAuthorizedNGO",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "isNGO",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      }
    ],
    "name": "removeNGO",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const RequestRegistryABI = [
    "function submitRequest(string calldata metadataURI) external",
    "function updateRequestStatus(uint256 requestId, uint8 newStatus) external",
    "function getUserRequests(address user) external view returns (uint256[])",
    "function requests(uint256) external view returns (address, string, uint8)",
    "event RequestSubmitted(uint256 indexed requestId, address indexed applicant)",
    "event RequestStatusUpdated(uint256 indexed requestId, uint8 status)"
];

export const AccessTokenABI = [
    "function mint(address to, uint256 amount) external",
    "function transfer(address to, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function totalSupply() external view returns (uint256)"
];

export const AccessNFTABI = [
    "function mint(address to, string memory uri) external",
    "function burn(uint256 tokenId) external",
    "function tokenURI(uint256 tokenId) external view returns (string memory)",
    "function ownerOf(uint256 tokenId) external view returns (address)",
    "event TokenMinted(uint256 indexed tokenId, address indexed owner)",
    "event TokenBurned(uint256 indexed tokenId, address indexed owner)"
];

export const AccessDAOABI = [
    "function createProposal(string calldata description, uint256 votingPeriod) external",
    "function vote(uint256 proposalId, bool support) external",
    "function executeProposal(uint256 proposalId) external",
    "function getProposalStatus(uint256 proposalId) external view returns (bool, bool)",
    "event ProposalCreated(uint256 indexed proposalId, string description, uint256 deadline)",
    "event Voted(uint256 indexed proposalId, address indexed voter, uint8 option)",
    "event ProposalExecuted(uint256 indexed proposalId, bool passed)"
];

export const AccessGrantABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "ngoAccessControlAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "grantId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "applicant",
        "type": "address"
      }
    ],
    "name": "ApplicationApproved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "grantId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "applicant",
        "type": "address"
      }
    ],
    "name": "ApplicationRejected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "grantId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "applicant",
        "type": "address"
      }
    ],
    "name": "ApplicationSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "grantId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      }
    ],
    "name": "GrantCreated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "grantId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "applicant",
        "type": "address"
      }
    ],
    "name": "approveApplication",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "grantId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "proposal",
        "type": "string"
      }
    ],
    "name": "applyForGrant",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "createGrant",
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
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "ngo",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "internalType": "struct AccessGrant.Grant[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "grants",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "ngo",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "grantId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "applicant",
        "type": "address"
      }
    ],
    "name": "rejectApplication",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Export contract configurations
export const CONTRACT_ABIS = {
  ngoAccessControl: NGOAccessControlABI,
  requestRegistry: RequestRegistryABI,
  accessGrant: AccessGrantABI,
  accessToken: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_ngoAccessControl",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lockPeriod",
          "type": "uint256"
        }
      ],
      "name": "stake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unstake",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getStakingPower",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "stakes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "lockPeriod",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MIN_STAKE_AMOUNT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAX_STAKE_AMOUNT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MIN_STAKE_PERIOD",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAX_STAKE_PERIOD",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lockPeriod",
          "type": "uint256"
        }
      ],
      "name": "TokensStaked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "reward",
          "type": "uint256"
        }
      ],
      "name": "TokensUnstaked",
      "type": "event"
    }
  ],
  accessNFT: AccessNFTABI,
  accessDAO: AccessDAOABI,
};

// Contract function names
export const CONTRACT_FUNCTIONS = {
  // RequestRegistry
  submitRequest: 'submitRequest',
  updateRequestStatus: 'updateRequestStatus',
  getUserRequests: 'getUserRequests',
  getRequestDetails: 'requests',

  // NGOAccessControl
  addNGO: 'addNGO',
  removeNGO: 'removeNGO',
  isAuthorizedNGO: 'isAuthorizedNGO',
  getNGOs: 'getNGOs',

  // AccessToken
  mint: 'mint',
  transfer: 'transfer',
  balanceOf: 'balanceOf',
  totalSupply: 'totalSupply',

  // AccessNFT
  mintNFT: 'mint',
  burnNFT: 'burn',
  tokenURI: 'tokenURI',
  ownerOf: 'ownerOf',

  // AccessDAO
  createProposal: 'createProposal',
  vote: 'vote',
  executeProposal: 'executeProposal',
  getProposalStatus: 'getProposalStatus',

  // AccessGrant
  createGrant: 'createGrant',
  getGrants: 'getGrants',
  applyForGrant: 'applyForGrant',
  approveApplication: 'approveApplication',
  rejectApplication: 'rejectApplication',
};

// Contract events
export const CONTRACT_EVENTS = {
  // RequestRegistry
  RequestSubmitted: 'RequestSubmitted',
  RequestStatusUpdated: 'RequestStatusUpdated',

  // NGOAccessControl
  NGOAdded: 'NGOAdded',
  NGORemoved: 'NGORemoved',

  // AccessToken
  Transfer: 'Transfer',

  // AccessNFT
  TokenMinted: 'TokenMinted',
  TokenBurned: 'TokenBurned',

  // AccessDAO
  ProposalCreated: 'ProposalCreated',
  Voted: 'Voted',
  ProposalExecuted: 'ProposalExecuted',

  // AccessGrant
  GrantCreated: 'GrantCreated',
  ApplicationSubmitted: 'ApplicationSubmitted',
  ApplicationApproved: 'ApplicationApproved',
  ApplicationRejected: 'ApplicationRejected',
}; 