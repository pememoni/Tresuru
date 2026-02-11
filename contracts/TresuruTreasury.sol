// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TresuruTreasury
 * @notice Production-ready multi-sig corporate treasury for Tempo Network.
 *         Features: tiered approval thresholds, timelock, daily spending limits,
 *         emergency pause, approval revocation, and transaction expiration.
 */
contract TresuruTreasury is Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ─── Events ──────────────────────────────────────────────────────────────

    event SignerAdded(address indexed signer);
    event SignerRemoved(address indexed signer);

    event TransactionProposed(
        uint256 indexed txId,
        address indexed proposer,
        address to,
        uint256 amount,
        address token,
        string memo
    );
    event TransactionApproved(uint256 indexed txId, address indexed approver);
    event TransactionRejected(uint256 indexed txId, address indexed rejector, string reason);
    event TransactionExecuted(uint256 indexed txId, address indexed executor);
    event TransactionCancelled(uint256 indexed txId, address indexed canceller);
    event ApprovalRevoked(uint256 indexed txId, address indexed signer);
    event TimelockStarted(uint256 indexed txId, uint256 executeAfter);
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);
    event UnpauseVoteCast(address indexed signer, uint256 voteCount, uint256 required);
    event ThresholdsUpdated(uint256 low, uint256 medium, uint256 high);
    event DailyLimitUpdated(uint256 oldLimit, uint256 newLimit);
    event TimelockDurationUpdated(uint256 oldDuration, uint256 newDuration);

    // ─── Types ───────────────────────────────────────────────────────────────

    struct TxData {
        address to;
        uint256 amount;
        address token;
        string memo;
        string description;
        address proposer;
        uint256 timestamp;
        bool executed;
        bool cancelled;
        uint256 approvalCount;
        uint256 rejectionCount;
        uint256 executeAfter;   // Timelock: 0 = not yet ready
        uint256 expiresAt;      // Transaction expiration timestamp
    }

    // ─── State ───────────────────────────────────────────────────────────────

    address[] public signers;
    mapping(address => bool) public isSigner;

    TxData[] public transactions;
    mapping(uint256 => mapping(address => bool)) public hasApproved;
    mapping(uint256 => mapping(address => bool)) public hasRejected;

    // Tiered approval thresholds
    uint256 public lowThreshold;
    uint256 public mediumThreshold;
    uint256 public highThreshold;

    // Timelock
    uint256 public timelockDuration;

    // Daily spending limit
    uint256 public dailyLimit;
    uint256 public spentToday;
    uint256 public lastSpendDate;

    // Transaction expiration
    uint256 public txExpirationPeriod;

    // Unpause voting
    mapping(address => bool) public hasVotedUnpause;
    uint256 public unpauseVoteCount;

    // ─── Modifiers ───────────────────────────────────────────────────────────

    modifier onlySigner() {
        require(isSigner[msg.sender], "Not a signer");
        _;
    }

    modifier txExists(uint256 _txId) {
        require(_txId < transactions.length, "Tx does not exist");
        _;
    }

    modifier notExecuted(uint256 _txId) {
        require(!transactions[_txId].executed, "Already executed");
        require(!transactions[_txId].cancelled, "Already cancelled");
        _;
    }

    modifier notExpired(uint256 _txId) {
        require(block.timestamp <= transactions[_txId].expiresAt, "Transaction expired");
        _;
    }

    // ─── Constructor ─────────────────────────────────────────────────────────

    constructor(
        address[] memory _signers,
        uint256 _lowThreshold,
        uint256 _mediumThreshold,
        uint256 _highThreshold,
        uint256 _timelockDuration,
        uint256 _dailyLimit,
        uint256 _txExpirationPeriod
    ) {
        require(_signers.length > 0, "Need at least one signer");
        require(_lowThreshold < _mediumThreshold, "Low must be < medium");
        require(_mediumThreshold < _highThreshold, "Medium must be < high");

        for (uint256 i = 0; i < _signers.length; i++) {
            address s = _signers[i];
            require(s != address(0), "Zero address");
            require(!isSigner[s], "Duplicate signer");
            isSigner[s] = true;
            signers.push(s);
            emit SignerAdded(s);
        }

        lowThreshold = _lowThreshold;
        mediumThreshold = _mediumThreshold;
        highThreshold = _highThreshold;
        timelockDuration = _timelockDuration;
        dailyLimit = _dailyLimit;
        txExpirationPeriod = _txExpirationPeriod;
        lastSpendDate = block.timestamp / 1 days;
    }

    // ─── Tiered Threshold Logic ──────────────────────────────────────────────

    function getRequiredApprovals(uint256 _amount) public view returns (uint256) {
        if (_amount <= lowThreshold) {
            return 1;
        } else if (_amount <= mediumThreshold) {
            return 2;
        } else if (_amount <= highThreshold) {
            return 3;
        } else {
            uint256 count = signers.length;
            return count < 4 ? count : 4;
        }
    }

    // ─── Core Actions ────────────────────────────────────────────────────────

    function propose(
        address _to,
        uint256 _amount,
        address _token,
        string calldata _memo,
        string calldata _description
    ) external onlySigner whenNotPaused returns (uint256) {
        require(_to != address(0), "Zero recipient");
        require(_amount > 0, "Zero amount");

        uint256 txId = transactions.length;

        transactions.push(
            TxData({
                to: _to,
                amount: _amount,
                token: _token,
                memo: _memo,
                description: _description,
                proposer: msg.sender,
                timestamp: block.timestamp,
                executed: false,
                cancelled: false,
                approvalCount: 0,
                rejectionCount: 0,
                executeAfter: 0,
                expiresAt: block.timestamp + txExpirationPeriod
            })
        );

        emit TransactionProposed(txId, msg.sender, _to, _amount, _token, _memo);
        return txId;
    }

    function approve(uint256 _txId)
        external
        onlySigner
        txExists(_txId)
        notExecuted(_txId)
        notExpired(_txId)
    {
        require(!hasApproved[_txId][msg.sender], "Already approved");

        hasApproved[_txId][msg.sender] = true;
        transactions[_txId].approvalCount++;

        emit TransactionApproved(_txId, msg.sender);

        // Start timelock when approval threshold is met
        TxData storage txn = transactions[_txId];
        uint256 required = getRequiredApprovals(txn.amount);
        if (txn.approvalCount >= required && txn.executeAfter == 0) {
            txn.executeAfter = block.timestamp + timelockDuration;
            emit TimelockStarted(_txId, txn.executeAfter);
        }
    }

    function revokeApproval(uint256 _txId)
        external
        onlySigner
        txExists(_txId)
        notExecuted(_txId)
    {
        require(hasApproved[_txId][msg.sender], "Have not approved");

        hasApproved[_txId][msg.sender] = false;
        transactions[_txId].approvalCount--;

        // Reset timelock if approvals drop below threshold
        TxData storage txn = transactions[_txId];
        uint256 required = getRequiredApprovals(txn.amount);
        if (txn.approvalCount < required) {
            txn.executeAfter = 0;
        }

        emit ApprovalRevoked(_txId, msg.sender);
    }

    function reject(uint256 _txId, string calldata _reason)
        external
        onlySigner
        txExists(_txId)
        notExecuted(_txId)
        notExpired(_txId)
    {
        require(!hasRejected[_txId][msg.sender], "Already rejected");

        hasRejected[_txId][msg.sender] = true;
        transactions[_txId].rejectionCount++;

        // Auto-cancel if majority rejects
        if (transactions[_txId].rejectionCount > signers.length / 2) {
            transactions[_txId].cancelled = true;
            emit TransactionCancelled(_txId, msg.sender);
        }

        emit TransactionRejected(_txId, msg.sender, _reason);
    }

    function execute(uint256 _txId)
        external
        onlySigner
        txExists(_txId)
        notExecuted(_txId)
        whenNotPaused
        nonReentrant
    {
        TxData storage txn = transactions[_txId];

        // Check expiration
        require(block.timestamp <= txn.expiresAt, "Transaction expired");

        // Check tiered approval threshold
        uint256 required = getRequiredApprovals(txn.amount);
        require(txn.approvalCount >= required, "Not enough approvals");

        // Check timelock
        require(txn.executeAfter > 0, "Timelock not started");
        require(block.timestamp >= txn.executeAfter, "Timelock not elapsed");

        // Check daily spending limit
        _resetDailySpendIfNewDay();
        require(spentToday + txn.amount <= dailyLimit, "Daily limit exceeded");
        spentToday += txn.amount;

        txn.executed = true;

        IERC20(txn.token).safeTransfer(txn.to, txn.amount);

        emit TransactionExecuted(_txId, msg.sender);
    }

    function cancel(uint256 _txId)
        external
        onlySigner
        txExists(_txId)
        notExecuted(_txId)
    {
        require(
            transactions[_txId].proposer == msg.sender,
            "Only proposer can cancel"
        );
        transactions[_txId].cancelled = true;
        emit TransactionCancelled(_txId, msg.sender);
    }

    // ─── Emergency Pause ─────────────────────────────────────────────────────

    function emergencyPause() external onlySigner {
        _pause();
        // Reset unpause votes
        for (uint256 i = 0; i < signers.length; i++) {
            hasVotedUnpause[signers[i]] = false;
        }
        unpauseVoteCount = 0;
        emit ContractPaused(msg.sender);
    }

    function voteUnpause() external onlySigner {
        require(paused(), "Not paused");
        require(!hasVotedUnpause[msg.sender], "Already voted");

        hasVotedUnpause[msg.sender] = true;
        unpauseVoteCount++;

        uint256 quorum = (signers.length / 2) + 1;
        emit UnpauseVoteCast(msg.sender, unpauseVoteCount, quorum);

        if (unpauseVoteCount >= quorum) {
            _unpause();
            for (uint256 i = 0; i < signers.length; i++) {
                hasVotedUnpause[signers[i]] = false;
            }
            unpauseVoteCount = 0;
            emit ContractUnpaused(msg.sender);
        }
    }

    // ─── Admin ───────────────────────────────────────────────────────────────

    function addSigner(address _signer) external onlySigner {
        require(_signer != address(0), "Zero address");
        require(!isSigner[_signer], "Already a signer");

        isSigner[_signer] = true;
        signers.push(_signer);

        emit SignerAdded(_signer);
    }

    function removeSigner(address _signer) external onlySigner {
        require(isSigner[_signer], "Not a signer");
        require(signers.length > 1, "Cannot remove last signer");

        isSigner[_signer] = false;

        for (uint256 i = 0; i < signers.length; i++) {
            if (signers[i] == _signer) {
                signers[i] = signers[signers.length - 1];
                signers.pop();
                break;
            }
        }

        emit SignerRemoved(_signer);
    }

    function setThresholds(
        uint256 _low,
        uint256 _medium,
        uint256 _high
    ) external onlySigner {
        require(_low < _medium && _medium < _high, "Invalid thresholds");
        lowThreshold = _low;
        mediumThreshold = _medium;
        highThreshold = _high;
        emit ThresholdsUpdated(_low, _medium, _high);
    }

    function setDailyLimit(uint256 _limit) external onlySigner {
        uint256 old = dailyLimit;
        dailyLimit = _limit;
        emit DailyLimitUpdated(old, _limit);
    }

    function setTimelockDuration(uint256 _duration) external onlySigner {
        uint256 old = timelockDuration;
        timelockDuration = _duration;
        emit TimelockDurationUpdated(old, _duration);
    }

    // ─── Views ───────────────────────────────────────────────────────────────

    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    function getSigners() external view returns (address[] memory) {
        return signers;
    }

    function getSignerCount() external view returns (uint256) {
        return signers.length;
    }

    function getTransaction(uint256 _txId) external view txExists(_txId) returns (TxData memory) {
        return transactions[_txId];
    }

    function getRequiredApprovalsForTx(uint256 _txId) external view txExists(_txId) returns (uint256) {
        return getRequiredApprovals(transactions[_txId].amount);
    }

    function getDailySpendRemaining() external view returns (uint256) {
        uint256 today = block.timestamp / 1 days;
        if (today > lastSpendDate) {
            return dailyLimit;
        }
        if (spentToday >= dailyLimit) return 0;
        return dailyLimit - spentToday;
    }

    function isTransactionExpired(uint256 _txId) external view txExists(_txId) returns (bool) {
        return block.timestamp > transactions[_txId].expiresAt;
    }

    function getThresholds() external view returns (uint256 low, uint256 medium, uint256 high) {
        return (lowThreshold, mediumThreshold, highThreshold);
    }

    // ─── Internal ────────────────────────────────────────────────────────────

    function _resetDailySpendIfNewDay() internal {
        uint256 today = block.timestamp / 1 days;
        if (today > lastSpendDate) {
            spentToday = 0;
            lastSpendDate = today;
        }
    }

    // Allow the treasury to receive native tokens
    receive() external payable {}
}
