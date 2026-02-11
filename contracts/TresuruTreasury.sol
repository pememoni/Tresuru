// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title TresuruTreasury
 * @notice Multi-sig corporate treasury for managing stablecoin payments on Tempo Network.
 *         Supports propose → approve → execute workflow with configurable thresholds.
 */
contract TresuruTreasury {
    using SafeERC20 for IERC20;

    // ─── Events ──────────────────────────────────────────────────────────────

    event SignerAdded(address indexed signer);
    event SignerRemoved(address indexed signer);
    event ThresholdUpdated(uint256 oldThreshold, uint256 newThreshold);

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
    }

    // ─── State ───────────────────────────────────────────────────────────────

    address[] public signers;
    mapping(address => bool) public isSigner;
    uint256 public requiredApprovals;

    TxData[] public transactions;
    mapping(uint256 => mapping(address => bool)) public hasApproved;
    mapping(uint256 => mapping(address => bool)) public hasRejected;

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

    // ─── Constructor ─────────────────────────────────────────────────────────

    constructor(address[] memory _signers, uint256 _requiredApprovals) {
        require(_signers.length > 0, "Need at least one signer");
        require(
            _requiredApprovals > 0 && _requiredApprovals <= _signers.length,
            "Invalid threshold"
        );

        for (uint256 i = 0; i < _signers.length; i++) {
            address s = _signers[i];
            require(s != address(0), "Zero address");
            require(!isSigner[s], "Duplicate signer");
            isSigner[s] = true;
            signers.push(s);
            emit SignerAdded(s);
        }

        requiredApprovals = _requiredApprovals;
    }

    // ─── Core Actions ────────────────────────────────────────────────────────

    function propose(
        address _to,
        uint256 _amount,
        address _token,
        string calldata _memo,
        string calldata _description
    ) external onlySigner returns (uint256) {
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
                rejectionCount: 0
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
    {
        require(!hasApproved[_txId][msg.sender], "Already approved");

        hasApproved[_txId][msg.sender] = true;
        transactions[_txId].approvalCount++;

        emit TransactionApproved(_txId, msg.sender);
    }

    function reject(uint256 _txId, string calldata _reason)
        external
        onlySigner
        txExists(_txId)
        notExecuted(_txId)
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
    {
        TxData storage txn = transactions[_txId];
        require(txn.approvalCount >= requiredApprovals, "Not enough approvals");

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
        require(signers.length - 1 >= requiredApprovals, "Would break threshold");

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

    function setRequiredApprovals(uint256 _required) external onlySigner {
        require(_required > 0 && _required <= signers.length, "Invalid threshold");
        uint256 old = requiredApprovals;
        requiredApprovals = _required;
        emit ThresholdUpdated(old, _required);
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

    // Allow the treasury to receive native tokens
    receive() external payable {}
}
