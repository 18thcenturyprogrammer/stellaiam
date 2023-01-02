import React, { Component,useState, useEffect } from "react";
import { Label,Image } from 'semantic-ui-react';
import { ethers,utils } from 'ethers';


const WalletBalances = (currentAccount)=>{
    console.log("===============================================================");
    console.log("WalletBalances component called");

    console.log("currentAccount : ",currentAccount);

    const [maticAmount , setMaticAmount] = useState("0");

    // mumbai
    const ALCHEMY_WEB_SOKET_URL = "wss://polygon-mumbai.g.alchemy.com/v2/Uud_P7gk4UKBPIgcNN2nV3jsEbhn1R5Z";

    // goerli
    // const ALCHEMY_WEB_SOKET_URL = "wss://eth-goerli.g.alchemy.com/v2/KXJ0iIhs-2tEIlO3kcon6D1o5mywOH37";
    
    // polygon
    // const ALCHEMY_WEB_SOKET_URL = "wss://polygon-mainnet.g.alchemy.com/v2/DFuDEgD0tnobEdjgNsitZ3wZDtksZ4Qf";
   

    var wsProvider = new ethers.providers.WebSocketProvider(ALCHEMY_WEB_SOKET_URL);

    // goerli matic contract
    // const maticContractAddress = '0xda5f92b81b7095b5763a09bd4a668dcfe6f3b133';

    // polygon matic contract
    // const maticContractAddress = '0x0000000000000000000000000000000000001010';

    // mumbai avubble contract
    const maticContractAddress = '0x0000000000000000000000000000000000001010';
    

    // mumbai matic , goerli matic abi
    // const maticAbi = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"addMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isMinter","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"MinterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"}],"name":"MinterRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"}]';

    // polygon matic abi
    const maticAbi = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"setParent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes","name":"sig","type":"bytes"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"data","type":"bytes32"},{"internalType":"uint256","name":"expiration","type":"uint256"},{"internalType":"address","name":"to","type":"address"}],"name":"transferWithSig","outputs":[{"internalType":"address","name":"from","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_childChain","type":"address"},{"internalType":"address","name":"_token","type":"address"}],"name":"initialize","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"parent","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"parentOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"currentSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"},{"internalType":"bytes","name":"sig","type":"bytes"}],"name":"ecrecovery","outputs":[{"internalType":"address","name":"result","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"networkId","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"EIP712_TOKEN_TRANSFER_ORDER_SCHEMA_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"disabledHashes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"tokenIdOrAmount","type":"uint256"},{"internalType":"bytes32","name":"data","type":"bytes32"},{"internalType":"uint256","name":"expiration","type":"uint256"}],"name":"getTokenTransferOrderHash","outputs":[{"internalType":"bytes32","name":"orderHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"CHAINID","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"EIP712_DOMAIN_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"EIP712_DOMAIN_SCHEMA_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"input1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"output1","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"input1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"output1","type":"uint256"}],"name":"Withdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"input1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"input2","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"output1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"output2","type":"uint256"}],"name":"LogTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"token","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"input1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"input2","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"output1","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"output2","type":"uint256"}],"name":"LogFeeTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"}]'
    
    
    let maticContract = new ethers.Contract(maticContractAddress, maticAbi, wsProvider);
   
    const updateBalances = (address)=>{
        // console.log("updateBalances is called ");
        // console.log("address is : ",address);
    
        try{
            // 4 digits decimals ref) https://ethereum.stackexchange.com/a/97885
            maticContract.balanceOf(address).then((maticQty)=>{
                // console.log("maticQty : ",maticQty);
                // console.log("maticQty : ",maticQty.toString());
                const tempMaticQty = utils.formatEther(maticQty);
                setMaticAmount((+tempMaticQty).toFixed(4));
            });
            
        }catch(error){
            // failed to bring matic amount
            console.log("failed to bring matic amount");
            console.log("error : ",error);
        }
        
    };

    const startWatchEvents = (address)=>{
       console.log('address :',address);

       maticContract.on("LogTransfer", (token, from, to, data) => {
            // filtering event data 
            //  i need only events related to my address
            if(from.toLowerCase() == address || to.toLowerCase() == address){

                // console.log("matic token LogTransfer");
                // console.log("token : ",token);
                // console.log("from : ",from);
                // console.log("to : ",to);
                // console.log("data : ",data);
                updateBalances(address);
            }            
        });
   };

    


    useEffect(()=>{
        console.log("currentAccount updated");
        console.log("currentAccount :",currentAccount);
        console.log("currentAccount.currentAccount :",currentAccount.currentAccount);

        if(currentAccount.currentAccount != null){
            // console.log("addressAndPrivKey.address : ",addressAndPrivKey.address);
            startWatchEvents(currentAccount.currentAccount);
            updateBalances(currentAccount.currentAccount);
        }   
    },[currentAccount]);
    


    return (
        <>
            <Label as='a' color='teal' image>
            <Image avatar spaced='right' src='/imgs/matic_token.jpg' />
            {maticAmount}
            <Label.Detail>MATIC</Label.Detail> 
            </Label>
        </>
    );
};

export default WalletBalances;