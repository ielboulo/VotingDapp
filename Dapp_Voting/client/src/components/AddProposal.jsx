//import { useState } from "react";
//import useEth from "../../contexts/EthContext/useEth";


 import React, { useState } from 'react';
 import useEth from "../contexts/EthContext/useEth";

function AddProposal() {
  const { state: {accounts, contract, web3}} = useEth();
  const [inputProposal,  setInputProposal] = useState("");


  const handleAddProposalChange = e => {
    console.log("Proposal destination = ", e.target.value);

/*     if(( e.target.value !== "")) {
      console.log("Proposal is not valid");
    }
    else {
      console.log("good Proposal");
    } */
    setInputProposal(e.target.value);
  };

  const _addProposal = async () => {
    console.log("addProposal(): inputProposal 1 = ", inputProposal);
    //if((inputProposal  !== "")) {
   //  alert("invalid Proposal")

   // }
    console.log("befor call : from accounts = ", accounts[0]);
    console.log("befor call : contract.methods = ", contract.methods);

    try {
      console.log("start proposal registering ");
        await contract.methods.startProposalsRegistering().send({ from: accounts[0] }); // Admin 
      console.log("add proposal to smart contract")
        await contract.methods.addProposal(inputProposal).send({from : accounts[0]});
        
        console.log("vous avez enregistré votre proposal ", inputProposal);

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
          size="50"
          placeholder="Add Your Own Proposal"
          value={inputProposal}
          onChange={handleAddProposalChange}
        />
<br/>
<br/>
      <button className="bp"  onClick={_addProposal}>
        Add Proposal 
      </button>

    </div>     
 
  );
}


export default AddProposal;
