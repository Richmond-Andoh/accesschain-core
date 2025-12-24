import { Kernel } from "@krnl-dev/sdk-react-7702";

// Initialize KRNL with your app credentials
export const krnl = new Kernel({
  appId: 'cmhr3ycpl00iljj0cy83eszxb',
  network: 'sonic-blaze',
  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',
});

// Common queries
export const GRANTS_QUERY = `
  query GetGrants($filters: GrantFilters) {
    grants(filters: $filters) {
      id
      title
      description
      category
      status
      amountRaised
      fundingGoal
      deadline
      creator
      createdAt
      updatedAt
    }
  }
`;

// Export common functions
export const fetchGrants = async (filters = {}) => {
  try {
    const { data } = await krnl.query(GRANTS_QUERY, { filters });
    return data.grants;
  } catch (error) {
    console.error('Error fetching grants:', error);
    throw error;
  }
};

export default krnl;
