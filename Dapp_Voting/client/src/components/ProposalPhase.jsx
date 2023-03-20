import { useEffect, useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function ProposalPhase() {
  const { state: {contract, accounts} } = useEth();
  const [loading, setLoading] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState("");

  const statusStrings = {
    0: "RegisteringVoters",
    1: "ProposalsRegistrationStarted",
    2: "ProposalsRegistrationEnded",
    3: "VotingSessionStarted",
    4: "VotingSessionEnded",
    5: "VotesTallied"
  };
  
  const handleOpenProposal = async () => {
    setLoading(true); 
    try {
      await contract.methods.startProposalsRegistering().send({ from: accounts[0] });

      const status = await contract.methods.workflowStatus().call();
      setWorkflowStatus(statusStrings[status]);

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

      const status = await contract.methods.workflowStatus().call();
      setWorkflowStatus(statusStrings[status]);

      console.log("proposal close success ");
    } catch (err) {
      console.error(err);
      console.log("proposal close fail");
    }
    setLoading(false);
  };

  useEffect(() => {



    const getWorkflowStatus = async () => {
      if (!contract) {
        return;
      }
      const status = await contract.methods.workflowStatus().call();
      setWorkflowStatus(statusStrings[status]);
      setLoading(false);
    };
    getWorkflowStatus();
  }, [contract]);

  return (
    <div>
      <button onClick={handleOpenProposal} disabled={loading}>
        Open Proposal {loading}
      </button>
      <button onClick={handleCloseProposal} disabled={loading}>
        Close Proposal {loading}
      </button>
      <p>
        current workflowStatus = {workflowStatus}
      </p>
    </div>
  );
}

export default ProposalPhase;
