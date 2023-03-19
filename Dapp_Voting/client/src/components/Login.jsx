import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./styles.css";

function Login() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const allowedNetworks = [5, 1337]; // Goerli Testnet & localhost (Ganache)

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        // Metamask is installed
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          setWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setAccounts(accounts);
          const networkId = await web3.eth.net.getId();
          if (!allowedNetworks.includes(networkId)) {
            throw new Error(`Connected to unsupported network with ID: ${networkId}`);
            //console.log(`Connected to unsupported network with ID: ${networkId}`);
          }
        } catch (error) {
          // User denied account access
          console.log(error);
        }
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
        const networkId = await web3.eth.net.getId();
        if (!allowedNetworks.includes(networkId)) {
          throw new Error(`Connected to unsupported network with ID: ${networkId}`);
          //console.log(`Connected to unsupported network with ID: ${networkId}`);
        }
      } catch (error) {
        // User denied account access
        console.log(error);
      }
    }
  };

  return (
    <div>
      <h1 className="title_dapp"> Voting DApp </h1>
      {web3 ? (
        <p className= "p-conn" >Connected with {accounts[0]}</p>
      ) : (

       <button className= "btn-conn" onClick={connectWallet}>
        Connect Wallet
       </button>

      )}
    </div>
  );
}

export default Login;
