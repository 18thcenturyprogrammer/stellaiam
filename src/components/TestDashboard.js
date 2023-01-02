import Web3 from "web3";

import React, { Component,useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Table,Button,Icon,Form,Label, TextArea, Message,Item,List,Image,Comment,Header,Modal,Segment,Dimmer,Loader, Checkbox, Input } from 'semantic-ui-react';
import { Toaster ,toast } from 'react-hot-toast';
import PasswordValidator from "password-validator";


import MenuComponent from './MenuComponent';
import ConnectButton from './ConnectButton';
import WalletBalances from './WalletBalances';

const TestDashboard = ()=>{
    require('dotenv').config();

    const [isProcess,setIsProcess] = useState(false);

    const [txt1,setTxt1] = useState("");
    const [txt2,setTxt2] = useState("");
    const [txt3,setTxt3] = useState("");
    const [txt4,setTxt4] = useState("");
    const [txt5,setTxt5] = useState("");
    const [txt6,setTxt6] = useState("");

    const [result1,setResult1] = useState("");
    const [result2,setResult2] = useState("");
    const [result3,setResult3] = useState("");
    const [result4,setResult4] = useState("");
    const [result5,setResult5] = useState("");
    const [result6,setResult6] = useState("");

    const [institution1,setInstitution1] = useState(0);
    const [institution2,setInstitution2] = useState(0);

    const { ethers, BigNumber } = require("ethers");

    const abi = process.env.REACT_APP_ABI;
    const stellaiamContractAddress = process.env.REACT_APP_STELLAIAM_CONTRACT_ADDRESS;
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_ALCHEMY_MUMBAI_HTTPS);
    const stellaiamNftContract = new ethers.Contract(stellaiamContractAddress,abi,provider);


    const web3 = new Web3(process.env.REACT_APP_ALCHEMY_MUMBAI_HTTPS);
    const abi_web3 = JSON.parse(abi)
    const stellaiamNftContract_web3 = new web3.eth.Contract(abi_web3, stellaiamContractAddress);


    useEffect(()=>{

    },[]);
    
    

    const instantMsg = (msg, type)=>{

        switch (type){
            case "normal":
                toast.success(msg);
            
                break;
            case "warning":
                toast.error(msg);
        }
    };


    const timestampToTimeStr = (timestamp)=>{
        
        // convert unix timestamp to milliseconds
        var ts_ms = timestamp * 1000;

        // initialize new Date object
        var date_ob = new Date(ts_ms);

        // year as 4 digits (YYYY)
        var year = date_ob.getFullYear();

        // month as 2 digits (MM)
        var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

        // date as 2 digits (DD)
        var date = ("0" + date_ob.getDate()).slice(-2);

        // hours as 2 digits (hh)
        var hours = ("0" + date_ob.getHours()).slice(-2);

        // minutes as 2 digits (mm)
        var minutes = ("0" + date_ob.getMinutes()).slice(-2);

        // seconds as 2 digits (ss)
        var seconds = ("0" + date_ob.getSeconds()).slice(-2);

        return year + "-" + month + "-" + date + " " + hours + ":" + minutes;
    };







    
    const onClickGetSBTData = async ()=>{
        console.log("onClickGetSBTData called");

        setIsProcess(true);

        try {
            if(ethers.utils.isAddress(txt1)){
                var institutionName;
                switch (institution1){
                    case 0:
                        console.log('option Google');
                        institutionName = "Google";
                        break;
                    case 1:
                        console.log('option Kakao');
                        institutionName = "Kakao";
                        break;
                }

                const result = await stellaiamNftContract.getSBTbyAddressInstitutionName(txt1, institutionName);

                console.log("result : ", result);
                console.dir(result);

                var resultStr =[];
                resultStr.push(<p>Wallet address:  {result[0]}</p>);
                resultStr.push(<p>Crypted data: {smartTrim(result[1], 60)}</p>);
                resultStr.push(<p>Exposed data: {smartTrim(result[2], 100)}</p>);
                resultStr.push(<p>Institution name: {result[3]}</p>);
                resultStr.push(<p>Created at: {timestampToTimeStr(result[4])}</p>);
            
                setResult1(resultStr);
                                
            }else{
                throw new Error('Not valid address');
            }
            

        } catch (error) {
            
            console.dir(error);

            instantMsg(error.message,"warning");
        }

        setIsProcess(false);

    };



    const onClickGetTokenId = async ()=>{
        console.log("onClickGetTokenId called");

        setIsProcess(true);

        try {
            if(ethers.utils.isAddress(txt2)){
                var institutionName2;
                switch (institution2){
                    case 0:
                        console.log('option Google');
                        institutionName2 = "Google";
                        break;
                    case 1:
                        console.log('option Kakao');
                        institutionName2 = "Kakao";
                        break;
                }

                const result = await stellaiamNftContract.SBTcollectionByUser(txt2, institutionName2);

                console.log("result : ", result);
                console.dir(result);

                var resultStr =[];
                resultStr.push(<p>Token Id:  {ethers.utils.formatEther( result )* (10 ** 18)}</p>);
            
                setResult2(resultStr);
                                
            }else{
                throw new Error('Not valid address');
            }
            

        } catch (error) {
            
            console.dir(error);

            instantMsg(error.message,"warning");
        }

        setIsProcess(false);

    };


    const onClickGetBalance = async ()=>{
        console.log("onClickGetBalance called");

        setIsProcess(true);

        try {
            if(ethers.utils.isAddress(txt3)){
                
                // const result = await stellaiamNftContract.balanceOf(txt3);
                const result = await stellaiamNftContract_web3.methods.balanceOf(txt3).call()

                console.log("result : ", result);
                console.dir(result);

                var resultStr =[];
                resultStr.push(<p>Balance:  {result}</p>);
            
                setResult3(resultStr);
                                
            }else{
                throw new Error('Not valid address');
            }
            

        } catch (error) {
            
            console.dir(error);

            instantMsg(error.message,"warning");
        }

        setIsProcess(false);

    };


    const onClickGetOwner = async ()=>{
        console.log("onClickGetOwner called");

        setIsProcess(true);

        try {
            if(Number.isInteger(parseInt(txt4))){
                
                // const result = await stellaiamNftContract.balanceOf(txt3);
                const result = await stellaiamNftContract_web3.methods.ownerOf(txt4).call();

                console.log("result : ", result);
                console.dir(result);

                var resultStr =[];
                resultStr.push(<p>Owner:  {result}</p>);
            
                setResult4(resultStr);
                                
            }else{
                throw new Error('Not integer number');
            }
            

        } catch (error) {
            
            console.dir(error);

            instantMsg(error.message,"warning");
        }

        setIsProcess(false);

    };


    const onClickIsValid = async ()=>{
        console.log("onClickIsValid called");

        setIsProcess(true);

        try {
            if(Number.isInteger(parseInt(txt5))){
                
                // const result = await stellaiamNftContract.balanceOf(txt3);
                const result = await stellaiamNftContract_web3.methods.isValid(parseInt(txt5)).call();

                console.log("result : ", result);
                console.dir(result);

                var resultStr =[];
                resultStr.push(<p>Is Valid:  {result.toString()}</p>);
            
                setResult5(resultStr);
                                
            }else{
                throw new Error('Not integer number');
            }
            

        } catch (error) {
            
            console.dir(error);

            instantMsg(error.message,"warning");
        }

        setIsProcess(false);

    };


    const onClickHasValid = async ()=>{
        console.log("onClickHasValid called");

        setIsProcess(true);

        try {
            if(ethers.utils.isAddress(txt6)){
                

                const result = await stellaiamNftContract.hasValid(txt6);

                console.log("result : ", result);
                console.dir(result);

                var resultStr =[];
                resultStr.push(<p>Has valid:  {result.toString()}</p>);
            
                setResult6(resultStr);
                                
            }else{
                throw new Error('Not valid address');
            }
            

        } catch (error) {
            
            console.dir(error);

            instantMsg(error.message,"warning");
        }

        setIsProcess(false);

    };




    



    // user typed in password1 input
    const onChangeTxt1 = (event) => {
        console.log("txt changed");
        const name = event.target.name;
        const value = event.target.value;
        setTxt1(value);
    };

    // user typed in password1 input
    const onChangeTxt2 = (event) => {
        console.log("txt2 changed");
        const name = event.target.name;
        const value = event.target.value;
        setTxt2(value);
    };

    // user typed in password1 input
    const onChangeTxt3 = (event) => {
        console.log("txt3 changed");
        const name = event.target.name;
        const value = event.target.value;
        setTxt3(value);
    };

    // user typed in password1 input
    const onChangeTxt4 = (event) => {
        console.log("txt4 changed");
        const name = event.target.name;
        const value = event.target.value;
        setTxt4(value);
    };

    // user typed in password1 input
    const onChangeTxt5 = (event) => {
        console.log("txt5 changed");
        const name = event.target.name;
        const value = event.target.value;
        setTxt5(value);
    };

    // user typed in password1 input
    const onChangeTxt6 = (event) => {
        console.log("txt6 changed");
        const name = event.target.name;
        const value = event.target.value;
        setTxt6(value);
    };

    return (
        <>

            <Segment>
                <Dimmer active={isProcess}>
                    <Loader size='huge'>Processing</Loader>
                </Dimmer>
            

                
            <div className="ui centered one column grid">
                <div className="row">
                    <div className="column"><MenuComponent selectedMenu="content"/></div>
                </div>

                <div className="column row">
                    <div className="column">


                    <Toaster/>

                    <Form>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>
                                    <h2></h2>
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <h2>Institution</h2>
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                    <h2>Result</h2>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            
                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                    <h5>Getting soul bound token data by address and institution name</h5>
                                </Table.Cell>
                            </Table.Row>
                                                    
                            <Table.Row>
                                <Table.Cell>
                                    <div className="ui input focus">
                                        <input onChange={onChangeTxt1} type={txt1} placeholder="Address..." />
                                    </div>
                                </Table.Cell>        
                            
                                <Table.Cell>
                                    <select onChange={event => setInstitution1(event.target.options.selectedIndex)} className="ui dropdown">
                                        <option value="">Google</option>
                                        <option value="1">Kakao</option>
                                    </select>
                                </Table.Cell>        
                                    
                                <Table.Cell>
                                    <Button primary onClick={onClickGetSBTData}>Get SBT data</Button>
                                </Table.Cell>        
                            
                                <Table.Cell>
                                    {result1}
                                </Table.Cell>        
                            </Table.Row>



{/* ==================================================================================================================== */}

                            
                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                    <h5>Getting token id by address and institution name</h5>
                                </Table.Cell>
                            </Table.Row>
                                                    
                            <Table.Row>
                                <Table.Cell>
                                    <div className="ui input focus">
                                        <input onChange={onChangeTxt2} type={txt2} placeholder="Address..." />
                                    </div>
                                </Table.Cell>        
                            
                                <Table.Cell>
                                    <select onChange={event => setInstitution2(event.target.options.selectedIndex)} className="ui dropdown">
                                        <option value="">Google</option>
                                        <option value="1">Kakao</option>
                                    </select>
                                </Table.Cell>        
                                    
                                <Table.Cell>
                                    <Button primary onClick={onClickGetTokenId}>Get token id</Button>
                                </Table.Cell>        
                            
                                <Table.Cell>
                                    {result2}
                                </Table.Cell>        
                            </Table.Row>

{/* ==================================================================================================================== */}


                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                    <h3>ERC4671 interface test</h3>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                    <h5>Balance of user</h5>
                                </Table.Cell>
                            </Table.Row>
                                                    
                            <Table.Row>
                                <Table.Cell>
                                    <div className="ui input focus">
                                        <input onChange={onChangeTxt3} type={txt3} placeholder="Address..." />
                                    </div>
                                </Table.Cell>        
                            
                                <Table.Cell>
                                </Table.Cell>        
                                    
                                <Table.Cell>
                                    <Button primary onClick={onClickGetBalance}>Get balance</Button>
                                </Table.Cell>        
                            
                                <Table.Cell>
                                    {result3}
                                </Table.Cell>        
                            </Table.Row>


{/* ==================================================================================================================== */}


                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                    <h5>Owner of token</h5>
                                </Table.Cell>
                            </Table.Row>
                                                    
                            <Table.Row>
                                <Table.Cell>
                                    <div className="ui input focus">
                                        <input onChange={onChangeTxt4} type={txt4} placeholder="Token Id..." />
                                    </div>
                                </Table.Cell>        
                            
                                <Table.Cell>
                                </Table.Cell>        
                                    
                                <Table.Cell>
                                    <Button primary onClick={onClickGetOwner}>Get Owner</Button>
                                </Table.Cell>        
                            
                                <Table.Cell>
                                    {result4}
                                </Table.Cell>        
                            </Table.Row>


{/* ==================================================================================================================== */}


                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                    <h5>Is valid</h5>
                                </Table.Cell>
                            </Table.Row>
                                                    
                            <Table.Row>
                                <Table.Cell>
                                    <div className="ui input focus">
                                        <input onChange={onChangeTxt5} type={txt5} placeholder="Token Id..." />
                                    </div>
                                </Table.Cell>        
                            
                                <Table.Cell>
                                </Table.Cell>        
                                    
                                <Table.Cell>
                                    <Button primary onClick={onClickIsValid}>Check is vaild</Button>
                                </Table.Cell>        
                            
                                <Table.Cell>
                                    {result5}
                                </Table.Cell>        
                            </Table.Row>



{/* ==================================================================================================================== */}


                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                    <h5>Has valid</h5>
                                </Table.Cell>
                            </Table.Row>
                                                    
                            <Table.Row>
                                <Table.Cell>
                                    <div className="ui input focus">
                                        <input onChange={onChangeTxt6} type={txt6} placeholder="Address..." />
                                    </div>
                                </Table.Cell>        
                            
                                <Table.Cell>
                                </Table.Cell>        
                                    
                                <Table.Cell>
                                    <Button primary onClick={onClickHasValid}>Check has vaild</Button>
                                </Table.Cell>        
                            
                                <Table.Cell>
                                    {result6}
                                </Table.Cell>        
                            </Table.Row>





                            

                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell colSpan='4'>
                                </Table.Cell>
                            </Table.Row>


                            
                        </Table.Body>
            
                        <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan='4'></Table.HeaderCell>

                        </Table.Row>
                        </Table.Footer>
                    </Table>
                    </Form>
                    
                    </div>

                </div>

            </div>

            </Segment>

        </>
    );
};

export default TestDashboard;


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

