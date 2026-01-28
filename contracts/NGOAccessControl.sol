// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NGORegistryDemo.sol";

/**
 * @title NGOAccessControl
 * @notice Manages authorization for AccessChain platform actors
 * @dev Integrates with NGORegistryDemo (KRNL verified) for NGO status
 */
contract NGOAccessControl {
    NGORegistryDemo public immutable ngoRegistry;
    address public owner;

    enum Role { NONE, NGO, DONOR, ADMIN }
    
    mapping(address => Role) public userRoles;
    
    event RoleGranted(address indexed user, Role role);
    event RoleRevoked(address indexed user);

    constructor(address _ngoRegistry) {
        require(_ngoRegistry != address(0), "Invalid registry");
        ngoRegistry = NGORegistryDemo(_ngoRegistry);
        owner = msg.sender;
        userRoles[msg.sender] = Role.ADMIN;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    /**
     * @notice Check if an address is an authorized NGO
     * @param account The address to check
     * @return bool True if authorized
     */
    function isAuthorizedNGO(address account) public view returns (bool) {
        // Must be verified in the KRNL registry AND have the NGO role locally
        return ngoRegistry.isVerifiedNGO(account) && userRoles[account] == Role.NGO;
    }

    /**
     * @notice Assign a role to a user
     * @param account User address
     * @param role Role to assign
     */
    function grantRole(address account, Role role) external onlyOwner {
        userRoles[account] = role;
        emit RoleGranted(account, role);
    }

    /**
     * @notice Revoke a role from a user
     * @param account User address
     */
    function revokeRole(address account) external onlyOwner {
        userRoles[account] = Role.NONE;
        emit RoleRevoked(account);
    }

    /**
     * @notice Self-register as an NGO if KRNL verified
     */
    function registerAsNGO() external {
        require(ngoRegistry.isVerifiedNGO(msg.sender), "Not verified by KRNL");
        userRoles[msg.sender] = Role.NGO;
        emit RoleGranted(msg.sender, Role.NGO);
    }

    /**
     * @notice Transfer ownership of the access control
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        owner = newOwner;
    }
}
