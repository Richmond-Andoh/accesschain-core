import { KRNLProvider, defaultConfig } from '@krnl-dev/sdk-react-7702';
import { ReactNode } from 'react';

interface KRNLWrapperProps {
    children: ReactNode;
}

export function KRNLWrapper({ children }: KRNLWrapperProps) {
    const config = {
        ...defaultConfig,
        projectId: import.meta.env.VITE_KRNL_PROJECT_ID,
        chainId: 57054, // Sonic Blaze Testnet
    };

    return (
        <KRNLProvider config={config}>
            {children}
        </KRNLProvider>
    );
}