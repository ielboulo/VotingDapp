import { useEffect, useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function ProposalPhase() {
  const { state: {contract, accounts} } = useEth();
  const [loading, setLoading] = useState(false);
  
  const handleOpenProposal = async () => {
    setLoading(true); 
    try {
      await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
      console.log("proposal open success");
    } catch (err) {
      console.error(err);
      console.log("proposal open fail");
    }
    setLoading(false);
  };

  const handleCloseProposal = async () => {
    setLoading(true);
    try {
      await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
      console.log("proposal close success ");

    } catch (err) {
      console.error(err);
      console.log("proposal close fail");
    }
    setLoading(false);
  };

  return (
    <div>
      <button className="bp" onClick={handleOpenProposal} disabled={loading}>
        Open Proposal {loading}
      </button>
      <button className="bp" onClick={handleCloseProposal} disabled={loading}>
        Close Proposal {loading}
      </button>
    </div>
  );
}

export default ProposalPhase;
