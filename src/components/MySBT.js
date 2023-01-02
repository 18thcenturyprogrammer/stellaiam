import Web3 from "web3";

import React, { Component,useState, useEffect } from "react";
import { Table,Button,Icon,Form,Label, TextArea, Message,Item,List,Image,Comment,Header,Modal,Segment,Dimmer,Loader, Checkbox, Input } from 'semantic-ui-react';
import { Toaster ,toast } from 'react-hot-toast';

import MenuComponent from './MenuComponent';
import ConnectButton from './ConnectButton';
import WalletBalances from './WalletBalances';

const MySBT = ()=>{

    require('dotenv').config();

    const NETWORKS = {
        1: "Ethereum Main Network",
        3: "Ropsten Test Network",
        4: "Rinkeby Test Network",
        5: "Goerli Test Network",
        42: "Kovan Test Network",
        137: "Polygon Main Network",
        80001: "Mumbai Test Network"
    };

    const [isConnected, setIsConnected] = useState(false);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [provider, setProvider] = useState(window.ethereum);
    const [chainId, setChainId] = useState(null);
    const [isApproved, setIsApproved] = useState(false);
    const [web3, setWeb3] = useState(null);

    const [isProcess,setIsProcess] = useState(false);

    const [balance,setBalance] = useState(0);
    const [cards,setCards] = useState("");



    const { ethers, BigNumber } = require("ethers");

    





    // this is called in ConnectButton.js when user 
    const onLogin = async (provider) => {
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();

        console.log("accounts.length :",accounts.length);
        console.log("chainId :",chainId);

        if (accounts.length === 0) {
            console.log("Please connect to MetaMask!");
        } 
        else if (accounts[0] !== currentAccount) {
            setProvider(provider);
            setWeb3(web3);
            setChainId(chainId);
            setCurrentAccount(accounts[0]);
            setIsConnected(true);
        }
    };

    const onLogout = () => {
        instantMsg("Wallet is disconnected", "warning")
        setIsConnected(false);
        setCurrentAccount(null);
    };

    const instantMsg = (msg, type)=>{

        switch (type){
            case "normal":
                toast.success(msg);
            
                break;
            case "warning":
                toast.error(msg);
        }
    };

    const onClickCard = (tokenId)=>{
        window.open("https://testnets.opensea.io/assets/mumbai/0x423b1375cdd7041aa9d4c54d039aaa00f9c12fd5/"+tokenId, "_blank");
    };


    useEffect(() => {
        const handleAccountsChanged = async (accounts) => {
            console.log("account changed");
            const web3Accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                onLogout();
            } else if (accounts[0] !== currentAccount) {
                setCurrentAccount(accounts[0]);
            }
        };

        const handleChainChanged = async (chainId) => {
            console.log("parseInt(chainId, 16) : ", parseInt(chainId, 16));
            
            const chainIdDec = parseInt(chainId, 16).toString();

            // this is redundance 
            // const web3ChainId = await web3.eth.getChainId();
           

            if(chainIdDec == 80001){
                // mumbai network supported

                instantMsg("Network changed into "+NETWORKS[chainIdDec.toString()], "normal");
            }else{
                instantMsg("Network changed but only Mumbai is supported", "warning");
            }
            setChainId(chainIdDec);
        };

        if (isConnected) {
            // attaching listener for metamask events
            console.log('metamask event listeners attached');
            provider.on("accountsChanged", handleAccountsChanged);
            provider.on("chainChanged", handleChainChanged);
        }

        // this func will be execute as cleaning up process whenever this component is disappeared
        return () => {
            if (isConnected) {
                provider.removeListener("accountsChanged", handleAccountsChanged);
                provider.removeListener("chainChanged", handleChainChanged);
            }
        };
    }, [isConnected]);

    useEffect(()=>{
        if(currentAccount != null){
            getBalance(currentAccount);
            getSBTcards(currentAccount);
        }
    },[currentAccount]);


    const getBalance = async (currentAccount)=>{
        console.log("getBalance called");

        console.log("provider : ",provider);
        console.dir(provider);

        const abi = process.env.REACT_APP_ABI;
        const abi_web3 = JSON.parse(abi);
        const stellaiamContractAddress = process.env.REACT_APP_STELLAIAM_CONTRACT_ADDRESS;
        
        
        const stellaiamNftContract_web3 = new web3.eth.Contract(abi_web3, stellaiamContractAddress);

        try {
            if(ethers.utils.isAddress(currentAccount)){
                
                // const result = await stellaiamNftContract.balanceOf(txt3);
                const result = await stellaiamNftContract_web3.methods.balanceOf(currentAccount).call()

                console.log("result : ", result);
                console.dir(result);
            
                setBalance(result);
                                
            }else{
                throw new Error('Not valid address');
            }
            

        } catch (error) {
            
            console.dir(error);

            instantMsg(error.message,"warning");
        }

    };

    const getSBTcards = async (currentAccount)=>{
        console.log("getSBTcards called");

        const institutionNames = ["Google", "Kakao"];

        const abi = process.env.REACT_APP_ABI;
        const abi_web3 = JSON.parse(abi);
        const stellaiamContractAddress = process.env.REACT_APP_STELLAIAM_CONTRACT_ADDRESS;
        
        
        const stellaiamNftContract_web3 = new web3.eth.Contract(abi_web3, stellaiamContractAddress);

        var tempCards=[];

        for (let institutionName of institutionNames) {
            try {
                if(ethers.utils.isAddress(currentAccount)){
                    
                    const tokenId = await stellaiamNftContract_web3.methods.SBTcollectionByUser(currentAccount, institutionName).call()
    
                    console.log("tokenId : ", tokenId);
                    
                    if(tokenId != 0 ){
                        try {
                            if(ethers.utils.isAddress(currentAccount)){
                                
                                
                                const metaJsonURL = await stellaiamNftContract_web3.methods.uris(tokenId).call()
                
                                console.log("metaJsonURL : ", metaJsonURL);

                                const metaObj = await getJsonFromURL(metaJsonURL);

                                console.log("metaObj : ",metaObj);

                                tempCards.push(
                                    <>
                                        
                                        <div class="ui card" onClick={()=>{onClickCard(tokenId)}}>
                                        <div class="image">

                                            <img src = {metaObj.image}/>
                                            {/* <Image size='small' src={metaObj.image} wrapped /> */}
                                        </div>
                                        <div class="content">
                                            <a class="header">{metaObj.name}</a>
                                            <div class="description" style={{"word-wrap":"break-word"}}>
                                            {metaObj.description}
                                            </div>
                                        </div>
                                        <div class="extra content" style={{"word-wrap":"break-word"}}>
                                            <a src = {metaJsonURL}>
                                            {metaJsonURL}
                                            </a>
                                        </div>
                                        </div>
                                       

                                    </>
                                );
                                
                                                
                            }else{
                                throw new Error('Not valid address');
                            }
                            
                
                        } catch (error) {
                            
                            console.dir(error);
                
                            instantMsg(error.message,"warning");
                        }
                    }
                    
                                    
                }else{
                    throw new Error('Not valid address');
                }
                
    
            } catch (error) {
                
                console.dir(error);
    
                instantMsg(error.message,"warning");
            }
        }

        setCards(tempCards);

    };




    return(
        <>
            
            <Segment>
                <Dimmer active={isProcess}>
                    <Loader size='huge'>Processing</Loader>
                </Dimmer>
            

                
            <div className="ui centered one column grid">
                <div className="row">
                    <div className="column"><MenuComponent selectedMenu="content"/></div>
                </div>


                <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                    <WalletBalances currentAccount={currentAccount}/> 
                                    
                                    {isConnected &&
                                        <>
                                            <Label as='a' color='red' image>
                                                        <Icon name='home' size='small'/>
                                                        <Label.Detail>
                                                            {smartTrim(currentAccount,12)}
                                                        </Label.Detail>
                                            </Label>
                                        </>
                                    }
                                    {!isConnected &&
                                        <ConnectButton onLogin={onLogin} onLogout={onLogout}/>
                                    }   
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                </Table>

                <div className="column row">
                    <div className="column">


                    <Toaster/>

                    <Form>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan="2">
                                <h1>Balance : {balance} tokens</h1>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                                                
                            <Table.Row>
                                <Table.Cell colSpan='2'>
                                    <div class="ui link cards">
                                        {cards}
                                    </div>
                                </Table.Cell>        
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell colSpan='2'>
                                   
                                </Table.Cell>        
                            </Table.Row>
                            
                        </Table.Body>
            
                        <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='2'></Table.HeaderCell>

                        </Table.Row>
                        </Table.Footer>
                    </Table>
                    </Form>
                    
                    </div>


                </div>

                <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.Cell colSpan='2'>
                                    
                                </Table.Cell>        
                            </Table.Row>
                        </Table.Header>
                </Table>


            </div>

            </Segment>

        </>
    );
};

export default MySBT;



// ellipsis string ref) https://stackoverflow.com/a/831583
function smartTrim(string, maxLength) {
    if (!string) return string;
    if (maxLength < 1) return string;
    if (string.length <= maxLength) return string;
    if (maxLength == 1) return string.substring(0,1) + '...';

    var midpoint = Math.ceil(string.length / 2);
    var toremove = string.length - maxLength;
    var lstrip = Math.ceil(toremove/2);
    var rstrip = toremove - lstrip;
    return string.substring(0, midpoint-lstrip) + '...' 
    + string.substring(midpoint+rstrip);
} 

// get json from url 
async function getJsonFromURL(url) {
    
    let obj = await (await fetch(url)).json();
    
    //console.log(obj);
    return obj;
}