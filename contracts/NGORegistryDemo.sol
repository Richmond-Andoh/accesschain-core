// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./KRNLVerifier.sol";

/**
 * @title NGORegistryDemo
 * @notice Demo contract for NGO registration with KRNL proof verification
 * @dev This is a simplified demo version for KRNL submission
 */
contract NGORegistryDemo {
    KRNLVerifier public verifier;
    
    struct NGO {
        string name;
        bool verified;
        bytes32 proofHash;
        uint256 verifiedAt;
    }
    
    mapping(address => NGO) public ngos;
    address[] public ngoList;
    
    event NGORegistered(
        address indexed ngoAddress,
        string name,
        bytes32 proofHash,
        uint256 timestamp
    );
    
    constructor(address _verifier) {
        require(_verifier != address(0), "Invalid verifier address");
        verifier = KRNLVerifier(_verifier);
    }
    
    // KRNL AuthData structure
    struct AuthData {
        bytes proof;
        bytes extraData;
    }

    /**
     * @notice Register NGO with KRNL proof
     * @param authData KRNL authentication data containing proof and name encoded in extraData
     */
    function registerNGO(
        AuthData calldata authData
    ) external {
        // Decode name from extraData
        string memory name = abi.decode(authData.extraData, (string));
        
        require(bytes(name).length > 0, "Name required");
        require(!ngos[msg.sender].verified, "Already registered");
        
        // Verify KRNL proof
        require(
            verifier.verifyProof(authData.proof, msg.sender),
            "Invalid KRNL proof"
        );
        
        bytes32 proofHash = keccak256(authData.proof);
        
        ngos[msg.sender] = NGO({
            name: name,
            verified: true,
            proofHash: proofHash,
            verifiedAt: block.timestamp
        });
        
        ngoList.push(msg.sender);
        
        emit NGORegistered(msg.sender, name, proofHash, block.timestamp);
    }
    
    /**
     * @notice Check if address is verified NGO
     * @param ngo Address to check
     * @return bool True if verified
     */
    function isVerifiedNGO(address ngo) external view returns (bool) {
        return ngos[ngo].verified;
    }
    
    /**
     * @notice Get NGO information
     * @param ngo Address to query
     * @return NGO struct with all information
     */
    function getNGOInfo(address ngo) external view returns (NGO memory) {
        return ngos[ngo];
    }
    
    /**
     * @notice Get all verified NGOs
     * @return address[] Array of NGO addresses
     */
    function getAllNGOs() external view returns (address[] memory) {
        return ngoList;
    }
    
    /**
     * @notice Get total number of registered NGOs
     * @return uint256 Total count
     */
    function getNGOCount() external view returns (uint256) {
        return ngoList.length;
    }
}
