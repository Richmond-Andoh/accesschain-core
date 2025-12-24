import { useKRNL } from '@krnl-dev/sdk-react-7702';
import { useState, useCallback } from 'react';

export const useKRNLIdentity = () => {
    const krnl = useKRNL();
    const [isProcessing, setIsProcessing] = useState(false);

    /**
     * Submit disability documentation for verification
     * @param documentData The disability documentation data
     */
    const submitVerification = useCallback(async (documentData: File) => {
        setIsProcessing(true);
        try {
            // Upload document to KRNL
            const uploadResult = await krnl.upload(documentData);
            
            // Create verification request
            const verificationResult = await krnl.verify({
                type: 'DISABILITY_DOCUMENT',
                document: uploadResult.documentId
            });

            return verificationResult;
        } catch (error) {
            console.error('Error submitting verification:', error);
            throw error;
        } finally {
            setIsProcessing(false);
        }
    }, [krnl]);

    /**
     * Check the status of a verification
     * @param verificationId The ID of the verification to check
     */
    const checkVerificationStatus = useCallback(async (verificationId: string) => {
        try {
            const status = await krnl.getVerificationStatus(verificationId);
            return status;
        } catch (error) {
            console.error('Error checking verification status:', error);
            throw error;
        }
    }, [krnl]);

    /**
     * Generate a zero-knowledge proof of disability verification
     */
    const generateProof = useCallback(async () => {
        try {
            const proof = await krnl.generateProof({
                type: 'DISABILITY_VERIFICATION'
            });
            return proof;
        } catch (error) {
            console.error('Error generating proof:', error);
            throw error;
        }
    }, [krnl]);

    return {
        submitVerification,
        checkVerificationStatus,
        generateProof,
        isProcessing
    };
};