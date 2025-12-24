import { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import KRNLTokenBridgeService from '../services/krnl/KRNLTokenBridgeService';

export const useKRNLTokenBridge = () => {
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const bridgeService = KRNLTokenBridgeService.getInstance();

    /**
     * Bridge tokens to KRNL network
     */
    const bridgeToKRNL = useCallback(async (amount: string) => {
        if (!address) throw new Error('Wallet not connected');
        
        setIsLoading(true);
        setError(null);
        
        try {
            const requestId = await bridgeService.bridgeToKRNL(amount, address);
            return requestId;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    /**
     * Bridge tokens from KRNL network
     */
    const bridgeFromKRNL = useCallback(async (amount: string) => {
        if (!address) throw new Error('Wallet not connected');
        
        setIsLoading(true);
        setError(null);
        
        try {
            const requestId = await bridgeService.bridgeFromKRNL(amount, address);
            return requestId;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    /**
     * Check bridge transfer status
     */
    const checkTransferStatus = useCallback(async (transferId: string) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const status = await bridgeService.checkTransferStatus(transferId);
            return status;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Get KRNL network balance
     */
    const getKRNLBalance = useCallback(async () => {
        if (!address) throw new Error('Wallet not connected');
        
        setIsLoading(true);
        setError(null);
        
        try {
            const balance = await bridgeService.getKRNLBalance(address);
            return balance;
        } catch (err) {
            setError(err as Error);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    return {
        bridgeToKRNL,
        bridgeFromKRNL,
        checkTransferStatus,
        getKRNLBalance,
        isLoading,
        error
    };
};

export default useKRNLTokenBridge;