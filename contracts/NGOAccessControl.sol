// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

/// @title NGOAccessControl
/// @notice Manages NGO roles and permissions with enhanced security
contract NGOAccessControl is Ownable, Pausable {
    using EnumerableSet for EnumerableSet.AddressSet;

    // Role management
    using EnumerableSet for EnumerableSet.AddressSet;
    
    struct RoleData {
        bool isActive;
        uint256 addedAt;
    }
    
    EnumerableSet.AddressSet private _ngos;
    EnumerableSet.AddressSet private _admins;
    
    mapping(address => RoleData) public ngoData;
    mapping(address => RoleData) public adminData;
    
    // Time lock for critical operations
    uint256 public constant ADMIN_ADD_DELAY = 1 days;
    mapping(address => uint256) public pendingAdminAdds;
    mapping(address => uint256) public pendingAdminRemovals;

    event NGOAdded(address indexed ngo, address indexed addedBy);
    event NGORemoved(address indexed ngo, address indexed removedBy);
    event AdminAdded(address indexed admin, address indexed addedBy);
    event AdminRemoved(address indexed admin, address indexed removedBy);
    event AdminAddRequested(address indexed admin, uint256 executeAfter);
    event AdminRemoveRequested(address indexed admin, uint256 executeAfter);

    constructor() {
        // Owner is automatically an NGO and admin
        _addNGO(msg.sender);
        _addAdmin(msg.sender);
    }

    modifier onlyNGO() {
        require(ngoData[msg.sender].isActive, "Caller is not an active NGO");
        _;
    }

    modifier onlyAdmin() {
        require(
            (adminData[msg.sender].isActive || owner() == msg.sender), 
            "Caller is not an admin"
        );
        _;
    }

    /// @notice Add an address as an NGO
    /// @param ngo Address to add as NGO
    function addNGO(address ngo) external onlyAdmin whenNotPaused {
        require(ngo != address(0), "Invalid address");
        require(!ngoData[ngo].isActive, "Already an active NGO");
        _addNGO(ngo);
    }

    /// @notice Remove an address from NGO status
    /// @param ngo Address to remove from NGO status
    function removeNGO(address ngo) external onlyAdmin whenNotPaused {
        require(ngoData[ngo].isActive, "Not an active NGO");
        _removeNGO(ngo);
    }

    /// @notice Request to add an address as an admin (requires timelock)
    /// @param admin Address to add as admin
    function requestAddAdmin(address admin) external onlyOwner {
        require(admin != address(0), "Invalid address");
        require(!adminData[admin].isActive, "Already an admin");
        uint256 executeAfter = block.timestamp + ADMIN_ADD_DELAY;
        pendingAdminAdds[admin] = executeAfter;
        emit AdminAddRequested(admin, executeAfter);
    }
    
    /// @notice Execute admin addition after timelock
    function executeAddAdmin(address admin) external onlyOwner {
        require(pendingAdminAdds[admin] > 0, "No pending add request");
        require(block.timestamp >= pendingAdminAdds[admin], "Timelock not expired");
        _addAdmin(admin);
        delete pendingAdminAdds[admin];
    }

    /// @notice Request to remove an admin (requires timelock)
    /// @param admin Address to remove from admin status
    function requestRemoveAdmin(address admin) external onlyOwner {
        require(adminData[admin].isActive, "Not an admin");
        require(admin != owner(), "Cannot remove owner as admin");
        uint256 executeAfter = block.timestamp + ADMIN_ADD_DELAY;
        pendingAdminRemovals[admin] = executeAfter;
        emit AdminRemoveRequested(admin, executeAfter);
    }
    
    /// @notice Execute admin removal after timelock
    function executeRemoveAdmin(address admin) external onlyOwner {
        require(pendingAdminRemovals[admin] > 0, "No pending remove request");
        require(block.timestamp >= pendingAdminRemovals[admin], "Timelock not expired");
        _removeAdmin(admin);
        delete pendingAdminRemovals[admin];
    }

    /// @notice Check if an address is an active NGO
    /// @param account Address to check
    /// @return True if account is an active NGO
    function isAuthorizedNGO(address account) external view returns (bool) {
        return ngoData[account].isActive;
    }

    /// @notice Check if an address is an admin
    /// @param account Address to check
    /// @return True if account is an admin or the owner
    function isAuthorizedAdmin(address account) external view returns (bool) {
        return adminData[account].isActive || owner() == account;
    }

    /// @notice Get all NGOs
    /// @return Array of NGO addresses
    function getNGOs() external view returns (address[] memory) {
        return _ngos.values();
    }

    /// @notice Get all admins
    /// @return Array of admin addresses
    function getAdmins() external view returns (address[] memory) {
        return _admins.values();
    }

    function _addNGO(address ngo) internal {
        _ngos.add(ngo);
        ngoData[ngo] = RoleData({
            isActive: true,
            addedAt: block.timestamp
        });
        emit NGOAdded(ngo, msg.sender);
    }

    function _removeNGO(address ngo) internal {
        _ngos.remove(ngo);
        delete ngoData[ngo];
        emit NGORemoved(ngo, msg.sender);
    }

    function _addAdmin(address admin) internal {
        _admins.add(admin);
        adminData[admin] = RoleData({
            isActive: true,
            addedAt: block.timestamp
        });
        emit AdminAdded(admin, msg.sender);
    }

    function _removeAdmin(address admin) internal {
        _admins.remove(admin);
        delete adminData[admin];
        emit AdminRemoved(admin, msg.sender);
    }
    
    // Emergency pause functionality
    function emergencyPause() external onlyOwner {
        _pause();
    }

    function emergencyUnpause() external onlyOwner {
        _unpause();
    }
    
    // Batch operations for efficiency
    function batchAddNGOs(address[] calldata ngos) external onlyAdmin whenNotPaused {
        require(ngos.length <= 50, "Too many NGOs in one batch");
        for (uint i = 0; i < ngos.length; i++) {
            if (ngos[i] != address(0) && !ngoData[ngos[i]].isActive) {
                _addNGO(ngos[i]);
            }
        }
    }
    
    // View function to check if an admin add/remove is pending
    function isAdminActionPending(address admin) external view returns (bool addPending, bool removePending) {
        return (
            pendingAdminAdds[admin] > 0,
            pendingAdminRemovals[admin] > 0
        );
    }
}
