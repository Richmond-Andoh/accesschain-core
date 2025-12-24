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
✅ KRNL-powered decentralized identity verification
✅ KRNL-ACCESS token bridge integration

## Disability Verification
AccessChain provides a comprehensive system for disability verification and resource distribution powered by KRNL's decentralized identity infrastructure.

### KRNL Identity Integration
- **Decentralized Identity (DID)**: Users' disability verifications are stored as DIDs on KRNL's network
- **Privacy-First Verification**: Zero-knowledge proofs ensure privacy while maintaining verifiability
- **Tamper-Proof Documentation**: All medical documents are cryptographically secured
- **Multi-Factor Authentication**: Enhanced security for sensitive operations
- **Cross-Chain Verification**: Disability credentials can be verified across different blockchain networks

### Document Verification Flow
1. User submits disability documentation
2. KRNL's identity service validates the documents
3. Verified credentials are stored as DIDs
4. Zero-knowledge proofs enable private verification
=======
# System Architecture

## High-Level Architecture Diagram

┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   Web App    │  │ Admin Panel  │  │  Public Explorer     │ │
│  │   (React)    │  │  (NGO Dash)  │  │  (Grant Browser)     │ │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘ │
└─────────┼──────────────────┼─────────────────────┼─────────────┘
          │                  │                     │
          └──────────────────┴─────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Web3 Gateway  │
                    │  (Ethers.js)    │
                    └────────┬────────┘
                             │
          ┏━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━━━┓
          ┃                                     ┃
┌─────────▼──────────┐              ┌──────────▼──────────┐
│   BACKEND LAYER    │              │   BLOCKCHAIN LAYER  │
│                    │              │                     │
│ ┌────────────────┐ │              │ ┌─────────────────┐│
│ │  REST API      │ │              │ │ Smart Contracts ││
│ │  (Node.js)     │ │              │ │  - User         ││
│ └───────┬────────┘ │              │ │  - NGO          ││
│         │          │              │ │  - Grant        ││
│ ┌───────▼────────┐ │              │ │  - Token        ││
│ │  KRNL Client   │─┼──────────┐   │ │  - DAO          ││
│ │  Integration   │ │          │   │ └─────────────────┘│
│ └────────────────┘ │          │   │                     │
│                    │          │   │ ┌─────────────────┐│
│ ┌────────────────┐ │          │   │ │  Events Index   ││
│ │  PostgreSQL    │ │          │   │ │  (The Graph)    ││
│ │  - User data   │ │          │   │ └─────────────────┘│
│ │  - Cache       │ │          │   └─────────────────────┘
│ └────────────────┘ │          │
└────────────────────┘          │
                                │
          ┌─────────────────────┼──────────────────────┐
          │                     │                      │
┌─────────▼─────────┐  ┌───────▼────────┐  ┌─────────▼────────┐
│   KRNL PROTOCOL   │  │  IPFS STORAGE  │  │  EXTERNAL APIs   │
│                   │  │                │  │                  │
│ ┌───────────────┐ │  │ ┌────────────┐ │  │ ┌──────────────┐ │
│ │  Verification │ │  │ │ Documents  │ │  │ │ Gov Data     │ │
│ │  Kernels      │ │  │ │ Metadata   │ │  │ │ NGO Registry │ │
│ └───────────────┘ │  │ └────────────┘ │  │ └──────────────┘ │
│                   │  │                │  │                  │
│ ┌───────────────┐ │  │ ┌────────────┐ │  │ ┌──────────────┐ │
│ │  PoP Registry │ │  │ │ Arweave    │ │  │ │ Identity     │ │
│ └───────────────┘ │  │ │ (Archive)  │ │  │ │ Providers    │ │
└───────────────────┘  │ └────────────┘ │  │ └──────────────┘ │
                       └────────────────┘  └──────────────────┘

## ⚙️ KRNL Protocol Integration in AccessChain

### 🌍 Overview
AccessChain is a **blockchain-powered grant management platform** designed to connect people with disabilities to verified funding and resources.  
To enhance **trust**, **security**, and **transparency** in verification processes, AccessChain integrates the **KRNL Protocol** — a decentralized computing framework that enables **verifiable off-chain computation** and **on-chain proof verification**.

This integration allows AccessChain to validate sensitive or external data (like disability documents or NGO registrations) **without ever exposing private user information**, while maintaining **trustless transparency** for all stakeholders.

---

### 🔑 Why KRNL?
Traditional smart contracts can’t access or verify real-world data directly.  
KRNL solves this by introducing **“kernels”** — small, verifiable off-chain programs that perform specific computations and generate **Proofs of Processing (PoPs)**.  
These proofs are verified on-chain, ensuring that the computation and data source were **authentic and tamper-proof**.

#### For AccessChain, this means:
- ✅ No need for centralized data validators  
- ✅ Full auditability of off-chain checks  
- ✅ Privacy-preserving verification  
- ✅ Seamless interoperability with government and NGO data sources  

---

### 🧩 What KRNL Handles in AccessChain

| **Use Case** | **Description** | **Benefit** |
|---------------|-----------------|--------------|
| **Disability Verification Kernel** | Verifies authenticity of disability certificates through trusted data sources or partner APIs. | Ensures that only verified individuals can access disability support grants. |
| **NGO Verification Kernel** | Confirms legitimacy of NGOs requesting to create or manage grant campaigns. | Prevents fraud and guarantees donor confidence. |
| **Grant Utilization Kernel (Future)** | Tracks and verifies that received funds are used for intended purposes using IoT or update data feeds. | Enables end-to-end transparency and trust for donors. |

