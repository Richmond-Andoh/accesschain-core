import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAccount, usePublicClient } from 'wagmi';
import { NGOAccessControlABI, NGOAccessControlAddress } from '../../config/contracts';
import { DEMO_CONTRACTS, NGO_REGISTRY_ABI } from '../../config/demo-contracts';
import { useGrantManagement } from '../../hooks/useGrantManagement';

const NGODashboardOverview = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const toast = useToast();
  const [ngos, setNGOs] = useState([]);
  const [verifiedStatuses, setVerifiedStatuses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { grants, isLoadingGrants } = useGrantManagement();

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headerBg = useColorModeValue('blue.50', 'blue.900');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.300');

  useEffect(() => {
    const fetchNGOData = async () => {
      if (!publicClient) return;
      try {
        setIsLoading(true);
        // Get all RoleGranted events to find NGOs
        const logs = await publicClient.getLogs({
          address: NGOAccessControlAddress,
          event: {
            type: 'event',
            name: 'RoleGranted',
            inputs: [
              { type: 'address', name: 'user', indexed: true },
              { type: 'uint8', name: 'role' }
            ]
          },
          fromBlock: 0n,
          toBlock: 'latest'
        });
        
        // Filter unique addresses that were granted role 1 (NGO)
        const ngoAddresses = [...new Set(logs
          .filter(log => log.args.role === 1)
          .map(log => log.args.user.toLowerCase()))];
        
        setNGOs(ngoAddresses);

        // Fetch KRNL verification status for each NGO
        const statusMap = {};
        await Promise.all(ngoAddresses.map(async (ngo) => {
          try {
            const isVerified = await publicClient.readContract({
              address: DEMO_CONTRACTS.NGORegistryDemo,
              abi: NGO_REGISTRY_ABI,
              functionName: 'isVerifiedNGO',
              args: [ngo],
            });
            statusMap[ngo] = isVerified;
          } catch (err) {
            console.warn(`Could not fetch status for ${ngo}:`, err);
            statusMap[ngo] = false;
          }
        }));
        setVerifiedStatuses(statusMap);
      } catch (error) {
        console.error('Error fetching NGO data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNGOData();
  }, [publicClient]);

  // Calculate grants and total funds for each NGO
  const ngoStats = ngos.map(ngo => {
    const ngoGrants = grants.filter(grant => 
      grant.ngo.toLowerCase() === ngo.toLowerCase()
    );
    const totalFunds = ngoGrants.reduce((total, grant) => {
      if (!grant || !grant.amount) return total;
      try {
        return total + parseFloat(grant.amount);
      } catch (error) {
        console.error('Error calculating funds:', error);
        return total;
      }
    }, 0);

    return {
      address: ngo,
      grantCount: ngoGrants.length,
      totalFunds,
      activeGrants: ngoGrants.filter(grant => grant.isActive).length,
      isKrnlVerified: verifiedStatuses[ngo.toLowerCase()] || false
    };
  });

  if (isLoading || isLoadingGrants) {
    return (
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="center" justify="center" minH="50vh">
          <Spinner size="xl" />
          <Text>Loading NGO data...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg">NGO Dashboard Overview</Heading>
          <Text mt={2} color={secondaryTextColor}>
            View and manage all verified NGOs
          </Text>
        </Box>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          <Card bg={cardBg} boxShadow="md" borderRadius="lg">
            <CardBody>
              <Stat>
                <StatLabel>Total NGOs</StatLabel>
                <StatNumber>{ngos.length}</StatNumber>
                <StatHelpText>Verified organizations</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg} boxShadow="md" borderRadius="lg">
            <CardBody>
              <Stat>
                <StatLabel>Total Grants</StatLabel>
                <StatNumber>{grants.length}</StatNumber>
                <StatHelpText>Across all NGOs</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg} boxShadow="md" borderRadius="lg">
            <CardBody>
              <Stat>
                <StatLabel>Active Grants</StatLabel>
                <StatNumber>
                  {grants.filter(grant => grant.isActive).length}
                </StatNumber>
                <StatHelpText>Currently active</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* NGO List */}
        <Card bg={cardBg} boxShadow="md" borderRadius="lg" overflow="hidden">
          <CardBody>
            <Heading size="md" mb={4}>Verified NGOs</Heading>
            {ngos.length === 0 ? (
              <Alert status="info">
                <AlertIcon />
                No NGOs have been registered yet.
              </Alert>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>NGO Address</Th>
                      <Th>Status</Th>
                      <Th isNumeric>Total Grants</Th>
                      <Th isNumeric>Active Grants</Th>
                      <Th isNumeric>Total Funds</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {ngoStats.map((ngo) => (
                      <Tr key={ngo.address}>
                        <Td fontFamily="mono" fontSize="sm">
                          {`${ngo.address.slice(0, 6)}...${ngo.address.slice(-4)}`}
                        </Td>
                        <Td>
                          <Badge colorScheme={ngo.isKrnlVerified ? "green" : "gray"} variant="solid">
                            {ngo.isKrnlVerified ? "KRNL Verified" : "Unverified"}
                          </Badge>
                        </Td>
                        <Td isNumeric>{ngo.grantCount}</Td>
                        <Td isNumeric>{ngo.activeGrants}</Td>
                        <Td isNumeric>{ngo.totalFunds.toFixed(2)} ETH</Td>
                        <Td>
                          <Button
                            as={RouterLink}
                            to={`/ngo/${ngo.address}`}
                            size="sm"
                            colorScheme="blue"
                          >
                            View Dashboard
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default NGODashboardOverview; 