# KRNL Integration in Access Chain

This document outlines how KRNL is integrated into the Access Chain project to enhance its functionality.

## Overview

KRNL is integrated into Access Chain to provide:
- Decentralized data indexing for efficient querying
- Cross-chain interoperability
- Automated workflows and smart contract interactions

## Configuration

### Environment Variables

Create a `.env` file in the `accessFront` directory with the following variables:

```env
VITE_KRNL_APP_ID=cmhr3ycpl00iljj0cy83eszxb
VITE_KRNL_API_KEY=your_krnl_api_key
VITE_DEFAULT_CHAIN_ID=57054  # Sonic Blaze Testnet
```

## Key Components

### 1. KRNL Context (`/src/context/KRNLContext.js`)

This context provides KRNL functionality throughout the application, including:
- User authentication
- Grant management
- Data querying
- Cross-chain operations

### 2. Custom Hooks (`/src/hooks/useKRNL.js`)

Custom hooks for interacting with KRNL:
- `useKRNLQuery`: For data querying
- `useGrantKRNL`: For grant management
- `useKRNLBridge`: For cross-chain operations

### 3. Configuration (`/src/config/krnl.js`)

KRNL SDK initialization and common queries.

## Usage Examples

### Querying Grants

```javascript
import { useKRNLQuery } from '../hooks/useKRNL';

function GrantsList() {
  const { data: grants, loading, error } = useKRNLQuery({
    query: `
      query GetActiveGrants {
        grants(where: { status: "active" }) {
          id
          title
          description
          amountRaised
          fundingGoal
        }
      }
    `
  });

  // Render grants...
}
```

### Creating a Grant

```javascript
import { useGrantKRNL } from '../hooks/useKRNL';

function CreateGrantForm() {
  const { createGrant, processing } = useGrantKRNL();
  
  const handleSubmit = async (grantData) => {
    try {
      const result = await createGrant({
        title: grantData.title,
        description: grantData.description,
        fundingGoal: grantData.goal,
        // ... other fields
      });
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  
  // Render form...
}
```

## Cross-Chain Operations

KRNL enables cross-chain functionality through the `useKRNLBridge` hook:

```javascript
import { useKRNLBridge } from '../hooks/useKRNL';

function DonationButton({ amount, token, recipient }) {
  const { bridgeTokens } = useKRNLBridge();
  
  const handleDonate = async () => {
    try {
      await bridgeTokens({
        fromChain: 'ethereum',
        toChain: 'sonic-blaze',
        token,
        amount,
        recipient
      });
      // Handle success
    } catch (error) {
      // Handle error
    }
  };
  
  return <button onClick={handleDonate}>Donate</button>;
}
```

## Testing

To test the KRNL integration:

1. Set up your `.env` file with valid credentials
2. Start the development server:
   ```bash
   cd accessFront
   npm run dev
   ```
3. Navigate to the grants page and verify data loading
4. Test grant creation and management
5. Verify cross-chain functionality (if applicable)

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify your KRNL app ID and API key
2. **Network Errors**: Ensure you're connected to the correct network (Sonic Blaze Testnet)
3. **Query Failures**: Check the query syntax and required fields

## Next Steps

1. Implement more complex queries as needed
2. Add error boundaries for better error handling
3. Implement caching for better performance
4. Add more cross-chain functionality as needed

For more information, refer to the [KRNL Documentation](https://docs.krnl.xyz/).
