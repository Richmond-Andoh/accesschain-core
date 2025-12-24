// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title KRNLTokenBridge
 * @dev Contract for bridging ACCESS tokens with KRNL network
 */
contract KRNLTokenBridge is ReentrancyGuard, Ownable, Pausable {
    IERC20 public accessToken;
    address public krnlBridgeEndpoint;
    
    // Mapping to track locked tokens
    mapping(address => uint256) public lockedTokens;
    
    // Events
    event TokensLocked(address indexed user, uint256 amount);
    event TokensUnlocked(address indexed user, uint256 amount);
    event BridgeEndpointUpdated(address indexed oldEndpoint, address indexed newEndpoint);

    /**
     * @dev Constructor to set the ACCESS token and KRNL bridge endpoint addresses
     * @param _accessToken Address of the ACCESS token contract
     * @param _krnlBridgeEndpoint Address of the KRNL bridge endpoint
     */
    constructor(address _accessToken, address _krnlBridgeEndpoint) {
        accessToken = IERC20(_accessToken);
        krnlBridgeEndpoint = _krnlBridgeEndpoint;
    }

    /**
     * @dev Lock ACCESS tokens to bridge to KRNL network
     * @param amount Amount of tokens to lock
     */
    function lockTokens(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(accessToken.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(accessToken.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");

        // Transfer tokens to bridge contract
        require(accessToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Update locked balance
        lockedTokens[msg.sender] += amount;
        
        emit TokensLocked(msg.sender, amount);
    }

    /**
     * @dev Unlock ACCESS tokens when bridging back from KRNL network
     * @param user Address of the user
     * @param amount Amount of tokens to unlock
     */
    function unlockTokens(address user, uint256 amount) external nonReentrant whenNotPaused {
        require(msg.sender == krnlBridgeEndpoint, "Only KRNL bridge can unlock");
        require(amount > 0, "Amount must be greater than 0");
        require(lockedTokens[user] >= amount, "Insufficient locked tokens");

        // Update locked balance
        lockedTokens[user] -= amount;
        
        // Transfer tokens back to user
        require(accessToken.transfer(user, amount), "Transfer failed");
        
        emit TokensUnlocked(user, amount);
    }

    /**
     * @dev Get locked token balance for a user
     * @param user Address of the user
     * @return uint256 Amount of locked tokens
     */
    function getLockedBalance(address user) external view returns (uint256) {
        return lockedTokens[user];
    }

    /**
     * @dev Update the KRNL bridge endpoint address
     * @param _newEndpoint New endpoint address
     */
    function updateBridgeEndpoint(address _newEndpoint) external onlyOwner {
        require(_newEndpoint != address(0), "Invalid address");
        address oldEndpoint = krnlBridgeEndpoint;
        krnlBridgeEndpoint = _newEndpoint;
        emit BridgeEndpointUpdated(oldEndpoint, _newEndpoint);
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