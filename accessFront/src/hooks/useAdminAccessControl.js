export const useAdminAccessControl = () => {
    return {
        isAdmin: false,
        loading: false,
        checkAdminStatus: async () => false
    };
};

export default useAdminAccessControl;
