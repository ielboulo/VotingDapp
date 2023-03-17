// SPDX-License-Identifier: MIT

pragma solidity 0.8.19; 

// import ownership contract from OpenZeppelin
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
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    mapping(address => Voter) voters;
    Proposal[] proposals;
    uint winningProposalId;
    WorkflowStatus status = WorkflowStatus.RegisteringVoters;

    function registerVoter(address _voter) public onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters, "Voter registration closed or not started");
        require(voters[_voter].isRegistered == false, "Voter already registered");
        voters[_voter].isRegistered  = true;
        emit VoterRegistered(_voter);
    }

    function startProposalRegistration() public onlyOwner {
        require (status == WorkflowStatus.RegisteringVoters, "Proposal registration closed or not started");
        status = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    function stopProposalRegistration() public onlyOwner {
        require (status == WorkflowStatus.ProposalsRegistrationStarted, "Proposal registration already closed");
        status = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    function registerProposal(string memory _description) public {
        require(status == WorkflowStatus.ProposalsRegistrationStarted, "Proposal registration closed or not started");
        
        // Add a check to prevent DoS attack by limiting proposal length
        require(bytes(_description).length <= 200, "Proposal description too long");

        proposals.push(Proposal(_description, 0));
        uint proposalId = proposals.length - 1;
        emit ProposalRegistered(proposalId);
    }

    function startVotingSession() public onlyOwner {
        require(status == WorkflowStatus.ProposalsRegistrationEnded, "Proposal registration still open or voting already started");
        status = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    function endVotingSession() public onlyOwner {
        require(status == WorkflowStatus.VotingSessionStarted, "Voting session not started or already ended");
        status = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    function vote(uint proposalId ) public {
        require(status == WorkflowStatus.VotingSessionStarted, "Voting session not started or already ended");
        require(voters[msg.sender].isRegistered == true, "Not a registered voter");
        require(voters[msg.sender].hasVoted == false, "Already voted");
        require(proposalId < proposals.length, "Invalid proposal ID");

        // Add a check to prevent DoS attack by limiting gas usage
        require(gasleft() >= 50000, "Not enough gas");
    
    proposals[proposalId].voteCount += 1;
    voters[msg.sender].hasVoted = true;
    voters[msg.sender].votedProposalId = proposalId;
    emit Voted (msg.sender, proposalId);
}

function getWinner() public onlyOwner {
    require(status == WorkflowStatus.VotingSessionEnded, "Voting session still open or not ended");
    status = WorkflowStatus.VotesTallied;
    emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    uint winnerVotes = 0;
    for (uint v = 0; v < proposals.length; v++) {
        if (proposals[v].voteCount > winnerVotes) {
            winnerVotes = proposals[v].voteCount;
            winningProposalId = v;
        }
    }
}

function getWinningProposalId() public view returns (uint) {
    require(status == WorkflowStatus.VotesTallied, "Votes not tallied yet");
    return winningProposalId;
}

function getProposalVotePercentage(uint proposalId) public view returns (uint) {
    require(proposalId < proposals.length, "Invalid proposal ID");
    uint totalVotes = 0;
    for (uint i = 0; i < proposals.length; i++) {
        totalVotes += proposals[i].voteCount;
    }
    return totalVotes == 0 ? 0 : proposals[proposalId].voteCount * 100 / totalVotes;
}
}
