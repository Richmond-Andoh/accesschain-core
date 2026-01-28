import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../../context/ContractContext';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Card,
  CardBody,
  Badge,
  Code,
  Divider,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Icon,
  HStack,
  useColorModeValue,
  ScaleFade,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { useKRNL } from '@krnl-dev/sdk-react-7702';
import { ethers } from 'ethers';
import { DEMO_CONTRACTS, NGO_REGISTRY_ABI } from '../../config/demo-contracts';
import { MdCheckCircle, MdSecurity, MdCloudDone, MdAccountBalance } from 'react-icons/md';

const steps = [
  { title: 'Information', description: 'NGO Registration Details' },
  { title: 'KRNL node', description: 'Computing Proof' },
  { title: 'Blockchain', description: 'Verified in Registry' },
  { title: 'AccessChain', description: 'Join Platform Role' },
];

const KRNLDemo = () => {
  const [ngoName, setNgoName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [proof, setProof] = useState(null);
  const [txHash, setTxHash] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('blue.100', 'blue.900');
  
  // KRNL SDK Hook
  const krnl = useKRNL(); 
  
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const handleVerify = async () => {
    try {
      if (!ngoName || !regNumber) {
        toast({
          title: 'Missing Information',
          description: 'NGO Name and Registration Number are required.',
          status: 'warning',
          duration: 3000,
        });
        return;
      }

      setIsLoading(true);
      setActiveStep(1);

      // Simulate KRNL Node Computation
      console.log("Requesting KRNL verification...");
      
      // In a real environment, we'd call verify:
      // const result = await verify({ ngoName, regNumber });
      
      await new Promise(r => setTimeout(r, 2500)); // Simulating network latency
      
      const mockResult = {
        proof: ethers.hexlify(ethers.randomBytes(65)),
        extraData: ethers.toUtf8Bytes(JSON.stringify({ ngoName, regNumber, timestamp: Date.now() }))
      };
      
      setProof(mockResult);
      setActiveStep(2);
      setIsLoading(false);

      toast({
        title: 'KRNL Proof Generated',
        description: 'Off-chain verification successful.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setActiveStep(0);
      toast({
        title: 'KRNL Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const { registerAsNGO, userRole } = useContract();

  const handleRegister = async () => {
    try {
      if (!proof) return;
      
      setIsLoading(true);
      
      if (!window.ethereum) {
        throw new Error("MetaMask or similar wallet not detected.");
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const contract = new ethers.Contract(
        DEMO_CONTRACTS.NGORegistryDemo,
        NGO_REGISTRY_ABI,
        signer
      );
      
      const authData = {
        proof: proof.proof,
        extraData: proof.extraData
      };

      console.log("Submitting to Sepolia:", authData);
      
      const tx = await contract.registerNGO(authData);
      setTxHash(tx.hash);
      
      toast({
        title: 'Transaction Broadcasted',
        description: 'Waiting for Sepolia confirmation...',
        status: 'info',
        duration: 5000,
      });
      
      await tx.wait();
      
      setActiveStep(3);
      setIsLoading(false);
      
      toast({
        title: 'NGO Verified!',
        description: 'Your organization is now verified in the KRNL Registry. Next, join the AccessChain platform.',
        status: 'success',
        duration: 6000,
      });
      
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      
      // Detailed error handling for the demo
      let title = 'Registration Unsuccessful';
      let message = error.message;
      let status = 'error';

      if (message.includes("Invalid KRNL proof")) {
        title = 'Verification Rejected';
        message = "The contract correctly rejected the mock proof. In a non-demo environment, only proofs from authorized KRNL nodes are accepted.";
        status = 'warning';
      } else if (message.includes('user rejected')) {
        title = 'Transaction Cancelled';
        message = 'You declined the transaction request.';
        status = 'info';
      }
      
      toast({
        title,
        description: message,
        status,
        duration: 8000,
        isClosable: true,
      });
    }
  };

  const handleJoinPlatform = async () => {
    try {
      setIsLoading(true);
      await registerAsNGO();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Platform Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Container maxW="container.md" py={12}>
      <VStack spacing={10} align="stretch">
        <VStack spacing={3} textAlign="center">
          <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
            KRNL Studio Integration
          </Badge>
          <Heading size="xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
            NGO Verification Portal
          </Heading>
          <Text color="gray.500" fontSize="lg">
            Decentralized identity verification powered by KRNL Protocol
          </Text>
        </VStack>

        <Box px={4}>
          <Stepper index={activeStep} colorScheme="blue" size="lg">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink='0' ml={4}>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        </Box>

        <ScaleFade initialScale={0.95} in={true}>
          <Card 
            variant="outline" 
            borderColor={borderColor} 
            borderWidth="2px" 
            bg={cardBg}
            boxShadow="xl"
            borderRadius="2xl"
          >
            <CardBody p={8}>
              {activeStep === 0 && (
                <VStack spacing={6}>
                  <HStack w="full" spacing={4}>
                    <Icon as={MdAccountBalance} boxSize={6} color="blue.500" />
                    <Heading size="md">Organization Details</Heading>
                  </HStack>
                  
                  <FormControl>
                    <FormLabel fontWeight="600">NGO Official Name</FormLabel>
                    <Input 
                      variant="filled"
                      placeholder="e.g. Global Health Initiative" 
                      value={ngoName}
                      onChange={(e) => setNgoName(e.target.value)}
                      size="lg"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontWeight="600">State Registration Number</FormLabel>
                    <Input 
                      variant="filled"
                      placeholder="e.g. REG-12345-ABC" 
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      size="lg"
                    />
                  </FormControl>

                  <Button 
                    colorScheme="blue" 
                    size="lg"
                    width="full" 
                    onClick={handleVerify}
                    isLoading={isLoading}
                    loadingText="Consulting KRNL Node..."
                    leftIcon={<MdSecurity />}
                    h="60px"
                    fontSize="md"
                  >
                    Generate Verification Proof
                  </Button>
                </VStack>
              )}

              {activeStep === 1 && (
                <VStack spacing={8} py={4}>
                  <Spinner size="xl" thickness="4px" speed="0.8s" color="blue.500" />
                  <VStack spacing={2}>
                    <Heading size="md">KRNL Computation in Progress</Heading>
                    <Text color="gray.500" textAlign="center">
                      KRNL nodes are verifying your registry details off-chain to generate a cryptographic proof.
                    </Text>
                  </VStack>
                  <List spacing={3} w="full">
                    <ListItem fontSize="sm" color="gray.600">
                      <ListIcon as={MdCheckCircle} color="green.500" />
                      Connecting to KRNL Workflow Gateway
                    </ListItem>
                    <ListItem fontSize="sm" color="gray.600">
                      <ListIcon as={MdCheckCircle} color="green.500" />
                      Validating Registration Authority Data
                    </ListItem>
                    <ListItem fontSize="sm" color="gray.600">
                      <ListIcon as={Spinner} size="xs" color="blue.500" />
                      Signing Attestation for Sepolia
                    </ListItem>
                  </List>
                </VStack>
              )}

              {activeStep >= 2 && proof && (
                <VStack spacing={6} align="stretch">
                  <Box p={4} bg="green.50" borderRadius="lg" border="1px solid" borderColor="green.200">
                    <HStack>
                      <Icon as={MdCloudDone} color="green.500" boxSize={6} />
                      <Text fontWeight="bold" color="green.700">Proof Securely Generated</Text>
                    </HStack>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="600" mb={1} color="gray.500">CRYPTOGRAPHIC PROOF (KRNL SIGNATURE)</Text>
                    <Code p={3} borderRadius="md" fontSize="xs" wordBreak="break-all" w="full" bg="gray.100">
                      {proof.proof}
                    </Code>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="600" mb={1} color="gray.500">ATTESTED DATA</Text>
                    <Code p={3} borderRadius="md" fontSize="xs" wordBreak="break-all" w="full" bg="gray.100">
                      {ethers.hexlify(proof.extraData)}
                    </Code>
                  </Box>

                  {activeStep === 2 && (
                    <Button 
                      colorScheme="green" 
                      size="lg"
                      width="full" 
                      onClick={handleRegister}
                      isLoading={isLoading}
                      loadingText="Submitting to Chain..."
                      h="60px"
                      fontSize="lg"
                      boxShadow="lg"
                    >
                      Register on Blockchain
                    </Button>
                  )}

                  {activeStep === 3 && (
                    <VStack spacing={6} py={4}>
                      <Icon as={MdCheckCircle} color="green.500" boxSize={16} />
                      <VStack spacing={2}>
                        <Heading size="md">NGO Verified in Registry!</Heading>
                        <Text color="gray.500" textAlign="center">
                          Your organization is verified in the KRNL Registry. Now, finalize your role on the platform to access the dashboard.
                        </Text>
                      </VStack>
                      
                      {userRole === 'NGO' || userRole === 'ADMIN' ? (
                        <Box textAlign="center">
                          <Badge colorScheme="green" variant="solid" mb={4}>ROLE: {userRole}</Badge>
                          <Button 
                            colorScheme="blue" 
                            size="lg" 
                            width="full" 
                            onClick={() => navigate('/ngo-dashboard')}
                          >
                            Go to NGO Dashboard
                          </Button>
                        </Box>
                      ) : (
                        <Button 
                          colorScheme="purple" 
                          size="lg"
                          width="full" 
                          onClick={handleJoinPlatform}
                          isLoading={isLoading}
                          loadingText="Joining Platform..."
                          h="60px"
                          fontSize="lg"
                          boxShadow="lg"
                        >
                          Join AccessChain Platform
                        </Button>
                      )}

                      {txHash && (
                        <Button 
                          as="a" 
                          href={`https://sepolia.etherscan.io/tx/${txHash}`} 
                          target="_blank"
                          variant="outline"
                          size="sm"
                        >
                          View Etherscan: Registry
                        </Button>
                      )}
                      <Button onClick={() => setActiveStep(0)} variant="ghost" size="sm">Register Another</Button>
                    </VStack>
                  )}
                </VStack>
              )}
            </CardBody>
          </Card>
        </ScaleFade>

        <Box textAlign="center" color="gray.400" fontSize="sm">
          <Text>Current Network: Sepolia Testnet</Text>
          <Text>Contract: {DEMO_CONTRACTS.NGORegistryDemo}</Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default KRNLDemo;
