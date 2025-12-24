import { useState, useEffect } from 'react';
import { krnl, fetchGrants } from '../config/krnl';

// Custom hook for KRNL queries
export function useKRNLQuery(query, variables = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await krnl.query(query, variables);
        setData(result.data);
      } catch (err) {
        console.error('KRNL Query Error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, JSON.stringify(variables)]);

  return { data, loading, error };
}

// Hook for grant management
export function useGrantKRNL() {
  const [processing, setProcessing] = useState(false);

  const createGrant = async (grantData) => {
    try {
      setProcessing(true);
      const result = await krnl.mutate({
        mutation: `
          mutation CreateGrant($input: GrantInput!) {
            createGrant(input: $input) {
              id
              title
              status
            }
          }
        `,
        variables: {
          input: grantData
        }
      });
      return result.data.createGrant;
    } catch (error) {
      console.error('Error creating grant:', error);
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const getGrantById = async (grantId) => {
    try {
      const { data } = await krnl.query({
        query: `
          query GetGrant($id: ID!) {
            grant(id: $id) {
              id
              title
              description
              status
              amountRaised
              fundingGoal
              milestones {
                id
                title
                description
                amount
                status
              }
            }
          }
        `,
        variables: { id: grantId }
      });
      return data.grant;
    } catch (error) {
      console.error('Error fetching grant:', error);
      throw error;
    }
  };

  return {
    createGrant,
    getGrantById,
    fetchGrants,
    processing
  };
}

// Hook for cross-chain transactions
export function useKRNLBridge() {
  const bridgeTokens = async ({ fromChain, toChain, token, amount, recipient }) => {
    try {
      const result = await krnl.bridge({
        fromChain,
        toChain,
        token,
        amount,
        recipient,
        onProgress: (progress) => {
          console.log('Bridge progress:', progress);
        }
      });
      return result;
    } catch (error) {
      console.error('Bridge error:', error);
      throw error;
    }
  };

  return { bridgeTokens };
}
