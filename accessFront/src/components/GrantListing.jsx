import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatEther } from 'viem';
import { usePublicClient } from 'wagmi';
import { DEMO_CONTRACTS, NGO_REGISTRY_ABI } from '../config/demo-contracts';
import { 
  Box, 
  Container, 
  Text, 
  Button, 
  SimpleGrid, 
  VStack, 
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel,
  useColorModeValue,
  Flex,
  Skeleton,
  useToast,
  Tooltip,
  Avatar,
  Heading,
  HStack,
  Icon
} from '@chakra-ui/react';
import { AddIcon, TimeIcon, InfoIcon, CheckIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { MdSecurity } from 'react-icons/md';
import { useGrantManagement } from '../hooks/useGrantManagement';

const GrantListing = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState(0);
  
  // Use the enhanced grant management hook
  const {
    grants,
    loading,
    error,
    isNGO,
    isConnected,
    isCorrectNetwork,
    transactionStatus,
    createGrant,
    applyForGrant,
    approveApplication,
    completeMilestone,
    refetchGrants,
    address
  } = useGrantManagement();
  
  const publicClient = usePublicClient();
  const [verifiedStatuses, setVerifiedStatuses] = useState({});
  
  // Fetch verification status for all unique grant owners
  React.useEffect(() => {
    const fetchStatuses = async () => {
      if (!grants || grants.length === 0 || !publicClient) return;
      
      const uniqueOwners = [...new Set(grants.map(g => g.ngo?.toLowerCase()).filter(Boolean))];
      const statusMap = { ...verifiedStatuses };
      
      await Promise.all(uniqueOwners.map(async (owner) => {
        if (statusMap[owner] !== undefined) return;
        
        try {
          const isVerified = await publicClient.readContract({
            address: DEMO_CONTRACTS.NGORegistryDemo,
            abi: NGO_REGISTRY_ABI,
            functionName: 'isVerifiedNGO',
            args: [owner],
          });
          statusMap[owner] = isVerified;
        } catch (err) {
          console.warn(`Could not fetch KRNL status for ${owner}:`, err);
          statusMap[owner] = false;
        }
      }));
      
      setVerifiedStatuses(statusMap);
    };
    
    fetchStatuses();
  }, [grants, publicClient]);
  
  // Color mode values for UI
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  const headerBg = useColorModeValue('blue.50', 'blue.900');
  const activeBadgeBg = useColorModeValue('green.100', 'green.800');
  const expiredBadgeBg = useColorModeValue('gray.100', 'gray.700');
  const ownedBadgeBg = useColorModeValue('purple.100', 'purple.800');

  // Handle grant application
  const handleApplyForGrant = async (grantId, proposal, amount) => {
    const result = await applyForGrant(grantId, proposal, amount);
    if (result?.success) {
      toast({
        title: 'Application submitted',
        description: 'Your application has been submitted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      refetchGrants();
    } else {
      toast({
        title: 'Error',
        description: result?.error || 'Failed to submit application',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle grant approval
  const handleApproveApplication = async (grantId, applicationId) => {
    const result = await approveApplication(grantId, applicationId);
    if (result?.success) {
      toast({
        title: 'Application approved',
        description: 'The application has been approved successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      refetchGrants();
    }
  };

  // Handle milestone completion
  const handleCompleteMilestone = async (grantId, milestoneIndex) => {
    const result = await completeMilestone(grantId, milestoneIndex);
    if (result?.success) {
      toast({
        title: 'Milestone completed',
        description: 'The milestone has been marked as completed',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      refetchGrants();
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  // Calculate time left until deadline
  const calculateTimeLeft = (deadline) => {
    if (!deadline) return 'N/A';
    const now = Math.floor(Date.now() / 1000);
    const timeLeftSeconds = Number(deadline) - now;
    
    if (timeLeftSeconds <= 0) return 'Expired';
    
    const days = Math.floor(timeLeftSeconds / (60 * 60 * 24));
    const hours = Math.floor((timeLeftSeconds % (60 * 60 * 24)) / (60 * 60));
    
    if (days > 0) return `${days} day${days !== 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} left`;
    
    const minutes = Math.floor((timeLeftSeconds % (60 * 60)) / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} left`;
  };

  // Filter grants based on tab selection
  const filteredGrants = grants.filter(grant => {
    if (tabIndex === 0) return true; // All grants
    if (tabIndex === 1) return grant.status === 0; // Open
    if (tabIndex === 2) return grant.status === 1; // In Progress
    if (tabIndex === 3) return grant.status === 2; // Completed
    return true;
  });

  // Loading state
  if (loading) {
    return (
      <Container maxW="7xl" py={8}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {[1, 2, 3].map((i) => (
            <Card key={i} bg={cardBg} borderRadius="lg" overflow="hidden" boxShadow="md">
              <Skeleton height="200px" />
              <CardBody>
                <Skeleton height="24px" mb={4} />
                <Skeleton height="16px" mb={2} />
                <Skeleton height="16px" width="80%" />
              </CardBody>
              <CardFooter>
                <Skeleton height="40px" width="100%" />
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxW="7xl" py={8} textAlign="center">
        <Text color="red.500" fontSize="lg" mb={4}>
          Error loading grants: {error}
        </Text>
        <Button colorScheme="blue" onClick={refetchGrants}>
          Retry
        </Button>
      </Container>
    );
  }

  // Empty state
  if (grants.length === 0) {
    return (
      <Container maxW="7xl" py={8} textAlign="center">
        <Text fontSize="lg" color={textColor} mb={4}>
          No grants available at the moment.
        </Text>
        {isNGO && (
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => navigate('/grants/create')}
          >
            Create Grant
          </Button>
        )}
      </Container>
    );
  }

  // Grant Card Component
  const GrantCard = ({ grant }) => {
    const isExpired = grant.deadline && Number(grant.deadline) < Math.floor(Date.now() / 1000);
    const isOwnedByCurrentUser = grant.ngo && address && grant.ngo.toLowerCase() === address.toLowerCase();
    const isKrnlVerified = grant.ngo && verifiedStatuses[grant.ngo.toLowerCase()];
    
    return (
      <Card 
        bg={cardBg}
        borderRadius="lg"
        overflow="hidden"
        boxShadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
        transition="all 0.2s"
      >
        <Box h="4px" bg={isExpired ? 'gray.400' : (isOwnedByCurrentUser ? 'purple.400' : 'blue.400')} />
        
        <CardHeader pb={2}>
          <Flex justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box flex="1">
              <Heading size="md" noOfLines={2} mb={2}>
                {grant.title || 'Untitled Grant'}
              </Heading>
              
              <Flex gap={2} flexWrap="wrap">
                <Badge 
                  colorScheme={isExpired ? 'gray' : 'green'}
                  variant="subtle"
                  px={2}
                  py={0.5}
                  borderRadius="full"
                >
                  {isExpired ? 'Expired' : 'Active'}
                </Badge>
                
                {isOwnedByCurrentUser && (
                  <Badge colorScheme="purple" variant="subtle" px={2} py={0.5} borderRadius="full">
                    Your Grant
                  </Badge>
                )}
                
                <Badge colorScheme="blue" variant="outline" px={2} py={0.5} borderRadius="full">
                  {formatEther(grant.amount || 0n)} ETH
                </Badge>

                {isKrnlVerified && (
                  <Badge 
                    colorScheme="blue" 
                    variant="solid" 
                    px={2} 
                    py={0.5} 
                    borderRadius="full"
                    leftIcon={<Icon as={MdSecurity} />}
                  >
                    KRNL Verified
                  </Badge>
                )}
              </Flex>
            </Box>
            
            <Badge colorScheme="gray" variant="outline" px={2} py={0.5} borderRadius="full">
              ID: {grant.id}
            </Badge>
          </Flex>
        </CardHeader>
        
        <CardBody py={2}>
          <Text fontSize="sm" color={textColor} noOfLines={3} mb={4}>
            {grant.description || 'No description available'}
          </Text>
          
          <VStack align="stretch" spacing={2}>
            <HStack>
              <Icon as={TimeIcon} color="blue.500" boxSize={4} />
              <Text fontSize="sm">
                {isExpired ? 'Expired on ' : 'Deadline: '}
                {formatDate(grant.deadline)}
              </Text>
            </HStack>
            
            {!isExpired && (
              <HStack>
                <Icon as={InfoIcon} color="blue.500" boxSize={4} />
                <Text fontSize="sm" fontWeight="medium">
                  {calculateTimeLeft(grant.deadline)}
                </Text>
              </HStack>
            )}
            
            {grant.milestones && grant.milestones.length > 0 && (
              <HStack>
                <Icon as={CheckIcon} color="blue.500" boxSize={4} />
                <Text fontSize="sm">
                  {grant.milestones.filter(m => m.completed).length} of {grant.milestones.length} milestones completed
                </Text>
              </HStack>
            )}
          </VStack>
        </CardBody>
        
        <CardFooter pt={0} borderTopWidth="1px" borderColor={borderColor}>
          <Button
            rightIcon={<ChevronRightIcon />}
            colorScheme="blue"
            variant="outline"
            size="sm"
            w="full"
            onClick={() => navigate(`/grants/${grant.id}`)}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <Container maxW="7xl" py={8}>
      <Tabs variant="enclosed" onChange={(index) => setTabIndex(index)}>
        <TabList mb={6}>
          <Tab>All Grants</Tab>
          <Tab>Open</Tab>
          <Tab>In Progress</Tab>
          <Tab>Completed</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            {filteredGrants.length === 0 ? (
              <Box textAlign="center" py={12} bg={headerBg} borderRadius="lg">
                <Text fontSize="lg" color={textColor} mb={4}>
                  No grants found in this category.
                </Text>
                {isNGO && tabIndex === 1 && (
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    onClick={() => navigate('/grants/create')}
                  >
                    Create Grant
                  </Button>
                )}
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredGrants.map((grant) => (
                  <GrantCard key={grant.id} grant={grant} />
                ))}
              </SimpleGrid>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Create Grant Button (for NGOs) */}
      {isNGO && (
        <Box position="fixed" bottom={8} right={8}>
          <Tooltip label="Create a new grant opportunity" placement="left">
            <Button
              colorScheme="blue"
              size="lg"
              borderRadius="full"
              boxShadow="lg"
              leftIcon={<AddIcon />}
              onClick={() => navigate('/grants/create')}
              isLoading={transactionStatus.isLoading}
              loadingText="Creating..."
            >
              Create Grant
            </Button>
          </Tooltip>
        </Box>
      )}
    </Container>
  );
};

export default GrantListing;
