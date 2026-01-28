# Ethereum Sepolia Testnet Setup Guide

## 🌐 Network Information

- **Network Name**: Ethereum Sepolia
- **RPC URL**: https://rpc.sepolia.org
- **Chain ID**: 11155111
- **Currency Symbol**: ETH
- **Block Explorer**: https://sepolia.etherscan.io

## 🔧 Quick Setup

### 1. Add Sepolia to MetaMask

**Option A: Automatic (Recommended)**

- Visit https://chainlist.org
- Search for "Sepolia"
- Click "Add to MetaMask"

**Option B: Manual**

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Enter details:
   - Network Name: `Sepolia`
   - RPC URL: `https://rpc.sepolia.org`
   - Chain ID: `11155111`
   - Currency Symbol: `ETH`
   - Block Explorer: `https://sepolia.etherscan.io`

### 2. Get Test ETH

**Faucets (choose one):**

1. **Alchemy Sepolia Faucet** (Recommended)

   - https://sepoliafaucet.com
   - Requires Alchemy account (free)
   - 0.5 ETH per day

2. **Infura Sepolia Faucet**

   - https://www.infura.io/faucet/sepolia
   - Requires Infura account (free)
   - 0.5 ETH per day

3. **QuickNode Faucet**

   - https://faucet.quicknode.com/ethereum/sepolia
   - No account needed
   - 0.1 ETH per request

4. **Sepolia PoW Faucet**
   - https://sepolia-faucet.pk910.de
   - Mine for test ETH (no account needed)
   - Variable amount

### 3. Configure Environment

Create `.env` file:

```bash
# Your wallet private key (export from MetaMask)
PRIVATE_KEY=your_private_key_here

# Sepolia RPC (public - no API key needed)
SEPOLIA_RPC_URL=https://rpc.sepolia.org

# OR use Alchemy for better reliability (recommended)
ALCHEMY_API_KEY=your_alchemy_api_key_here
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_api_key_here
```

**Get Alchemy API Key (Free):**

1. Go to https://www.alchemy.com
2. Sign up for free account
3. Create new app → Select "Ethereum" → "Sepolia"
4. Copy API key

### 4. Deploy Contracts

```bash
# Compile
npm run compile

# Deploy to Sepolia
npm run deploy:demo
```

### 5. Verify Contracts (Optional but Recommended)

```bash
# Get Etherscan API key from https://etherscan.io/apis
# Add to .env:
ETHERSCAN_API_KEY=your_etherscan_api_key

# Verify contracts
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## 📊 Network Comparison

| Feature            | Sepolia        | Sonic Blaze    |
| ------------------ | -------------- | -------------- |
| **Ecosystem**      | Ethereum       | Sonic          |
| **Maturity**       | High           | Medium         |
| **Faucets**        | Many           | Limited        |
| **Block Explorer** | Etherscan      | Sonicscan      |
| **Community**      | Large          | Growing        |
| **Gas Costs**      | Free (testnet) | Free (testnet) |
| **Stability**      | Very Stable    | Stable         |

## 🔍 Useful Links

- **Block Explorer**: https://sepolia.etherscan.io
- **Faucet List**: https://faucetlink.to/sepolia
- **Network Stats**: https://sepolia.beaconcha.in
- **Gas Tracker**: https://sepolia.etherscan.io/gastracker

## ⚠️ Important Notes

1. **Never use mainnet private keys on testnet**
2. **Test ETH has no real value**
3. **Faucets have rate limits** - use multiple if needed
4. **Save your test wallet** - reuse for future testing
5. **Public RPCs may be slow** - use Alchemy/Infura for production

## 🆘 Troubleshooting

### Issue: Faucet not working

**Solution**: Try a different faucet from the list above

### Issue: RPC connection timeout

**Solution**:

- Use Alchemy RPC instead of public RPC
- Check internet connection
- Try alternative RPC: `https://ethereum-sepolia.publicnode.com`

### Issue: Insufficient funds for deployment

**Solution**:

- Check balance: https://sepolia.etherscan.io/address/YOUR_ADDRESS
- Request more from faucet
- Wait 24 hours and try again

### Issue: Nonce too high error

**Solution**:

```bash
# Reset MetaMask account
# Settings → Advanced → Clear activity tab data
```

## ✅ Ready to Deploy!

Once you have:

- ✅ Sepolia added to MetaMask
- ✅ Test ETH in your wallet (check on Etherscan)
- ✅ `.env` configured
- ✅ Contracts compiled

Run:

```bash
npm run deploy:demo
```

Your contracts will be deployed to Sepolia and addresses will be saved automatically!
