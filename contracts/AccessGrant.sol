// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NGOAccessControl.sol";

/**
 * @title AccessGrant
 * @notice Manages grant lifecycles on the AccessChain platform
 */
contract AccessGrant {
    NGOAccessControl public immutable accessControl;
    
    struct Grant {
        uint256 id;
        address ngo;
        string title;
        string description;
        uint256 amount;
        uint256 deadline;
        bool isActive;
        uint256 totalApplications;
    }
    
    struct Application {
        address applicant;
        string proposal;
        uint256 requestedAmount;
        bool approved;
        bool rejected;
    }
    
    uint256 public nextGrantId;
    mapping(uint256 => Grant) public grants;
    mapping(uint256 => Application[]) public grantApplications;
    mapping(uint256 => mapping(address => bool)) public hasApplied;
    
    event GrantCreated(uint256 indexed grantId, address indexed ngo, string title, uint256 amount);
    event ApplicationSubmitted(uint256 indexed grantId, address indexed applicant);
    event ApplicationApproved(uint256 indexed grantId, address indexed applicant);
    event ApplicationRejected(uint256 indexed grantId, address indexed applicant);

    constructor(address _accessControl) {
        require(_accessControl != address(0), "Invalid access control");
        accessControl = NGOAccessControl(_accessControl);
    }

    modifier onlyAuthorizedNGO() {
        require(accessControl.isAuthorizedNGO(msg.sender), "Not authorized NGO");
        _;
    }

    /**
     * @notice Create a new grant opportunity
     */
    function createGrant(
        string calldata title,
        string calldata description,
        uint256 amount,
        uint256 duration
    ) external onlyAuthorizedNGO {
        uint256 grantId = nextGrantId++;
        
        grants[grantId] = Grant({
            id: grantId,
            ngo: msg.sender,
            title: title,
            description: description,
            amount: amount,
            deadline: block.timestamp + duration,
            isActive: true,
            totalApplications: 0
        });
        
        emit GrantCreated(grantId, msg.sender, title, amount);
    }

    /**
     * @notice Submit an application for a grant
     */
    function applyForGrant(
        uint256 grantId,
        string calldata proposal,
        uint256 requestedAmount
    ) external {
        require(grantId < nextGrantId, "Grant does not exist");
        require(grants[grantId].isActive, "Grant is not active");
        require(block.timestamp < grants[grantId].deadline, "Grant deadline passed");
        require(!hasApplied[grantId][msg.sender], "Already applied");
        
        grantApplications[grantId].push(Application({
            applicant: msg.sender,
            proposal: proposal,
            requestedAmount: requestedAmount,
            approved: false,
            rejected: false
        }));
        
        hasApplied[grantId][msg.sender] = true;
        grants[grantId].totalApplications++;
        
        emit ApplicationSubmitted(grantId, msg.sender);
    }

    /**
     * @notice Approve an application (NGO only)
     */
    function approveApplication(uint256 grantId, uint256 applicationIndex) external {
        require(grantId < nextGrantId, "Grant does not exist");
        Grant storage grant = grants[grantId];
        require(msg.sender == grant.ngo, "Not grant owner");
        
        Application storage app = grantApplications[grantId][applicationIndex];
        require(!app.approved && !app.rejected, "Decision already made");
        
        app.approved = true;
        emit ApplicationApproved(grantId, app.applicant);
    }
    
    /**
     * @notice Reject an application (NGO only)
     */
    function rejectApplication(uint256 grantId, uint256 applicationIndex) external {
        require(grantId < nextGrantId, "Grant does not exist");
        Grant storage grant = grants[grantId];
        require(msg.sender == grant.ngo, "Not grant owner");
        
        Application storage app = grantApplications[grantId][applicationIndex];
        require(!app.approved && !app.rejected, "Decision already made");
        
        app.rejected = true;
        emit ApplicationRejected(grantId, app.applicant);
    }

    /**
     * @notice Get all grants
     */
    function getGrants() external view returns (Grant[] memory) {
        Grant[] memory allGrants = new Grant[](nextGrantId);
        for (uint256 i = 0; i < nextGrantId; i++) {
            allGrants[i] = grants[i];
        }
        return allGrants;
    }

    /**
     * @notice Get applications for a grant
     */
    function getApplications(uint256 grantId) external view returns (Application[] memory) {
        return grantApplications[grantId];
    }
}
