import { EthProvider } from "./contexts/EthContext";
import Login from "./components/Login";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <Login />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;

