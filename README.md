# AccessChain - KRNL Demo

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add:
# - Your wallet private key
# - KRNL workspace ID and API key
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Deploy to Sonic Testnet

```bash
npm run deploy:demo
```

## 📁 Project Structure

```
accesschain-core/
├── contracts/
│   ├── KRNLVerifier.sol       # Proof verification contract
│   └── NGORegistryDemo.sol    # NGO registration with KRNL
├── scripts/
│   └── deploy-demo.js         # Deployment script
├── test/                      # Contract tests
├── accessFront/               # Frontend application
└── hardhat.config.js          # Hardhat configuration
```

## 📝 Contracts

### KRNLVerifier

- Verifies cryptographic proofs from KRNL workflows
- Prevents proof replay attacks
- Emits verification events

### NGORegistryDemo

- Registers NGOs with KRNL proof verification
- Stores NGO information on-chain
- Provides query functions

## 🔗 Deployed Contracts

After deployment, contract addresses will be saved to:

- `deployed-addresses.json` (root directory)
- `accessFront/src/config/demo-contracts.js` (frontend config)

## 🧪 Testing

```bash
npm test
```

## 📚 Next Steps

1. Set up KRNL Studio workflow
2. Integrate KRNL SDK in frontend
3. Build demo page
4. Test end-to-end flow
5. Record demo video
6. Submit to KRNL team

## 🔧 Development

### Compile Contracts

```bash
npm run compile
```

### Deploy Locally

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy
npm run deploy:local
```

### Verify Contracts

After deployment, verify on Sonic Explorer:

```bash
npx hardhat verify --network sonicTestnet <CONTRACT_ADDRESS>
```

## 🌐 Networks

- **Ethereum Sepolia Testnet**
  - RPC: https://rpc.sepolia.org
  - Chain ID: 11155111
  - Explorer: https://sepolia.etherscan.io
  - Faucet: https://sepoliafaucet.com

## 📖 Resources

- [KRNL Studio](https://krnl.xyz)
- [Sonic Documentation](https://docs.soniclabs.com)
- [Hardhat Documentation](https://hardhat.org/docs)
