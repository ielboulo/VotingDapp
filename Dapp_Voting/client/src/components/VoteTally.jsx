import { useEffect, useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function VoteTally() {
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
  
  const handleTallyVote = async () => {
    setLoading(true); 
    try {
      await contract.methods.tallyVotes().send({ from: accounts[0] });
      console.log("vote tally success");

      const status = await contract.methods.workflowStatus().call();
      setWorkflowStatus(statusStrings[status]);

    } catch (err) {
      console.error(err);
      console.log("vote open fail");
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
      <button onClick={handleTallyVote} disabled={loading}>
        Tally Vote {loading}
      </button>

      <p>
        current {loading} workflowStatus = {workflowStatus}
      </p>
    </div>
  );
}

export default VoteTally;
