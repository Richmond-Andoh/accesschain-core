export const useNGOAccessControl = () => {
  return {
    isAuthorized: false,
    isAdmin: false,
    grantNGORole: async () => {},
    revokeNGORole: async () => {},
    checkAuthorization: async () => false,
    loading: false
  };
};

export const useAdminAccessControl = () => {
    return {
        isAdmin: false,
        loading: false
    };
};
