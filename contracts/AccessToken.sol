// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./NGOAccessControl.sol";

/// @title AccessToken
/// @notice ERC20 token for the AccessChain platform with staking capabilities
contract AccessToken is ERC20, Ownable, ReentrancyGuard, Pausable {
    NGOAccessControl public ngoAccessControl;

    // Staking structures
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 lockPeriod;
        uint256 lastRewardClaimedAt;
        uint256 totalRewardsClaimed;
    }

    // Staking parameters
    uint256 public constant MIN_STAKE_AMOUNT = 100 * 10 ** 18; // 100 tokens
    uint256 public constant MAX_STAKE_AMOUNT = 1000000 * 10 ** 18; // 1M tokens
    uint256 public constant MIN_STAKE_PERIOD = 30 days;
    uint256 public constant MAX_STAKE_PERIOD = 365 days;
    uint256 public constant REWARD_CLAIM_INTERVAL = 1 days; // Can claim rewards daily
    uint256 public constant EARLY_UNSTAKE_PENALTY = 25; // 25% penalty for early unstake

    // Staking rewards (in basis points, 10000 = 100%)
    uint256 public constant BASE_REWARD_RATE = 500; // 5% APY (500 bps)
    uint256 public constant BONUS_REWARD_RATE = 1000; // 10% APY for long-term staking (1000 bps)
    uint256 public constant REWARD_PRECISION = 1e18; // For accurate reward calculations

    // Mappings
    mapping(address => Stake) public stakes;
    mapping(address => uint256) public stakingPower;

    // Events
    event TokensStaked(
        address indexed user,
        uint256 amount,
        uint256 lockPeriod
    );
    event TokensUnstaked(address indexed user, uint256 amount, uint256 reward);
    event EarlyUnstakePenalty(address indexed user, uint256 penalty);
    event RewardsClaimed(address indexed user, uint256 amount);
    event StakingPowerUpdated(address indexed user, uint256 newPower);
    event EmergencyWithdraw(address indexed token, uint256 amount);

    constructor(
        address _ngoAccessControl
    ) ERC20("AccessChain Token", "ACC") Ownable() {
        ngoAccessControl = NGOAccessControl(_ngoAccessControl);
    }

    /// @notice Mint tokens to an address (only owner)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /// @notice Stake tokens for platform participation
    function stake(
        uint256 amount,
        uint256 lockPeriod
    ) external nonReentrant whenNotPaused {
        require(amount >= MIN_STAKE_AMOUNT, "Amount below minimum stake");
        require(amount <= MAX_STAKE_AMOUNT, "Amount above maximum stake");
        require(lockPeriod >= MIN_STAKE_PERIOD, "Lock period too short");
        require(lockPeriod <= MAX_STAKE_PERIOD, "Lock period too long");
        require(stakes[msg.sender].amount == 0, "Already staked");

        // Transfer tokens from user to contract
        _transfer(msg.sender, address(this), amount);

        // Create stake with initial values
        stakes[msg.sender] = Stake({
            amount: amount,
            timestamp: block.timestamp,
            lockPeriod: lockPeriod,
            lastRewardClaimedAt: block.timestamp,
            totalRewardsClaimed: 0
        });

        // Calculate staking power (amount * lock period multiplier)
        uint256 power = calculateStakingPower(amount, lockPeriod);
        stakingPower[msg.sender] = power;

        emit TokensStaked(msg.sender, amount, lockPeriod);
        emit StakingPowerUpdated(msg.sender, power);
    }

    /// @notice Unstake tokens after lock period
    function unstake(bool force) external nonReentrant whenNotPaused {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No stake found");

        uint256 amount = userStake.amount;
        uint256 reward = calculateReward(userStake);
        bool isEarly = block.timestamp <
            userStake.timestamp + userStake.lockPeriod;

        // Apply penalty for early unstake if force is true
        if (isEarly && !force) {
            revert("Use force=true to unstake early with penalty");
        }

        uint256 penalty = 0;
        if (isEarly && force) {
            penalty = (amount * EARLY_UNSTAKE_PENALTY) / 100;
            amount -= penalty;
            // Burn penalty or send to treasury
            _burn(address(this), penalty);
        }

        // Clear stake
        delete stakes[msg.sender];
        stakingPower[msg.sender] = 0;

        // Transfer staked tokens and rewards
        _transfer(address(this), msg.sender, amount + reward);

        emit TokensUnstaked(msg.sender, amount, reward);
        if (penalty > 0) {
            emit EarlyUnstakePenalty(msg.sender, penalty);
        }
        emit StakingPowerUpdated(msg.sender, 0);
    }

    /// @notice Calculate staking power based on amount and lock period
    /// @notice Claim staking rewards without unstaking
    function claimRewards() external nonReentrant whenNotPaused {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "No stake found");

        uint256 reward = calculateReward(userStake);
        require(reward > 0, "No rewards to claim");

        // Update last reward claim time
        userStake.lastRewardClaimedAt = block.timestamp;
        userStake.totalRewardsClaimed += reward;

        // Transfer rewards
        _mint(msg.sender, reward);

        emit RewardsClaimed(msg.sender, reward);
    }

    function calculateStakingPower(
        uint256 amount,
        uint256 lockPeriod
    ) public pure returns (uint256) {
        // Base power is the amount
        // Lock period multiplier: 1x for minimum period, up to 2x for maximum period
        uint256 lockMultiplier = 1e18 +
            ((lockPeriod - MIN_STAKE_PERIOD) * 1e18) /
            (MAX_STAKE_PERIOD - MIN_STAKE_PERIOD);
        return (amount * lockMultiplier) / 1e18;
    }

    /// @notice Calculate reward for a stake
    function calculateReward(Stake memory userStake) public view returns (uint256) {
        uint256 endTime = block.timestamp;
        if (endTime <= userStake.lastRewardClaimedAt) {
            return 0;
        }
        
        // Calculate time since last claim or stake start
        uint256 timeElapsed = endTime - userStake.lastRewardClaimedAt;

        // Cap at lock period end if unstaking early
        uint256 lockEndTime = userStake.timestamp + userStake.lockPeriod;
        if (endTime > lockEndTime) {
            timeElapsed = lockEndTime > userStake.lastRewardClaimedAt 
                ? lockEndTime - userStake.lastRewardClaimedAt 
                : 0;
        }

        if (timeElapsed == 0) {
            return 0;
        }

        // Use bonus rate if staked for more than 180 days
        bool useBonusRate = (block.timestamp - userStake.timestamp) >= 180 days;
        uint256 apy = useBonusRate ? BONUS_REWARD_RATE : BASE_REWARD_RATE;

        // Calculate reward: (amount * APY * timeElapsed) / (365 days * 10000)
        // Using 10000 as denominator because rates are in basis points
        return (userStake.amount * apy * timeElapsed) / (365 days * 10000);
    }

    /// @notice Get staking power for an address
    function getStakingPower(address user) external view returns (uint256) {
        return stakingPower[user];
    }

    /// @notice Check if an address has sufficient staking power for grant creation
    function hasGrantCreationPower(address user) external view returns (bool) {
        return stakingPower[user] >= MIN_STAKE_AMOUNT;
    }

    // Emergency functions
    function emergencyPause() external onlyOwner {
        _pause();
    }

    function emergencyUnpause() external onlyOwner {
        _unpause();
    }

    // Emergency withdraw any ERC20 tokens sent to the contract by mistake
    function emergencyWithdrawToken(
        address tokenAddress,
        uint256 amount
    ) external onlyOwner {
        require(tokenAddress != address(this), "Cannot withdraw staking token");
        IERC20 token = IERC20(tokenAddress);
        token.transfer(owner(), amount);
        emit EmergencyWithdraw(tokenAddress, amount);
    }

    // Override transfer functions to respect pausable
    function transfer(
        address to,
        uint256 amount
    ) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }

    /// @notice Check if an address has sufficient staking power for grant application
    function hasGrantApplicationPower(
        address user
    ) external view returns (bool) {
        return stakingPower[user] >= (MIN_STAKE_AMOUNT / 2);
    }
}
