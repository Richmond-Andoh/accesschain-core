import { KRNLClient } from "@krnl-dev/sdk-react-7702"

/**
 * KRNL Token Bridge Service
 */
class KRNLTokenBridgeService {
    private client: KRNLClient;
    private static instance: KRNLTokenBridgeService;

    private constructor() {
        this.client = new KRNLClient({
            apiKey: process.env.KRNL_API_KEY,
            network: process.env.KRNL_NETWORK || 'testnet'
        });
    }

    public static getInstance(): KRNLTokenBridgeService {
        if (!KRNLTokenBridgeService.instance) {
            KRNLTokenBridgeService.instance = new KRNLTokenBridgeService();
        }
        return KRNLTokenBridgeService.instance;
    }

    /**
     * Bridge ACCESS tokens to KRNL network
     * @param amount Amount of tokens to bridge
     * @param userAddress User's blockchain address
     */
    async bridgeToKRNL(amount: string, userAddress: string) {
        try {
            const bridgeRequest = await this.client.bridge.createTransfer({
                type: 'ACCESS_TO_KRNL',
                amount,
                sender: userAddress
            });

            return bridgeRequest.id;
        } catch (error) {
            console.error('KRNL bridge transfer failed:', error);
            throw error;
        }
    }

    /**
     * Bridge tokens back from KRNL network
     * @param amount Amount of tokens to bridge back
     * @param userAddress User's blockchain address
     */
    async bridgeFromKRNL(amount: string, userAddress: string) {
        try {
            const bridgeRequest = await this.client.bridge.createTransfer({
                type: 'KRNL_TO_ACCESS',
                amount,
                recipient: userAddress
            });

            return bridgeRequest.id;
        } catch (error) {
            console.error('KRNL bridge transfer failed:', error);
            throw error;
        }
    }

    /**
     * Check bridge transfer status
     * @param transferId Transfer request ID
     */
    async checkTransferStatus(transferId: string) {
        try {
            const status = await this.client.bridge.getTransferStatus(transferId);
            return status;
        } catch (error) {
            console.error('Failed to check transfer status:', error);
            throw error;
        }
    }

    /**
     * Get bridged token balance on KRNL network
     * @param userAddress User's blockchain address
     */
    async getKRNLBalance(userAddress: string) {
        try {
            const balance = await this.client.bridge.getBalance(userAddress);
            return balance;
        } catch (error) {
            console.error('Failed to get KRNL balance:', error);
            throw error;
        }
    }
}

export default KRNLTokenBridgeService;