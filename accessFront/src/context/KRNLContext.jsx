import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { krnl } from '../config/krnl';

const KRNLContext = createContext();

export function KRNLProvider({ children }) {
  const { address } = useAccount();
  const [isInitialized, setIsInitialized] = useState(false);
  const [userGrants, setUserGrants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize KRNL with user session
  useEffect(() => {
    const initializeKRNL = async () => {
      try {
        setLoading(true);
        if (address) {
          await krnl.authenticate({ address });
          setIsInitialized(true);
          // Fetch user's grants
          const grants = await krnl.query({
            query: `
              query GetUserGrants($creator: String!) {
                grants(filters: { creator: $creator }) {
                  id
                  title
                  status
                  amountRaised
                  fundingGoal
                }
              }
            `,
            variables: { creator: address.toLowerCase() }
          });
          setUserGrants(grants.data.grants || []);
        }
      } catch (err) {
        console.error('KRNL Initialization Error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      initializeKRNL();
    }

    return () => {
      // Cleanup on unmount
      krnl.disconnect();
    };
  }, [address]);

  // Refresh user grants
  const refreshGrants = async () => {
    if (!address) return;
    try {
      const { data } = await krnl.query({
        query: `
          query GetUserGrants($creator: String!) {
            grants(filters: { creator: $creator }) {
              id
              title
              status
              amountRaised
              fundingGoal
            }
          }
        `,
        variables: { creator: address.toLowerCase() }
      });
      setUserGrants(data.grants || []);
    } catch (err) {
      console.error('Error refreshing grants:', err);
      setError(err);
    }
  };

  return (
    <KRNLContext.Provider
      value={{
        isInitialized,
        userGrants,
        loading,
        error,
        refreshGrants,
        krnl
      }}
    >
      {children}
    </KRNLContext.Provider>
  );
}

export const useKRNL = () => {
  const context = useContext(KRNLContext);
  if (context === undefined) {
    throw new Error('useKRNL must be used within a KRNLProvider');
  }
  return context;
};
