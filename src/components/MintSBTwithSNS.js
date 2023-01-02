
import { cryptico, RSAKey } from '@daotl/cryptico'


import Web3 from "web3";

import React, { Component,useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Table,Button,Icon,Form,Label, TextArea, Message,Item,List,Image,Comment,Header,Modal,Segment,Dimmer,Loader, Checkbox, Input } from 'semantic-ui-react';
import { Toaster ,toast } from 'react-hot-toast';
import PasswordValidator from "password-validator";

import GoogleLoginBtn from './GoogleLoginBtn';
import MenuComponent from './MenuComponent';
import ConnectButton from './ConnectButton';
import WalletBalances from './WalletBalances';



const MintSBTwithSNS = ()=>{
    

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

    const [mintModalOpen, setMintModalOpen] = useState(false);
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [whichSNS, setWhichSNS] = useState("");
    const [userData, setUserData] = useState({});
    const [checkedUserData, setCheckedUserData] = useState({});
    const [cryptedUserData, setCryptedUserData] = useState("");
    const [isProcess,setIsProcess] = useState(false);

    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [msg, setMsg] = useState([]);

    const [mintImgSrc, setMintImgSrc] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(()=>{
        // if user got through kakao oauth process, we have user data here 
        console.log("location.state : ",location.state);

        if(location.state != null){
            setWhichSNS("Kakao");
            setUserData(location.state);

            // check if user has approved owner of smart contract for handling their NFT tokens
            updateIsApprovedFlag(currentAccount);


        }

        // clear data 
        // ref) https://stackoverflow.com/a/71626372
        navigate(location.pathname, {}); 
        
    },[]);

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


    const updateIsApprovedFlag = async (userAddress)=>{
        console.log("updatedIsApproved called");

        try{
            const { ethers, BigNumber } = require("ethers");

            console.log("process.env.REACT_APP_ABI :", process.env.REACT_APP_ABI);
            const abi = process.env.REACT_APP_ABI;
            
            const stellaiamContractAddress = process.env.REACT_APP_STELLAIAM_CONTRACT_ADDRESS;

            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            const stellaiamNftContract = new ethers.Contract(stellaiamContractAddress,abi,provider);
            
            // Prompt user for account connections
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            
            console.log("signer : ",signer);
            console.dir(signer);

            console.log("userAddress:", userAddress);
            
            // send transaction with value
            // ref) https://vsupalov.com/ethers-call-payable-solidity-function/
            const result = await stellaiamNftContract.connect(signer).isApprovedForAll(userAddress,process.env.REACT_APP_WALLET_ADDRESS);
            
            console.log("result : ", result);
           
            setIsApproved(result);

        } catch (error) {
            
            console.dir(error);

        }
    };

    useEffect(()=>{
        if(currentAccount != undefined){
            updateIsApprovedFlag(currentAccount);
        }
    },[currentAccount]);



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

    const showMsg = (msg)=>{

        setMsg(msg);

        setTimeout(()=>{
            setMsg([]);
        }, 5000)
    };

    // user clicked approve button within modal 
    const approveHandleSBT = async ()=>{
        console.log("approveHandleSBT is called");
        setApproveModalOpen(false);
        setIsProcess(true);

        try {
            const { ethers, BigNumber } = require("ethers");

            const abi = process.env.REACT_APP_ABI;
            const stellaiamContractAddress = process.env.REACT_APP_STELLAIAM_CONTRACT_ADDRESS;

            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            const stellaiamNftContract = new ethers.Contract(stellaiamContractAddress,abi,provider);

            // Prompt user for account connections
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            // const connectedWallet = signer.connect(provider);
    
            const gasData = await provider.getFeeData();

            // if i follow eip 1559, i can't override gasprice option
            // maxFeePerGas must be higher than maxPriorityFeePerGas
            const mulMaxFeePerGas = gasData.maxFeePerGas.mul(BigNumber.from(50));
            const mulMaxPriorityFeePerGas = gasData.maxPriorityFeePerGas.mul(BigNumber.from(40));
            

            // normal gasLimit is 21000 , but not worked ,so i changed it to this
            const options = {
                value: 0,
                gasLimit:ethers.utils.hexlify(1000000),
                maxFeePerGas:mulMaxFeePerGas,
                maxPriorityFeePerGas:mulMaxPriorityFeePerGas,
                nonce: await provider.getTransactionCount(currentAccount)
            };

           
            // send transaction with value
            // ref) https://vsupalov.com/ethers-call-payable-solidity-function/
            const result = await stellaiamNftContract.connect(signer).setApprovalForAll(process.env.REACT_APP_WALLET_ADDRESS,true, options);
            
            const txReceipt = await result.wait();

            console.log("txReceipt : ", txReceipt);
            console.dir(txReceipt);

            if(txReceipt.blockNumber){
                console.log("approval successfully updated");
                setIsApproved(true);
            }


        } catch (error) {
            
            console.dir(error);

            instantMsg("Failed approval","warning");
        }

        setIsProcess(false);
        setApproveModalOpen(false);

    };


    // user clicked mint button within modal
    const mintSBT = async ()=>{
        console.log("mintSBT is called");
        setMintModalOpen(false);
        setIsProcess(true);

        try {
            const { ethers, BigNumber } = require("ethers");

            const abi = process.env.REACT_APP_ABI;
            const stellaiamContractAddress = process.env.REACT_APP_STELLAIAM_CONTRACT_ADDRESS;

            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            const stellaiamNftContract = new ethers.Contract(stellaiamContractAddress,abi,provider);

            // Prompt user for account connections
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            

            console.log("signer : ",signer);
            console.dir(signer);

            const userAddress = await signer.getAddress();

            console.log("userAddress:", userAddress);

            const gasData = await provider.getFeeData();

            // if i follow eip 1559, i can't override gasprice option
            // maxFeePerGas must be higher than maxPriorityFeePerGas
            const mulMaxFeePerGas = gasData.maxFeePerGas.mul(BigNumber.from(50));
            const mulMaxPriorityFeePerGas = gasData.maxPriorityFeePerGas.mul(BigNumber.from(40));

            // normal gasLimit is 21000 , but not worked ,so i changed it to this
            const options = {
                value: ethers.utils.parseUnits(0.001.toString(), "ether"),
                gasLimit:ethers.utils.hexlify(1000000),
                maxFeePerGas:mulMaxFeePerGas,
                maxPriorityFeePerGas:mulMaxPriorityFeePerGas,
                nonce: await provider.getTransactionCount(userAddress)
            };
            
            // send transaction with value
            // ref) https://vsupalov.com/ethers-call-payable-solidity-function/
            const result = await stellaiamNftContract.connect(signer).mintGroundSBT(cryptedUserData,JSON.stringify(checkedUserData),whichSNS, options);
            

            const txReceipt = await result.wait();

            console.log("txReceipt : ", txReceipt);
            console.dir(txReceipt);

            if(txReceipt.blockNumber){
                console.log("SBT minted all right");

                instantMsg("Successfully minted","normal");
                resetWhichSNSAndUserData("");
            }


        } catch (error) {
            
            console.dir(error);

            instantMsg("Failed minted","warning");
        }

        setIsProcess(false);
    
    };

    const userDataHandler = (userData)=>{
        console.log("user data from SNS :",userData);

        setUserData(userData);
    };


    // user typed in password1 input
    const onChangePassword1 = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setPassword1(value);
    };

    // user typed in password2 input
    const onChangePassword2 = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setPassword2(value);
    };

    // exposedData is dictionary format
    // create image with canvas 
    // ref) https://stackoverflow.com/a/71093607
    // canvas official doc ref) https://www.npmjs.com/package/canvas#canvascreatepngstream
    const createMintImg = (exposedData)=>{
        return new Promise((resolve, reject) => {
            const { loadImage, createCanvas } = require('canvas');
            const width = 600;
            const height = 600;
            const canvas = createCanvas(width, height);
            const context = canvas.getContext('2d');
            context.fillStyle = '#6936F5';
            context.fillRect(0, 0, width, height);

            context.font = 'bold 18pt Menlo';
            context.textBaseline = 'top';
            // context.textAlign = 'center';
            context.fillStyle = '#ffffff';

            var topMargin = 0;
            Object.entries(exposedData).forEach(([k,v])=>{
                const chunkV = chunkString(v, 25);

                for (let [index, val] of chunkV.entries()) {
                    if(index == 0){
                        var tempStr = k + " : ";
                        tempStr += val;
                        topMargin +=32;
                        context.fillText(tempStr, 20, topMargin);
                    }else{
                        var spaceStr = k + " : ";
                        var tempStr = "";
                        for(let i = 0 ; i<spaceStr.length; i++){
                            tempStr += " ";
                        }
                        tempStr += val;
                        topMargin +=40;
                        context.fillText(tempStr, 20, topMargin);
                    }   
                }

                
            });

            loadImage('./imgs/logo.png').then((data) => {
                context.drawImage(data, 225, 430, 150, 120);

                
                const src = canvas.toDataURL();
                console.log('src :',src);

                setMintImgSrc(src);

                resolve();
            
            })

        });
    };

    const onClickApproveBtn = ()=>{
        console.log("onClickApproveBtn called");

        setApproveModalOpen(true);
    };

    // click mint button on page (not modal)
    const onClickMintSBTBtn = async ()=>{
        console.log("onClickMintSBTBtn is called");

        const passwordValidator = new PasswordValidator();

        passwordValidator
        .is().min(8)                                    // Minimum length 8
        .is().max(100)                                  // Maximum length 100
        .has().uppercase()                              // Must have uppercase letters
        .has().lowercase()                              // Must have lowercase letters
        .has().digits(1)                                // Must have at least 2 digits
        .has().not().spaces()                           // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

        // Validate against a password string
        console.log("VALIDATIONS PASSWORD");
        console.log(passwordValidator.validate(password1,{ list: true }));

        const validationFailedReasons = passwordValidator.validate(password1,{ list: true });

        if(validationFailedReasons.length == 0 && password1 == password2){
            // The passphrase used to repeatably generate this RSA key.
            var PassPhrase = password1; 
                
            // The length of the RSA key, in bits.
            var Bits = 1024; 
  
            var MattsRSAkey = cryptico.generateRSAKey(PassPhrase, Bits);

            var MattsPublicKeyString = cryptico.publicKeyString(MattsRSAkey); 

            
            console.log("JSON.stringify(userData) : ", JSON.stringify(userData));
            console.log("JSON.stringify(checkedUserData) : ", JSON.stringify(checkedUserData));

            var encryptedUserData = cryptico.encrypt(JSON.stringify(userData), MattsPublicKeyString);

            console.log("encryptedUserData : ",encryptedUserData);

            setCryptedUserData(encryptedUserData.cipher);

            await createMintImg(checkedUserData);

            setMintModalOpen(true);

        }else if(validationFailedReasons.length > 0){
                const temp = [];
    
                for (let i = 0; i < validationFailedReasons.length; i++) {
                    switch (validationFailedReasons[i]){
                        case "min":
                            temp.push("Min lenth is 8");
                            break;
                        case "uppercase":
                            temp.push("add upper case letter");
                            break;
                        case "lowercase":
                            temp.push("add lower case letter");
                            break;
                        case "digits":
                            temp.push("add digit letter");
                            break;
                        case "spaces":
                            temp.push("space not allowed");
                            break;
                        
                    }
                } 
    
                console.dir(temp);
    
                showMsg(temp);
        
            }else if(password1 != password2){
                showMsg(["two passwords not matched"]);
            }

    };


    // when user change check mark on check box, this is called
    const handleInputChange = (event)=> {
        // console.log("handleInputChange is called");
        // console.log(event.target);
        // console.log("event.target : ");
        // console.dir(event.target);


        // console.log("handleInputChange is called");
        // console.log(event.target.previousSibling);
        // console.log("event.target.previousSibling : ");
        // console.dir(event.target.previousSibling);

        const div = event.target.parentElement;
        const checkBox = event.target.previousSibling;
        const name = checkBox.name;

        console.log("name : ",name);
        console.log("div.className : ",div.className);

        if (!div.className.includes('checked')){
            console.log("checked true ");
            console.log("checkedUserData :", checkedUserData);
            console.dir(checkedUserData); 

            console.log("userData[name] :", userData[name]);
            console.dir(userData[name]);

            const tempCheckedUserData = checkedUserData;

            tempCheckedUserData[name] = userData[name];

            setCheckedUserData(prevState =>(tempCheckedUserData));
        }else{
            console.log("checked false");
            delete checkedUserData[name];

            console.log("checkedUserData :", checkedUserData);
            console.dir(checkedUserData);

            setCheckedUserData(prevState =>({...prevState}));
        }
    }


    // make check boxes according to user data from sns oauth
    const getUserDataCheckBoxes = ()=>{
        var checkBoxes = [];
        for(let key in userData){
            checkBoxes.push(<Table.Row><Table.Cell colSpan='2'><Form.Field><Checkbox name={key} onChange = {handleInputChange} label={key.replace("_", " ").toUpperCase()+' : '+userData[key]}/></Form.Field> </Table.Cell></Table.Row>);
        }
        return checkBoxes;
    };

    const getPasswordInputs = ()=>{
        return (
            <>
                <Table.Row>
                    <Table.Cell>
                        <Input 
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password 1'
                            type="password" 
                            name="password1" 
                            value={password1} 
                            onChange={onChangePassword1}
                        />
                        
                    </Table.Cell>
                    <Table.Cell rowSpan ="2">
                        <List bulleted>
                            <List.Item>Minmum lenth 8</List.Item>
                            <List.Item>At least 1 Uppercase</List.Item>
                            <List.Item>At least 1 Lowercase</List.Item>
                            <List.Item>At least 2 Numbers</List.Item>
                        </List>
                    </Table.Cell>   
                </Table.Row>
                <Table.Row>
                    <Table.Cell>
                        <Input 
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password 2'
                            type="password" 
                            name="password2" 
                            value={password2} 
                            onChange={onChangePassword2}
                        />
                    </Table.Cell>        
                </Table.Row>
            </>
        );
    };

    

    const resetWhichSNSAndUserData = (snsName)=>{
        setWhichSNS(snsName);
        setUserData(prev => ({}));
        setCheckedUserData(prev => ({}));
        setCryptedUserData("");
    };

    const onClickKakao = ()=>{
        console.log("onClickKakao called");

        const Kakao = require("./Kakao")

        // kakao oauth init
        Kakao.init(process.env.REACT_APP_JAVASCRIPT_KEY);
        Kakao.isInitialized(); 

        Kakao.Auth.authorize({
            redirectUri: process.env.REACT_APP_REDIRECT,
        });
    };


    return (
        <>
            <Modal
                onClose={() => setApproveModalOpen(false)}
                onOpen={() => setApproveModalOpen(true)}
                open={approveModalOpen}
                
                >
                <Modal.Header>Approve</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                    <h3>
                        You approve us for handle your stellaiam soul bound tokens 
                    </h3>
                    <h3>We can handle ONLY your stellaiam soul bound token</h3>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => setApproveModalOpen(false)}>
                    No
                    </Button>
                    <Button
                    content="Yes, approve"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={async () => {
                        approveHandleSBT();
                    }}
                    positive
                    />
                </Modal.Actions>
            </Modal>




             <Modal
                onClose={() => setMintModalOpen(false)}
                onOpen={() => setMintModalOpen(true)}
                open={mintModalOpen}
                
                >
                <Modal.Header>Mint SBT</Modal.Header>
                <Modal.Content image>
                    <Image size='medium' src={mintImgSrc} wrapped />
                    <Modal.Description>
                    {/* <Header>Default Profile Image</Header> */}
                    <h3>
                        Minting SBT will cost 0.001 Matic 
                    </h3>
                    <h3>Is it okay to pay fee ?</h3>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => setMintModalOpen(false)}>
                    No
                    </Button>
                    <Button
                    content="Yes, mint SBT"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={async () => {
                        mintSBT();
                    }}
                    positive
                    />
                </Modal.Actions>
            </Modal>


            <Segment>
                <Dimmer active={isProcess}>
                    <Loader size='huge'>Processing</Loader>
                </Dimmer>
            

                
            <div className="ui centered one column grid">
                <div className="row">
                    <div className="column"><MenuComponent selectedMenu="content"/></div>
                </div>

                {msg.length >0? 
                        <>
                        <div className="row">
                            <div className="column">
                            <Message warning>
                                <Message.Header>Check your password</Message.Header>
                                {msg.map((value, index) => {
                                        return <p>{value}</p>
                                })}
                            </Message>
                            </div>
                        </div>
                        </>
                        :""
                }



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
                                <Table.HeaderCell>
                                <h1>Data</h1>
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                <h4>- choose what data you want exposed in SBT</h4>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            
                            {Object.keys(userData).length > 0 ? getUserDataCheckBoxes() :""}

                            {Object.keys(userData).length > 0 ? getPasswordInputs() :""}

                                                
                            <Table.Row>
                                <Table.Cell colSpan='2'>
                                    {/* if we have userdata and user approve contract can handle their SBT, we can see mint button */}
                                    {Object.keys(userData).length > 0 ? isApproved? <Button primary onClick={onClickMintSBTBtn}>Mint SBT</Button> : <Button primary onClick={onClickApproveBtn}>Approve</Button> :""}
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
                                    <GoogleLoginBtn isConnected={isConnected} userDataHandler ={userDataHandler} resetWhichSNSAndUserData={resetWhichSNSAndUserData}/>
                                    <Button primary disabled={!isConnected} onClick={onClickKakao}>Kakao</Button>
                                </Table.Cell>        
                            </Table.Row>
                        </Table.Header>
                </Table>


            </div>

            </Segment>

        </>
    );
};

export default MintSBTwithSNS;

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

// divide string into n length string elements
// ref) https://stackoverflow.com/a/14349616
function chunkString (str, len) {
    const size = Math.ceil(str.length/len)
    const r = Array(size)
    let offset = 0
    
    for (let i = 0; i < size; i++) {
      r[i] = str.substr(offset, len)
      offset += len
    }
    
    return r
  }