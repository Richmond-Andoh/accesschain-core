// Mock Contracts Config
export const CONTRACT_ADDRESSES = {
    NGOAccessControl: "0x0000000000000000000000000000000000000000",
    AccessRegistry: "0x0000000000000000000000000000000000000000",
    GrantManager: "0x0000000000000000000000000000000000000000",
    AccessToken: "0x0000000000000000000000000000000000000000",
    AccessGrant: "0x0000000000000000000000000000000000000000",
    RequestRegistry: "0x0000000000000000000000000000000000000000",
};

export const AccessRegistryAddress = CONTRACT_ADDRESSES.AccessRegistry;
export const GrantManagerAddress = CONTRACT_ADDRESSES.GrantManager;
export const AccessTokenAddress = CONTRACT_ADDRESSES.AccessToken;
export const NGOAccessControlAddress = CONTRACT_ADDRESSES.NGOAccessControl;
export const AccessGrantAddress = CONTRACT_ADDRESSES.AccessGrant;
export const RequestRegistryAddress = CONTRACT_ADDRESSES.RequestRegistry;

export const AccessRegistryABI = [];
export const GrantManagerABI = [];
export const AccessTokenABI = [];
export const NGOAccessControlABI = [];
export const AccessGrantABI = [];
export const RequestRegistryABI = [];

export const CONTRACT_ABIS = {
  accessRegistry: AccessRegistryABI,
  grantManager: GrantManagerABI,
  accessToken: AccessTokenABI,
  ngoAccessControl: NGOAccessControlABI,
  accessGrant: AccessGrantABI,
  requestRegistry: RequestRegistryABI
};

export const CONTRACT_FUNCTIONS = {
    submitRequest: "submitRequest",
};
