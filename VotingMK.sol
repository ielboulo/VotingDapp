// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Voting is Ownable {
struct Voter {
bool isRegistered;
bool hasVoted;
uint votedProposalId;
}

struct Proposal {
    string description;
    uint voteCount;
}

enum WorkflowStatus {
    RegisteringVoters,
    ProposalsRegistrationStarted,
    ProposalsRegistrationEnded,
    VotingSessionStarted,
    VotingSessionEnded,
    VotesTallied
}

event VoterRegistered(address indexed voterAddress);
event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus);
event ProposalRegistered(uint indexed proposalId);
event Voted(address indexed voter, uint indexed proposalId);
event VotesTallied(uint indexed proposalId, uint indexed voteCount);

mapping(address => Voter) public voters;
Proposal[] public proposals;
uint public winningProposalId;
WorkflowStatus public status = WorkflowStatus.RegisteringVoters;

function registerVoter(address _voter) public onlyOwner {
    require(status == WorkflowStatus.RegisteringVoters, "Registration of Voters not allowed at this time");
    require(!voters[_voter].isRegistered, "This voter is already registered");
    voters[_voter].isRegistered = true;
    emit VoterRegistered(_voter);
}

function startProposalRegistration() public onlyOwner {
    require(status == WorkflowStatus.RegisteringVoters, "Registration of Proposals not allowed at this time");
    status = WorkflowStatus.ProposalsRegistrationStarted;
    emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, status);
}

function stopProposalRegistration() public onlyOwner {
    require(status == WorkflowStatus.ProposalsRegistrationStarted, "Proposal registration already closed");
    status = WorkflowStatus.ProposalsRegistrationEnded;
    emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, status);
}

function registerProposal(string memory _description) public {
    require(status == WorkflowStatus.ProposalsRegistrationStarted, "Registration of Proposals not allowed at this time");
    proposals.push(Proposal(_description, 0));
    uint proposalId = proposals.length - 1;
    emit ProposalRegistered(proposalId);
}

function startVotingSession() public onlyOwner {
    require(status == WorkflowStatus.ProposalsRegistrationEnded, "Voting session not allowed at this time");
    status = WorkflowStatus.VotingSessionStarted;
    emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, status);
}

function endVotingSession() public onlyOwner {
    require(status == WorkflowStatus.VotingSessionStarted, "Voting session already closed");
    status = WorkflowStatus.VotingSessionEnded;
    emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, status);
}

function vote(uint proposalId) public {
    require(status == WorkflowStatus.VotingSessionStarted, "Voting not allowed at this time");
    Voter storage sender = voters[msg.sender];
    require(sender.isRegistered, "Not a registered voter");
    require(!sender.hasVoted, "This voter has already voted");
    require(proposalId < proposals.length, "Invalid proposal ID");
    Proposal storage proposal = proposals[proposalId];
    sender.hasVoted = true;
    sender.votedProposalId = proposalId;
    proposal.voteCount += 1;
    emit Voted(msg.sender, proposalId);
}

function getWinner() public onlyOwner {
    require(status == WorkflowStatus.VotingSessionEnded, "Voting
