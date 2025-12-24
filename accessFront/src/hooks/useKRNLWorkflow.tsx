import { useKRNL } from '@krnl-dev/sdk-react-7702';
import { useCallback } from 'react';

export function useKRNLWorkflow() {
    const krnl = useKRNL();

    const startVerificationWorkflow = useCallback(async (documentHash: string) => {
        try {
            // Start a new verification workflow
            const workflow = await krnl.startWorkflow({
                name: 'Disability Verification',
                steps: [
                    {
                        name: 'Document Upload',
                        data: {
                            documentHash
                        }
                    },
                    {
                        name: 'Verification',
                        data: {
                            type: 'disability'
                        }
                    }
                ]
            });

            return workflow;
        } catch (error) {
            console.error('Error starting verification workflow:', error);
            throw error;
        }
    }, [krnl]);

    const getWorkflowStatus = useCallback(async (workflowId: string) => {
        try {
            const status = await krnl.getWorkflowStatus(workflowId);
            return status;
        } catch (error) {
            console.error('Error getting workflow status:', error);
            throw error;
        }
    }, [krnl]);

    return {
        startVerificationWorkflow,
        getWorkflowStatus,
        isConnected: krnl.isConnected,
        address: krnl.address
    };
}