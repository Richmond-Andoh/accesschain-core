# Team-AccessChain

## Overview
AccessChain is a blockchain-based platform that connects people with disabilities to funding and resources through transparent grant management. It eliminates intermediaries, ensuring direct support reaches beneficiaries while providing NGOs with efficient tools to create and manage disability support grants.

## Features
✅ On-chain disability verification and registration
✅ NGO verification and grant management system
✅ Direct funding between donors and beneficiaries
✅ Community voting on grant applications
✅ ACCESS token integration for governance
✅ Accessibility-first design for all users

## Project Structure
- `contracts/`: Smart contracts for disability verification, grant management, and token functionality
- `accessFront/`: React-based frontend application with Chakra UI components
- `scripts/`: Deployment and configuration scripts
- `test/`: Contract test files
- `assets/`: Design assets and images
- `docs/`: Additional documentation

## Tech Stack
- Solidity + Hardhat
- React + Chakra UI
- Wagmi v2 / Ethers.js
- MetaMask integration
- Sonic Blaze Testnet

## How to Run Locally
1. Clone the repo
```shell
git clone https://github.com/Blockbridge-Network/Team-AccessChain-Core.git
cd Team-AccessChain-Core
```

2. Install dependencies
```shell
npm install
cd accessFront
npm install
```

3. Configure MetaMask for Sonic Blaze Testnet
   - Network Name: Sonic Blaze Testnet
   - RPC URL: https://rpc.blaze.soniclabs.com
   - Chain ID: 57054
   - Currency Symbol: SONIC

4. Start the development server
```shell
cd accessFront
npm run dev
```

## Contracts
| Contract | Address | Network |
|----------|---------|---------|


## 📸 Screenshots

![Admin Dashboard](screenshots/admin-dashboard.png)
![Grant Management](screenshots/grant-management.png)
![User Interface](screenshots/user-interface.png)
![Grant Details](screenshots/grant-details.png)
![User Dashboard](screenshots/user-dashboard.png)

## 🎥 Demo Video
[Watch our demo video](https://vimeo.com/1084558401/d69f80400a) to see AccessChain in action.

## Team
- Richmond Andoh (Full-Stack Developer)
- Agyemang Nana Akua (Frontend Developer)
- Adwoa Favour (UI/UX Designer)

## 📄 License
MIT
