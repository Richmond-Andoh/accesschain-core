const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Redeploying KRNL Demo Contracts (Fixing ABI)...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // 1. Get existing KRNLVerifier (no need to redeploy)
  // Check deployed-addresses.json if it exists
  const addressPath = path.join(__dirname, '..', 'deployed-addresses.json');
  let verifierAddress;
  
  if (fs.existsSync(addressPath)) {
    const existing = require(addressPath);
    if (existing.contracts && existing.contracts.KRNLVerifier) {
      verifierAddress = existing.contracts.KRNLVerifier;
      console.log("♻️  Using existing KRNLVerifier at:", verifierAddress);
    }
  }
  
  // Fallback: Deploy new if not found
  if (!verifierAddress) {
    console.log("1️⃣  Deploying KRNLVerifier...");
    const KRNLVerifier = await hre.ethers.getContractFactory("KRNLVerifier");
    const krnlNode = deployer.address;
    const verifier = await KRNLVerifier.deploy(krnlNode);
    await verifier.waitForDeployment();
    verifierAddress = await verifier.getAddress();
    console.log("✅ KRNLVerifier deployed to:", verifierAddress);
  }
  
  // 2. Deploy updated NGORegistryDemo
  console.log("2️⃣  Deploying Updated NGORegistryDemo...");
  const NGORegistry = await hre.ethers.getContractFactory("NGORegistryDemo");
  const registry = await NGORegistry.deploy(verifierAddress);
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("✅ Updated NGORegistryDemo deployed to:", registryAddress, "\n");
  
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
  
  // Save to file
  fs.writeFileSync(addressPath, JSON.stringify(addresses, null, 2));
  console.log("\n✅ Addresses updated!");
  
  // Generate New ABI for KRNL Studio
  const artifact = require("../artifacts/contracts/NGORegistryDemo.sol/NGORegistryDemo.json");
  
  console.log("\n📋 NEW ABI FOR KRNL STUDIO:");
  console.log("=========================================");
  console.log(JSON.stringify(artifact.abi, null, 2));
  console.log("=========================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
