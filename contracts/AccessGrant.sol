// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NGOAccessControl.sol";

/// @title AccessGrant
/// @notice Manages grant programs for NGOs in AccessChain
contract AccessGrant is Ownable, ReentrancyGuard, Pausable {
    // Constants
    uint256 public constant MAX_MILESTONES = 20; // Prevent unbounded loops
    enum GrantStatus { Active, Closed }
    enum ApplicationStatus { Pending, Approved, Rejected, Completed }
    enum MilestoneStatus { NotStarted, InProgress, Completed, Failed }

    struct Milestone {
        string description;
        uint256 amount;
        uint256 deadline;
        MilestoneStatus status;
        bool fundsReleased;
    }

    struct Grant {
        uint256 id;
        string title;
        string description;
        uint256 totalAmount;
        uint256 remainingAmount;
        uint256 deadline;
        address ngo;
        bool isActive;
        Milestone[] milestones;
        uint256 applicantCount;
        uint256 approvedCount;
    }

    struct GrantRequest {
        address applicant;
        string proposal;
        ApplicationStatus status;
        uint256 currentMilestone;
        uint256 fundsReceived;
    }

    uint256 private grantCounter;
    NGOAccessControl public ngoAccessControl;

    mapping(uint256 => Grant) public grants;
    mapping(uint256 => mapping(address => GrantRequest)) public grantRequests;
    mapping(address => uint256[]) public userApplications;
    mapping(address => uint256[]) public ngoGrants;

    event GrantCreated(uint256 indexed grantId, address indexed ngo);
    event ApplicationSubmitted(uint256 indexed grantId, address indexed applicant);
    event ApplicationStatusUpdated(uint256 indexed grantId, address indexed applicant, ApplicationStatus status);
    event MilestoneCompleted(uint256 indexed grantId, address indexed applicant, uint256 milestoneIndex);
    event FundsReleased(uint256 indexed grantId, address indexed applicant, uint256 amount);

    constructor(address ngoAccessControlAddress) {
        require(ngoAccessControlAddress != address(0), "Invalid NGO Access Control address");
        ngoAccessControl = NGOAccessControl(ngoAccessControlAddress);
    }

    /// @notice Create a new grant program with milestones (NGOs only)
    function createGrant(
        string calldata title,
        string calldata description,
        uint256 totalAmount,
        uint256 deadline,
        Milestone[] calldata milestones
    ) external whenNotPaused {
        require(
            ngoAccessControl.isAuthorizedNGO(msg.sender),
            "Only authorized NGOs can create grants"
        );
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(totalAmount > 0, "Amount must be greater than 0");
        require(milestones.length > 0 && milestones.length <= MAX_MILESTONES, "Invalid number of milestones");

        uint256 totalMilestoneAmount = 0;
        for (uint256 i = 0; i < milestones.length; i++) {
            totalMilestoneAmount += milestones[i].amount;
        }
        require(totalMilestoneAmount == totalAmount, "Milestone amounts must sum to total");

        grantCounter++;
        uint256 grantId = grantCounter;

        grants[grantId].id = grantId;
        grants[grantId].title = title;
        grants[grantId].description = description;
        grants[grantId].totalAmount = totalAmount;
        grants[grantId].remainingAmount = totalAmount;
        grants[grantId].deadline = deadline;
        grants[grantId].ngo = msg.sender;
        grants[grantId].isActive = true;

        for (uint256 i = 0; i < milestones.length; i++) {
            grants[grantId].milestones.push(milestones[i]);
        }

        ngoGrants[msg.sender].push(grantId);
        emit GrantCreated(grantId, msg.sender);
    }

    /// @notice Apply for a grant
    function applyForGrant(
        uint256 grantId,
        string calldata proposal
    ) external nonReentrant whenNotPaused {
        require(grantId > 0 && grantId <= grantCounter, "Invalid grant ID");
        require(grants[grantId].isActive, "Grant is not active");
        require(grants[grantId].deadline > block.timestamp, "Grant deadline has passed");
        require(grantRequests[grantId][msg.sender].applicant == address(0), "Already applied");

        // Initialize application
        grantRequests[grantId][msg.sender] = GrantRequest({
            applicant: msg.sender,
            proposal: proposal,
            status: ApplicationStatus.Pending,
            currentMilestone: 0,
            fundsReceived: 0
        });

        userApplications[msg.sender].push(grantId);
        grants[grantId].applicantCount++;
        
        emit ApplicationSubmitted(grantId, msg.sender);
    }


    /// @notice Approve a grant application (NGO only)
    function approveApplication(uint256 grantId, address applicant) external whenNotPaused {
        require(grants[grantId].ngo == msg.sender, "Only grant creator can approve");
        require(grantRequests[grantId][applicant].status == ApplicationStatus.Pending, "Invalid status");

        grantRequests[grantId][applicant].status = ApplicationStatus.Approved;
        grants[grantId].approvedCount++;

        emit ApplicationStatusUpdated(grantId, applicant, ApplicationStatus.Approved);
    }

    /// @notice Complete a milestone and release funds
    function completeMilestone(
        uint256 grantId, 
        address applicant, 
        uint256 milestoneIndex
    ) external nonReentrant whenNotPaused {
        require(grants[grantId].ngo == msg.sender, "Only grant creator can complete milestone");
        require(grantRequests[grantId][applicant].status == ApplicationStatus.Approved, "Not approved");
        require(milestoneIndex < grants[grantId].milestones.length, "Invalid milestone");
        require(grants[grantId].milestones[milestoneIndex].status == MilestoneStatus.InProgress, "Invalid status");

        Milestone storage milestone = grants[grantId].milestones[milestoneIndex];
        milestone.status = MilestoneStatus.Completed;
        
        if (!milestone.fundsReleased) {
            milestone.fundsReleased = true;
            grants[grantId].remainingAmount -= milestone.amount;
            grantRequests[grantId][applicant].fundsReceived += milestone.amount;
            
            // Here you would typically transfer funds
            // For now, we'll just emit an event
            emit FundsReleased(grantId, applicant, milestone.amount);
        }

        emit MilestoneCompleted(grantId, applicant, milestoneIndex);
    }

    /// @notice Get all grants for an NGO
    function getNGOGrants(address ngo) external view returns (uint256[] memory) {
        return ngoGrants[ngo];
    }

    /// @notice Get all applications for a user
    function getUserApplications(address user) external view returns (uint256[] memory) {
        return userApplications[user];
    }

    /// @notice Helper function to convert address to string
    // Emergency pause functionality
    function emergencyPause() external onlyOwner {
        _pause();
    }

    function emergencyUnpause() external onlyOwner {
        _unpause();
    }
    
    // Emergency withdraw function for stuck funds (only owner)
    function emergencyWithdraw(address tokenAddress, uint256 amount) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        token.transfer(owner(), amount);
    }
    
    // Using IERC20 from OpenZeppelin
} 