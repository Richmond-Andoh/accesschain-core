import React from 'react';
import { useContractRead, useAccount, useNetwork } from 'wagmi';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS } from '../config/contracts';

export function ContractTest() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  // Test reading from NGOAccessControl
  const { data: isAdmin, isLoading } = useContractRead({
    address: CONTRACT_ADDRESSES.NGOAccessControl,
    abi: CONTRACT_ABIS.ngoAccessControl,
    functionName: 'hasRole',
    args: [
      '0x0000000000000000000000000000000000000000000000000000000000000000', // DEFAULT_ADMIN_ROLE
      address
    ],
    enabled: isConnected && chain?.id === 57054,
  });

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  if (chain?.id !== 57054) {
    return <div>Please switch to Sonic Blaze Testnet</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Contract Integration Test</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Connected Wallet</h3>
          <p className="text-gray-600 break-all">{address}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold">NGO Access Control</h3>
          <p className="text-gray-600">
            Is Admin: {isLoading ? 'Loading...' : isAdmin ? '✅ Yes' : '❌ No'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Contract: {CONTRACT_ADDRESSES.NGOAccessControl}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Deployed Contracts</h3>
          <ul className="space-y-2">
            {Object.entries(CONTRACT_ADDRESSES).map(([name, address]) => (
              name !== 'ngoAccessControl' && (
                <li key={name} className="flex items-center">
                  <span className="font-medium w-40">{name}:</span>
                  <span className="text-sm bg-gray-100 p-1 rounded break-all">
                    {address}
                  </span>
                </li>
              )
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
