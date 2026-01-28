const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Deploying KRNL Demo Contracts to Ethereum Sepolia Testnet...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "S\n");
  
  // Deploy KRNLVerifier
  console.log("1️⃣  Deploying KRNLVerifier...");
  const KRNLVerifier = await hre.ethers.getContractFactory("KRNLVerifier");
  const krnlNode = deployer.address; // Use deployer as KRNL node for demo
  const verifier = await KRNLVerifier.deploy(krnlNode);
  await verifier.waitForDeployment();
  const verifierAddress = await verifier.getAddress();
  console.log("✅ KRNLVerifier deployed to:", verifierAddress);
  console.log("   KRNL Node:", krnlNode, "\n");
  
  // Deploy NGORegistryDemo
  console.log("2️⃣  Deploying NGORegistryDemo...");
  const NGORegistry = await hre.ethers.getContractFactory("NGORegistryDemo");
  const registry = await NGORegistry.deploy(verifierAddress);
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ NGORegistryDemo deployed to:", registryAddress, "\n");
  
  // Save addresses
  const addresses = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      KRNLVerifier: verifierAddress,
      NGORegistryDemo: registryAddress
    },
    deployedAt: new Date().toISOString()
  };
  
  console.log("📝 Contract Addresses:");
  console.log(JSON.stringify(addresses, null, 2));
  console.log();
  
  // Save to file
  const outputPath = path.join(__dirname, '..', 'deployed-addresses.json');
  fs.writeFileSync(outputPath, JSON.stringify(addresses, null, 2));
  console.log("✅ Addresses saved to:", outputPath);
  
  // Save to frontend config
  const frontendConfigPath = path.join(__dirname, '..', 'accessFront', 'src', 'config', 'demo-contracts.js');
  const frontendConfig = `// Auto-generated contract addresses
// Generated at: ${addresses.deployedAt}

export const DEMO_CONTRACTS = {
  KRNLVerifier: "${verifierAddress}",
  NGORegistryDemo: "${registryAddress}",
  network: "${hre.network.name}",
  chainId: ${addresses.chainId}
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
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "bytes", "name": "krnlProof", "type": "bytes" }
    ],
    "name": "registerNGOWithProof",
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
`;
  
  fs.mkdirSync(path.dirname(frontendConfigPath), { recursive: true });
  fs.writeFileSync(frontendConfigPath, frontendConfig);
  console.log("✅ Frontend config saved to:", frontendConfigPath);
  
  console.log("\n🎉 Deployment complete!");
  console.log("\n📋 Next steps:");
  console.log("1. Verify contracts on block explorer");
  console.log("2. Update .env.local with contract addresses");
  console.log("3. Test KRNL workflow integration");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
