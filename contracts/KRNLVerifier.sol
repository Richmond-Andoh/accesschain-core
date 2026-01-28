// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title KRNLVerifier
 * @notice Verifies cryptographic proofs from KRNL workflows
 * @dev Simplified for demo - production version would verify signatures
 */
contract KRNLVerifier {
    address public krnlNode;
    address public owner;
    
    mapping(bytes32 => bool) public usedProofs;
    
    event ProofVerified(
        bytes32 indexed proofHash,
        address indexed subject,
        bool verified,
        uint256 timestamp
    );
    
    event KRNLNodeUpdated(address indexed oldNode, address indexed newNode);
    
    constructor(address _krnlNode) {
        krnlNode = _krnlNode;
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    /**
     * @notice Verify a KRNL proof
     * @param proof The cryptographic proof from KRNL workflow
     * @param subject The address being verified
     * @return bool True if proof is valid
     */
    function verifyProof(
        bytes calldata proof,
        address subject
    ) external returns (bool) {
        require(proof.length > 0, "Empty proof");
        require(subject != address(0), "Invalid subject");
        
        bytes32 proofHash = keccak256(proof);
        require(!usedProofs[proofHash], "Proof already used");
        
        // Mark proof as used (prevent replay attacks)
        usedProofs[proofHash] = true;
        
        emit ProofVerified(proofHash, subject, true, block.timestamp);
        
        return true;
    }
    
    /**
     * @notice Update KRNL node address
     * @param _krnlNode New KRNL node address
     */
    function setKRNLNode(address _krnlNode) external onlyOwner {
        require(_krnlNode != address(0), "Invalid address");
        
        address oldNode = krnlNode;
        krnlNode = _krnlNode;
        
        emit KRNLNodeUpdated(oldNode, _krnlNode);
    }
    
    /**
     * @notice Check if a proof has been used
     * @param proof The proof to check
     * @return bool True if proof has been used
     */
    function isProofUsed(bytes calldata proof) external view returns (bool) {
        bytes32 proofHash = keccak256(proof);
        return usedProofs[proofHash];
    }
}
