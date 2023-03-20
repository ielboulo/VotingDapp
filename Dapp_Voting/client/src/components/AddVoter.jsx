//import { useState } from "react";
//import useEth from "../../contexts/EthContext/useEth";


 import React, { useState } from 'react';
 import useEth from "../contexts/EthContext/useEth";

function AddVoter() {
  const { state: {accounts, contract, web3}} = useEth();
  const [inputAddress,  setInputAddress] = useState("");


  const handleAddressChange = e => {
    console.log("address destination = ", e.target.value);

    if(!web3.utils.isAddress( e.target.value)) {
      console.log("address not valid");
    }
    else {
      console.log("good address");
    }
    setInputAddress(e.target.value);
  };

  const _addVoter = async () => {
    console.log("addVoter(): inputAddress 1 = ", inputAddress);
    if(!web3.utils.isAddress(inputAddress)) {
      alert("invalid address")
      console.log("addVoter(): inputAddress = invalid address = ", inputAddress);

    }
    console.log("befor call : from accounts = ", accounts[0]);
    console.log("befor call : contract.methods = ", contract.methods);

    try {
        await contract.methods.addVoter(inputAddress).send({from : accounts[0]});
        console.log("vous avez enregistré l'adresse ", inputAddress);

      } catch (err) {
        // IEL : si echec analyser pkoi : events ? 
        //alert(err.message);
        console.error(err);
        if (err.message.includes("Already registered")) {
          alert("Address is already registered");
      }
  }
};

  return (

    <div className="inputs">
      <input
          type="text"
          placeholder="address"
          value={inputAddress}
          onChange={handleAddressChange}
        />

      <button onClick={_addVoter} className="transfer-btn">
        Add Voter 
      </button>

    </div>     
 
  );
}


export default AddVoter;
