import React, { createContext, useContext } from 'react';
// import { useAccount } from 'wagmi'; // Will use mock alias

const ContractContext = createContext();

export function ContractProvider({ children }) {
  // Mock State
  const isVerified = false;
  const userRole = null;
  const grants = [];
  const loading = false;

  const verifyIdentity = async () => true;
  const createGrant = async () => {};
  const applyForGrant = async () => {};
  const loadGrants = async () => {};
  const checkVerification = async () => {};

  const value = {
    isVerified,
    userRole,
    verifyIdentity,
    createGrant,
    applyForGrant,
    grants,
    loading,
    checkVerification,
    loadGrants
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}

export function useContract() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    // Return dummy if provider is missing (e.g. if I removed provider from App.jsx)
    return {
        isVerified: false,
        userRole: null,
        grants: [],
        loading: false,
        verifyIdentity: async () => {},
        createGrant: async () => {},
        applyForGrant: async () => {},
        checkVerification: async () => {},
        loadGrants: async () => {} 
    };
  }
  return context;
}
