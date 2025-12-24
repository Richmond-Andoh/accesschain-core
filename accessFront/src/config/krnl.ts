import { KRNLConfig } from '@krnl-dev/sdk-react-7702';

export const krnlConfig: KRNLConfig = {
    projectId: import.meta.env.VITE_KRNL_PROJECT_ID || '',
    network: 'sonic-blaze'
};