Each kernel operates as a **modular verification unit**, producing **verifiable proofs** that are submitted to AccessChain’s smart contracts for **final validation**.

---

### 🧠 How It Works

#### Step-by-Step Process

1. **User Action**  
   A user (beneficiary or NGO) submits verification data through the AccessChain frontend (React app).

2. **Backend Request**  
   The backend sends this data (or its hash) to a registered KRNL Kernel, such as the *disability-verification kernel*.

3. **Kernel Execution**  
   The kernel performs off-chain checks — for example, verifying a disability certificate against a trusted database or government API.

4. **Proof Generation**  
   After validation, the kernel produces a **Proof of Processing (PoP)** — a signed cryptographic proof confirming authenticity of the result.

5. **On-Chain Verification**  
   The AccessChain smart contract receives the PoP and verifies it using the **KRNL on-chain registry** to ensure it was generated by an approved kernel.

6. **State Update**  
   Once verified, the smart contract updates the beneficiary or NGO’s verification status permanently **on-chain**.

---

**Technical Workflow**

End-to-End Verification Flow

┌─────────────┐
│   User      │ Submits verification data
│(Beneficiary/│ ───────────────────────────┐
│    NGO)     │                            │
└─────────────┘                            ▼
                                  ┌──────────────────┐
                                  │  AccessChain     │
                                  │  Frontend (React)│
                                  └────────┬─────────┘
                                           │
                                           ▼
                                  ┌──────────────────┐
                                  │  Backend API     │
                                  │  (Node.js)       │
                                  └────────┬─────────┘
                                           │
                         ┌─────────────────┴─────────────────┐
                         ▼                                   ▼
              ┌─────────────────────┐            ┌──────────────────┐
              │  KRNL Kernel        │            │  Data Sources    │
              │  - Verification     │◄───────────│  - Gov APIs      │
              │  - Computation      │            │  - Databases     │
              │  - PoP Generation   │            │  - Registries    │
              └──────────┬──────────┘            └──────────────────┘
                         │
                         │ Proof of Processing (PoP)
                         ▼
              ┌─────────────────────┐
              │  AccessChain        │
              │  Smart Contract     │
              │  - PoP Verification │
              │  - State Update     │
              └─────────────────────┘
                         │
                         │ Verification Status
                         ▼
              ┌─────────────────────┐
              │  On-Chain Registry  │
              │  - Verified Users   │
              │  - NGO Status       │
              └─────────────────────┘

### 🚀 Summary
By integrating the **KRNL Protocol**, AccessChain achieves:
- Transparent and decentralized verification  
- Privacy-preserving data validation  
- Secure and auditable interactions between donors, NGOs, and beneficiaries  

This integration transforms AccessChain into a **fully verifiable, trustless grant management ecosystem**, empowering communities and ensuring that every unit of funding reaches its rightful destination.


## Project Structure
- `contracts/`: Smart contracts for disability verification, grant management, and token functionality
- `accessFront/`: React-based frontend application with Chakra UI components
  - `src/context/AccessibilityContext.jsx`: Accessibility state management
- `scripts/`: Deployment and configuration scripts
- `test/`: Contract test files
- `assets/`: Design assets and images
- `docs/`: Additional documentation

## Tech Stack
- Solidity + Hardhat
- React + Chakra UI
- Wagmi v2 / Ethers.js
- MetaMask integration
- Sonic Blast Testnet
- KRNL SDK v2.0
- KRNL Identity Service
- KRNL Token Bridge

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
| NGOAccessControl | 0x16788aD7d27A8e244BEbF1cdc3906b43f7f66f80 | Sonic Testnet |
| RequestRegistry | 0xC880064656D06317A55EC3cD9036D8CE8E217497 | Sonic Testnet |
| AccessGrant | 0x1eA07a7e5Fc838146E9de9F801d50f3F896a6587 | Sonic Testnet |
| AccessToken | 0xd4F4B93aD2Fb9a543a74a9C5aad334cAd47B5a4B | Sonic Testnet |
| AccessNFT | 0x9C270EA210E741B550bF822625694D0f64c71492 | Sonic Testnet |
| AccessDAO | 0x0081FB567ae0851f8fa47E39c6e3882e9f91e10F | Sonic Testnet |

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

## DAO Structure
AccessChain operates as a decentralized autonomous organization (DAO) to ensure transparent and community-driven governance:

### Governance Model
- **Token-Based Voting**: ACCESS token holders can vote on key platform decisions
- **Proposal System**: Community members can submit and vote on proposals
- **Treasury Management**: Transparent fund allocation for platform development
- **Stakeholder Representation**: Equal voice for beneficiaries, NGOs, and donors

### DAO Features
- Proposal creation and voting
- Fund allocation tracking
- Community-driven feature development
- Transparent decision-making process

## Live Demo
Experience AccessChain's features firsthand:
- [AccessChain Live Demo](https://accesschain-core.vercel.app/)
- [Test User Credentials](https://github.com/Blockbridge-Network/Team-AccessChain-Core/wiki/Test-Accounts)

## Business Model
AccessChain's sustainable business model focuses on long-term impact while ensuring platform sustainability:

### Revenue Streams
1. **Platform Fees**
   - Small transaction fee (0.5%) on successful grant distributions
   - Premium features for NGOs and organizations
   - API access for third-party integrations

2. **Token Economics**
   - ACCESS token utility in governance
   - Staking rewards for long-term holders
   - Token-based premium features

3. **Partnership Revenue**
   - Integration fees from partner organizations
   - Custom solution development
   - Enterprise licensing



