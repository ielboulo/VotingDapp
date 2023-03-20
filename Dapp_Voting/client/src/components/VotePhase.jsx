import { useEffect, useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function ProposalPhase() {
  const { state: {contract, accounts} } = useEth();
  const [loading, setLoading] = useState(false);
  
  const handleOpenVote = async () => {
    setLoading(true); 
    try {
      await contract.methods.startVotingSession().send({ from: accounts[0] });
      console.log("vote open success");

    } catch (err) {
      console.error(err);
      console.log("vote open fail");
    }
    setLoading(false);
  };

  const handleCloseVote = async () => {
    setLoading(true);
    try {
      await contract.methods.endVotingSession().send({ from: accounts[0] });
      console.log("vote close success ");

    } catch (err) {
      console.error(err);
      console.log("vote close fail");
    }
    setLoading(false);
  };

  return (
    <div>
      <button className="bp" onClick={handleOpenVote} disabled={loading}>
        Open Vote {loading}
      </button>
      <button className="bp" onClick={handleCloseVote} disabled={loading}>
        Close Vote {loading}
      </button>
    </div>
  );
}

export default ProposalPhase;
