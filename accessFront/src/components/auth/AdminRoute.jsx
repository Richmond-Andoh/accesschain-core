import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { useAdminAccessControl } from '../../hooks/useAdminAccessControl';

const AdminRoute = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { isAdmin, loading } = useAdminAccessControl();
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  if (!isConnected) {
    return (
      <Box bg={bgColor} minH="100vh" py={10}>
        <Container maxW="lg">
          <Alert
            status="warning"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            bg={useColorModeValue('white', 'gray.800')}
            borderRadius="xl"
            boxShadow="lg"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Wallet Not Connected
            </AlertTitle>
            <AlertDescription maxWidth="sm" mb={4}>
              Please connect your wallet to access the admin dashboard.
            </AlertDescription>
            <Button
              colorScheme="blue"
              onClick={() => window.location.href = '/'}
            >
              Return to Home
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box bg={bgColor} minH="100vh" py={10}>
        <Container maxW="lg">
          <VStack spacing={4} align="center">
            <Spinner size="xl" />
            <Alert status="info">
              <AlertTitle>Verifying Admin Access...</AlertTitle>
              <AlertDescription>
                Checking if {address?.slice(0, 6)}...{address?.slice(-4)} is authorized
              </AlertDescription>
            </Alert>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Box bg={bgColor} minH="100vh" py={10}>
        <Container maxW="lg">
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
            bg={useColorModeValue('white', 'gray.800')}
            borderRadius="xl"
            boxShadow="lg"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Access Denied
            </AlertTitle>
            <AlertDescription maxWidth="sm" mb={4}>
              Your wallet address ({address?.slice(0, 6)}...{address?.slice(-4)}) is not authorized.
              Please contact the contract owner to get admin access.
            </AlertDescription>
            <Button
              colorScheme="blue"
              onClick={() => window.location.href = '/'}
            >
              Return to Home
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  return children;
};

export default AdminRoute;