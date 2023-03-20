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
  
  const handleOpenVote = async () => {
    setLoading(true); 
    try {
      await contract.methods.startVotingSession().send({ from: accounts[0] });
      console.log("vote open success");

      const status = await contract.methods.workflowStatus().call();
      setWorkflowStatus(statusStrings[status]);

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

      const status = await contract.methods.workflowStatus().call();
      setWorkflowStatus(statusStrings[status]);

    } catch (err) {
      console.error(err);
      console.log("vote close fail");
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
      <button onClick={handleOpenVote} disabled={loading}>
        Open Vote {loading}
      </button>
      <button onClick={handleCloseVote} disabled={loading}>
        Close Vote {loading}
      </button>
      <p>
        current {loading} workflowStatus = {workflowStatus}
      </p>
    </div>
  );
}

export default ProposalPhase;
