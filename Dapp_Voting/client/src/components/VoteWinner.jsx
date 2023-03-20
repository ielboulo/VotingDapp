import { useEffect, useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function VoteWinner() {
  const { state: {contract, web3, accounts} } = useEth();
  const [loading, setLoading] = useState(false);
  const [winner, setWinner] = useState('');


  const getWinner = async () => {
    if (!contract) {
      return;
    }
  
    const winningProposalID = await contract.methods.winningProposalID().call();
    const proposal = await contract.methods.getOneProposal(winningProposalID).call( { from : accounts[0]});
    setWinner(`The winner of the votes is "${winningProposalID}" for the Proposal : "${proposal}"`);
    setLoading(false);
  };


  return (
    <div>
      <button className="button_1" onClick={getWinner} disabled={loading}>
        Who is the winner ?  
      </button>

      <p>
      {winner}
      </p>
    </div>
  );
}

export default VoteWinner;
