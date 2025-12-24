// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title KRNLIdentityVerifier
 * @dev Contract for managing disability verification using KRNL's identity service
 */
contract KRNLIdentityVerifier is Ownable, Pausable {
    // KRNL Identity Service interface address
    address public krnlIdentityService;
    
    // Mapping from address to DID (Decentralized Identity)
    mapping(address => bytes32) private userDIDs;
    
    // Mapping from DID to verification status
    mapping(bytes32 => bool) private verifiedDIDs;

    // Events
    event IdentityVerificationRequested(address indexed user, bytes32 documentHash);
    event IdentityVerified(address indexed user, bytes32 did);
    event KRNLServiceUpdated(address indexed oldService, address indexed newService);

    /**
     * @dev Constructor to set the initial KRNL identity service address
     * @param _krnlIdentityService Address of the KRNL identity service
     */
    constructor(address _krnlIdentityService) {
        krnlIdentityService = _krnlIdentityService;
    }

    /**
     * @dev Request verification of disability documentation
     * @param documentHash Hash of the disability documentation
     */
    function requestVerification(bytes32 documentHash) external whenNotPaused {
        require(userDIDs[msg.sender] == bytes32(0), "Verification already requested");
        
        emit IdentityVerificationRequested(msg.sender, documentHash);
    }

    /**
     * @dev Callback function for KRNL identity service to verify a user
     * @param user Address of the user
     * @param did Decentralized Identity issued by KRNL
     */
    function verifyIdentity(address user, bytes32 did) external {
        require(msg.sender == krnlIdentityService, "Only KRNL service can verify");
        require(userDIDs[user] == bytes32(0), "User already verified");

        userDIDs[user] = did;
        verifiedDIDs[did] = true;

        emit IdentityVerified(user, did);
    }

    /**
     * @dev Check if a user is verified
     * @param user Address to check
     * @return bool True if the user is verified
     */
    function isVerified(address user) external view returns (bool) {
        bytes32 did = userDIDs[user];
        return did != bytes32(0) && verifiedDIDs[did];
    }

    /**
     * @dev Update the KRNL identity service address
     * @param _newService New service address
     */
    function updateKRNLService(address _newService) external onlyOwner {
        require(_newService != address(0), "Invalid address");
        address oldService = krnlIdentityService;
        krnlIdentityService = _newService;
        emit KRNLServiceUpdated(oldService, _newService);
    }

    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}