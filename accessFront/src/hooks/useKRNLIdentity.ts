import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import KRNLIdentityService from '../services/krnl/KRNLIdentityService';

export const useKRNLIdentity = () => {
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const krnlService = KRNLIdentityService.getInstance();

    /**
     * Submit disability documentation for verification
     */
    const submitVerification = useCallback(async (documentData: any) => {
        if (!address) throw new Error('Wallet not connected');
        
        setIsLoading(true);
        setError(null);
        
        try {
            const requestId = await krnlService.submitVerification(documentData, address);
            return requestId;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    /**
     * Check verification status
     */
    const checkVerificationStatus = useCallback(async (requestId: string) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const status = await krnlService.checkVerificationStatus(requestId);
            return status;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Get user's DID
     */
    const getUserDID = useCallback(async () => {
        if (!address) throw new Error('Wallet not connected');
        
        setIsLoading(true);
        setError(null);
        
        try {
            const did = await krnlService.getUserDID(address);
            return did;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    /**
     * Verify a zero-knowledge proof
     */
    const verifyZKProof = useCallback(async (proof: any) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const isValid = await krnlService.verifyZKProof(proof);
            return isValid;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        submitVerification,
        checkVerificationStatus,
        getUserDID,
        verifyZKProof,
        isLoading,
        error
    };
};

export default useKRNLIdentity;