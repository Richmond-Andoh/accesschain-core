const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying KRNL integration contracts...");

  // Deploy KRNL Identity Verifier
  const krnlIdentityService = process.env.KRNL_IDENTITY_SERVICE_ADDRESS;
  if (!krnlIdentityService) {
    throw new Error("KRNL_IDENTITY_SERVICE_ADDRESS not set in environment");
  }

  const KRNLIdentityVerifier = await ethers.getContractFactory("KRNLIdentityVerifier");
  const identityVerifier = await KRNLIdentityVerifier.deploy(krnlIdentityService);
  await identityVerifier.deployed();

  console.log("KRNLIdentityVerifier deployed to:", identityVerifier.address);

  // Deploy KRNL Token Bridge
  const accessTokenAddress = process.env.ACCESS_TOKEN_ADDRESS;
  const krnlBridgeEndpoint = process.env.KRNL_BRIDGE_ENDPOINT;
  
  if (!accessTokenAddress || !krnlBridgeEndpoint) {
    throw new Error("ACCESS_TOKEN_ADDRESS or KRNL_BRIDGE_ENDPOINT not set in environment");
  }

  const KRNLTokenBridge = await ethers.getContractFactory("KRNLTokenBridge");
  const tokenBridge = await KRNLTokenBridge.deploy(accessTokenAddress, krnlBridgeEndpoint);
  await tokenBridge.deployed();

  console.log("KRNLTokenBridge deployed to:", tokenBridge.address);

  // Verify contracts on Etherscan
  console.log("Verifying contracts on Etherscan...");
  
  await run("verify:verify", {
    address: identityVerifier.address,
    constructorArguments: [krnlIdentityService],
  });

  await run("verify:verify", {
    address: tokenBridge.address,
    constructorArguments: [accessTokenAddress, krnlBridgeEndpoint],
  });

  console.log("Deployment and verification complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });