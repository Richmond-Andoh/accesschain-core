import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  Text,
  useToast,
  Textarea,
  Alert,
  AlertIcon,
  Progress,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
} from '@chakra-ui/react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { useParams } from 'react-router-dom';
import { accessGrantABI } from '../../constants/abis';
import { CONTRACT_ADDRESSES } from '../../constants/addresses';
import { ensureCorrectNetwork } from '../../utils/networkUtils';

const ApplyGrant = () => {
  const { grantId } = useParams();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [proposal, setProposal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [grantDetails, setGrantDetails] = useState(null);

  useEffect(() => {
    fetchGrantDetails();
  }, [grantId]);

  const fetchGrantDetails = async () => {
    try {
      await ensureCorrectNetwork();
      const grant = await publicClient.readContract({
        address: CONTRACT_ADDRESSES.AccessGrant,
        abi: accessGrantABI,
        functionName: 'grants',
        args: [grantId],
      });

      setGrantDetails(grant);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(await ensureCorrectNetwork())) return;
    try {
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESSES.AccessGrant,
        abi: accessGrantABI,
        functionName: 'applyForGrant',
        args: [grantId, proposal, '0x'],
        account: address,
      });

      const hash = await walletClient.writeContract(request);
      
      toast({
        title: 'Application Submitted',
        description: 'Your grant application has been submitted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setProposal('');

    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!grantDetails) {
    return <Progress size="xs" isIndeterminate />;
  }

  return (
    <Box p={8} maxW="800px" mx="auto">
      <VStack spacing={8} align="stretch">
        <Heading>Apply for Grant</Heading>
        
        <Box borderWidth="1px" borderRadius="lg" p={6}>
          <VStack align="stretch" spacing={4}>
            <Text fontWeight="bold" fontSize="xl">{grantDetails.title}</Text>
            <Text>{grantDetails.description}</Text>
            <Text>Total Amount: {grantDetails.totalAmount} ETH</Text>
            <Text>Deadline: {new Date(grantDetails.deadline * 1000).toLocaleDateString()}</Text>
          </VStack>
        </Box>

        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <FormControl isRequired>
              <FormLabel>Your Proposal</FormLabel>
              <Textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                placeholder="Describe your proposal and how you plan to use the grant..."
                minHeight="200px"
              />
            </FormControl>

            <Box mt={6}> 
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
              >
                Submit Application
              </Button>
            </Box>
          </VStack>
        </form>
      </VStack>

    </Box>
  );
};

export default ApplyGrant; 