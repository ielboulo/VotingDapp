import { EthProvider } from "./contexts/EthContext";
import Login from "./components/Login";
import AddVoter from "./components/AddVoter";
import ProposalPhase from "./components/ProposalPhase.jsx";
import VotePhase from "./components/VotePhase.jsx";
import VoteTally from "./components/VoteTally";
import VoteWinner from "./components/VoteWinner"; 
import StatusWatcher from "./components/StatusWatcher";

import NewMarc from "./components/NewMarc";
import ProposalPhase from "./components/ProposalPhase";
import VotePhase from "./components/VotePhase";
import VoteWinner from "./components/VoteWinner";
import AddProposal from "./components/AddProposal";
import AddVote from "./components/AddVote";



function App() {

  return (
    <EthProvider>
      <div id="App">
        <div className="container">
        <br />
        <br />
          <Login />
          <br />
          <hr />

          <h1 className="title_phase"> Status Watcher  </h1>
          <StatusWatcher />
          <hr />
        
        </div>
      </div>
    </EthProvider>
  );
}

export default App;

