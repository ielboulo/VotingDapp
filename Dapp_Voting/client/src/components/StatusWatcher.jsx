import { useEffect, useState } from "react";
import useEth from "../contexts/EthContext/useEth";

function StatusWatcher() {
  const { state: {contract, web3}} = useEth();
  const [currentStatus, setCurrentStatus] = useState(0);
  const [statusSTR, setStatusSTR] = useState({
    0: { name: "RegisteringVoters" },
    1: { name: "ProposalsRegistrationStarted"},
    2: { name: "ProposalsRegistrationEnded" },
    3: { name: "VotingSessionStarted" },
    4: { name: "VotingSessionEnded" },
    5: { name: "VotesTallied" }
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
        <br/>
      <ol>
        {Object.entries(statusSTR)
          .filter(([status, { name }]) => Number(status) <= currentStatus)
          .map(([status, { name }]) => (
            <li key={status} className={status === currentStatus ? "active" : ""}>
               {name}
            </li>
          ))}
      </ol>
    </div> 
  );
}

export default StatusWatcher;
