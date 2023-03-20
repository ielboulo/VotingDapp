import { EthProvider } from "./contexts/EthContext";
import Login from "./components/Login";
import AddVoter from "./components/AddVoter";
import ProposalPhase from "./components/ProposalPhase.jsx";
import VotePhase from "./components/VotePhase.jsx";
import VoteTally from "./components/VoteTally";
import VoteWinner from "./components/VoteWinner";
import StatusWatcher from "./components/StatusWatcher"

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

          <h1 className="title_phase"> Add Voters </h1>
          <AddVoter />
          <hr />

          <h1 className="title_phase"> Proposal Phase </h1>
          <ProposalPhase />
          <hr />

          <h1 className="title_phase"> Vote Phase </h1>
          <VotePhase />
          <hr />

          <h1 className="title_phase"> Tally Votes </h1>
          <VoteTally />
          <hr />

          <h1 className="title_phase"> VoteWinner </h1>
          <VoteWinner />

        </div>
      </div>
    </EthProvider>
  );
}

export default App;

