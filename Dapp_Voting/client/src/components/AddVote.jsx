//import { useState } from "react";
//import useEth from "../../contexts/EthContext/useEth";


import React, { useState } from 'react';
import useEth from "../contexts/EthContext/useEth";

function AddVote() {
 const { state: {accounts, contract, web3}} = useEth();
 const [inputVote,  setInputVote] = useState("");


 const handleAddVoteChange = e => {
   console.log("Proposal destination = ", e.target.value);

/*     if(( e.target.value !== "")) {
     console.log("Proposal is not valid");
   }
   else {
     console.log("good Proposal");
   } */
   setInputVote(e.target.value);
 };

 const _addVote = async () => {
   console.log("addVote(): inputVote 1 = ", inputVote);
   //if((inputProposal  !== "")) {
  //  alert("invalid Proposal")

  // }
   console.log("befor call : from accounts = ", accounts[0]);
   console.log("befor call : contract.methods = ", contract.methods);

   try {
     console.log("start voting session ");
/*         await contract.methods.startProposalsRegistering().send({ from: accounts[0] }); // Admin 
 */        await contract.methods.endProposalsRegistering().send({ from: accounts[0] }); // Admin 

       await contract.methods.startVotingSession().send({ from: accounts[0] }); // Admin 
     console.log("add vote to smart contract")
       await contract.methods.setVote(inputVote).send({from : accounts[0]});
       
       console.log("vous avez enregistré votre Vote ", inputVote);

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
         placeholder="Proposal ID"
         value={inputVote}
         onChange={handleAddVoteChange}
       />
<br/>
<br/>
     <button className="bp"  onClick={_addVote}>
      Vote
     </button>

   </div>     

 );
}


export default AddVote;
