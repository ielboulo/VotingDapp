import { useEffect, useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function VoteTally() {
  const { state: {contract, accounts} } = useEth();
  const [loading, setLoading] = useState(false);
  
  const handleTallyVote = async () => {
    setLoading(true); 
    try {
      await contract.methods.tallyVotes().send({ from: accounts[0] });
      console.log("vote tally success");

    } catch (err) {
      console.error(err);
      console.log("vote open fail");
    }
    setLoading(false);
  };

  return (
    <div>
      <button className="button_1" onClick={handleTallyVote} disabled={loading}>
        Tally Vote {loading}
      </button>
    </div>
  );
}

export default VoteTally;
