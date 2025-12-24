import { KRNL, KRNLConfig } from "@krnl-dev/sdk-react-7702"

/**
 * KRNL Identity Service integration
 */
class KRNLIdentityService {
    private krnl: KRNL;
    private static instance: KRNLIdentityService;

    private constructor() {
        // Initialize KRNL with default configuration
        const config: KRNLConfig = {
            env: 'testnet',
            projectId: process.env.REACT_APP_KRNL_PROJECT_ID || '',
            network: 'sonic-blaze'
        };
        
        this.krnl = new KRNL(config);
    }

    public static getInstance(): KRNLIdentityService {
        if (!KRNLIdentityService.instance) {
            KRNLIdentityService.instance = new KRNLIdentityService();
        }
        return KRNLIdentityService.instance;
    }

    /**
     * Submit disability documentation for verification
     * @param documentData Document data
     * @param userAddress User's blockchain address
     */
    async submitVerification(documentData: any, userAddress: string) {
        try {
            // Create a new identity verification request
            const verificationRequest = await this.client.identity.createVerification({
                type: 'DISABILITY_VERIFICATION',
                subject: userAddress,
                document: documentData
            });

            return verificationRequest.id;
        } catch (error) {
            console.error('KRNL verification request failed:', error);
            throw error;
        }
    }

    /**
     * Check verification status
     * @param requestId Verification request ID
     */
    async checkVerificationStatus(requestId: string) {
        try {
            const status = await this.client.identity.getVerificationStatus(requestId);
            return status;
        } catch (error) {
            console.error('Failed to check verification status:', error);
            throw error;
        }
    }

    /**
     * Get user's DID
     * @param userAddress User's blockchain address
     */
    async getUserDID(userAddress: string) {
        try {
            const did = await this.client.identity.getDID(userAddress);
            return did;
        } catch (error) {
            console.error('Failed to get user DID:', error);
            throw error;
        }
    }

    /**
     * Verify a zero-knowledge proof of disability
     * @param proof Zero-knowledge proof
     */
    async verifyZKProof(proof: any) {
        try {
            const isValid = await this.client.identity.verifyProof(proof);
            return isValid;
        } catch (error) {
            console.error('Failed to verify ZK proof:', error);
            throw error;
        }
    }
}

export default KRNLIdentityService;