/* import React, { useState } from 'react';
import useEth from "../contexts/EthContext/useEth";

//Get List
try {
    for i = 1; i++
    array.append( getOneProposal ( i) )
    }
    catch(error){
    console.log(may be size lenght may be reached )
    }
//Display List
async function ProposalList() {
    const proposalsList = await contract.methods.Proposal.map().send({from : accounts[0]});        
    const proposalList = proposalsList.map(proposal => <h2>{proposal}</h2>)
  return (<div>{proposalList}</div>)
}

export default ProposalList */

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import VotingContract from './contracts/Voting.json';

function ProposalList({ contractAddress }) {
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    async function fetchProposals() {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const votingContract = new web3.eth.Contract(VotingContract.abi, contractAddress);

        const proposalsArray = await votingContract.methods.proposalsArray().call();

        // Remove the first proposal since it's a dummy proposal
        proposalsArray.shift();

        const proposals = await Promise.all(
          proposalsArray.map(async (proposalId) => {
            const proposal = await votingContract.methods.getOneProposal(proposalId).call({ from: accounts[0] });
            return proposal;
          })
        );

        setProposals(proposals);
      } catch (err) {
        console.error(err);
      }
    }

    fetchProposals();
  }, [contractAddress]);

  return (
    <div>
      <h2>Proposals</h2>
      <ul>
        {proposals.map((proposal) => (
          <li key={proposal.description}>{proposal.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProposalList;
