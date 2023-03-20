import { useEffect, useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function StatusWatcher() {
  const { state: {contract, web3}} = useEth();
  const [currentStatus, setCurrentStatus] = useState(0);
  const [statusSTR, setStatusSTR] = useState({
    0: { name: "RegisteringVoters", step: "Step 1" },
    1: { name: "ProposalsRegistrationStarted", step: "Step 2" },
    2: { name: "ProposalsRegistrationEnded", step: "Step 3" },
    3: { name: "VotingSessionStarted", step: "Step 4" },
    4: { name: "VotingSessionEnded", step: "Step 5" },
    5: { name: "VotesTallied", step: "Step 6" }
  });

  useEffect(() => {
    const getStatus = async () => {
      if (!contract) {
        return;
      }
      const status = await contract.methods.workflowStatus().call();
      setCurrentStatus(status);
    };
    getStatus();
  });

  useEffect(() => {
    if (!contract) {
      return;
    }
    const event = contract.events.WorkflowStatusChange();
    event.on('data', (eventData) => {
      const { newStatus } = eventData.returnValues;
      setCurrentStatus(newStatus);
    });

    return () => {
      event.removeAllListeners();
    }
  });

  return (
    <div>
      <h2>Workflow Status</h2>
      <hr />
      <ol>
        {Object.entries(statusSTR)
          .filter(([status, { name, step }]) => Number(status) <= currentStatus)
          .map(([status, { name, step }]) => (
            <li key={status} className={status === currentStatus ? "active" : ""}>
              {step}: {name}
            </li>
          ))}
      </ol>
    </div> 
  );
}

export default StatusWatcher;
