const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Deploying Core AccessChain Contracts to Ethereum Sepolia Testnet...\n");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "S\n");

  // Get existing NGORegistryDemo address
  const NGORegistryDemoAddress = "0x02571282492cfE0aaCDB87be2B1f940C59a4F224";
  console.log("🔗 Using existing NGORegistryDemo at:", NGORegistryDemoAddress);

  // Deploy NGOAccessControl
  console.log("1️⃣  Deploying NGOAccessControl...");
  const NGOAccessControl = await hre.ethers.getContractFactory("NGOAccessControl");
  const accessControl = await NGOAccessControl.deploy(NGORegistryDemoAddress);
  await accessControl.waitForDeployment();
  const accessControlAddress = await accessControl.getAddress();
  console.log("✅ NGOAccessControl deployed to:", accessControlAddress, "\n");

  // Deploy AccessGrant
  console.log("2️⃣  Deploying AccessGrant...");
  const AccessGrant = await hre.ethers.getContractFactory("AccessGrant");
  const accessGrant = await AccessGrant.deploy(accessControlAddress);
  await accessGrant.waitForDeployment();
  const accessGrantAddress = await accessGrant.getAddress();
  console.log("✅ AccessGrant deployed to:", accessGrantAddress, "\n");

  // Save addresses to deployed-addresses.json (append or update)
  const outputPath = path.join(__dirname, '..', 'deployed-addresses.json');
  let addresses = {};
  if (fs.existsSync(outputPath)) {
    addresses = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  }
  
  addresses.contracts = {
    ...addresses.contracts,
    NGOAccessControl: accessControlAddress,
    AccessGrant: accessGrantAddress
  };
  addresses.lastDeployedAt = new Date().toISOString();

  fs.writeFileSync(outputPath, JSON.stringify(addresses, null, 2));
  console.log("✅ Addresses updated in:", outputPath);

  console.log("\n🎉 Core Deployment complete!");
  console.log("\n📋 Next steps:");
  console.log("1. Update accessFront/src/config/contracts.js with new addresses");
  console.log("2. Start frontend integration");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
