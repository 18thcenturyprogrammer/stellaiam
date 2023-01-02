

async function main(){
    attachGroundSBTmintEventListener();

    while(true){
        const oneSecond = 1000;
        const oneMinuate = 60;
        const oneHour = 60;
        await sleep(oneSecond*oneMinuate*10);
        console.log("now :",Date.now());
        attachGroundSBTmintEventListener();
    };
}

const attachGroundSBTmintEventListener = ()=>{
    require('dotenv').config();
    // console.log(process.env);

    const { ethers, BigNumber } = require("ethers");

    const contractAddress = process.env.STELLAIAM_CONTRACT_ADDRESS;

    console.log("contractAddress :",contractAddress);

    const abi = process.env.ABI;    

    const providerUrl = process.env.ALCHEMY_MUMBAI_WEB_SOCKET;

    const provider = new ethers.providers.WebSocketProvider(providerUrl);
    const stellaiamNftContract = new ethers.Contract(contractAddress,abi,provider);

    try {
        // getting data from event 
        // parameters are same as emit signature
        stellaiamNftContract.on("groundSBTminted", async (whose, cryptedData, exposedData, institutionName, instituionNameLabel, at, additionalData) => {
            // user minted groundSBT , now we make stellaSBT
            
            // unindexed data will be shown as same as passed
            // long indexed data will be hashed 
            // short indexed data will be show as same as passed

            console.log("whose :", whose);
            console.log("cryptedData :", cryptedData);
            console.log("exposedData :", exposedData);
            console.log("institutionName :", institutionName);
            console.log("instituionNameLabel :", instituionNameLabel);
            console.log("at :", at);



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// this is about getting unindexed data from event             
            // additional data is in JSON format, and 'data' has unindexed data in hex  
            // console.log("additionalData :", additionalData);

            // getting data from event 
            // https://ethereum.stackexchange.com/a/87656
            // https://web3js.readthedocs.io/en/v1.2.11/web3-eth-abi.html#decodeparameters


            // const Web3 = require('web3');
            // const web3 = new Web3();

            // // const typesArray = [
            // //     {type: 'address', name: '_whose'}, 
            // //     {type: 'string', name: '_cryptedData'},
            // //     {type: 'string', name: '_exposedData'},
            // //     {type: 'string', name: '_instituionName'},
            // //     {type: 'uint256', name: '_at'}
            // // ];

            // const typesArray = [
            //     'string', 'string'
            // ];

            // const data = additionalData.data;

            // const decodedParameters = web3.eth.abi.decodeParameters(typesArray, data);

            // console.log(JSON.stringify(decodedParameters, null, 4));
            
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





           
            
            // const cleanedExposedDate = JSON.stringify(exposedData); 
            // const jsonExposedData = JSON.parse(cleanedExposedDate);

            const jsonExposedData = JSON.parse(exposedData);

            

            await createMintImg(whose, jsonExposedData, instituionNameLabel);

            const imgCid = await pinImg(whose,instituionNameLabel);

            if (imgCid == null){
                // there is a problem while we upload image to pinata ipfs 
                return null;
            }else{
                const metaDataCid = await pinMetaData(imgCid,whose,jsonExposedData,instituionNameLabel);

                if(metaDataCid == null){
                    // there is a problem while we upload metadata to pinata ipfs 
                    return null;
                }else{
                    const uri = "https://gateway.pinata.cloud/ipfs/"+metaDataCid;
                    mintStellaSBT(whose, cryptedData, exposedData, instituionNameLabel, uri);
                }
            }

        });
        
    } catch (error) {
        console.log("error raised");
        console.dir(error);
    }
};


function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
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

// create image with canvas 
// ref) https://stackoverflow.com/a/71093607
// canvas official doc ref) https://www.npmjs.com/package/canvas#canvascreatepngstream
const createMintImg = (whose, exposedData, institutionNameLabel)=>{
    return new Promise((resolve, reject) => {
        const fs = require('fs')
        const { loadImage, createCanvas } = require('canvas');
        const width = 600;
        const height = 600;
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');
        context.fillStyle = '#6936F5';
        context.fillRect(0, 0, width, height);

        context.globalAlpha = 0.2;
        context.font = 'bold 70pt Menlo';
        context.textBaseline = 'top';
        // context.textAlign = 'center';
        context.fillStyle = '#ffffff';

        context.fillText(institutionNameLabel, 10, 275);

        context.globalAlpha = 1;

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

        context.font = 'bold 10pt Menlo';
        context.textBaseline = 'top';
        context.fillStyle = '#ffffff';

        context.fillText("Owner Address : "+whose, 10, 425);





        loadImage('../public/imgs/logo.png').then((data) => {

            const filePath = `../public/imgs/users/${whose}.png`;
            context.drawImage(data, 200, 445, 200, 150);

            const imgBuffer = canvas.toBuffer('image/png');
            fs.writeFileSync(filePath, imgBuffer);

            resolve(filePath);
        
        })

    });
};

// pin image to pinata 
// pinata docs ref) https://docs.pinata.cloud/pinata-api/pinning/pin-file-or-directory
const pinImg = async (whose, institutionName)=>{
    const axios = require('axios')
    const FormData = require('form-data')
    const fs = require('fs')

    const formData = new FormData();
    const src = `../public/imgs/users/${whose}.png`;
    
    const file = fs.createReadStream(src)
    formData.append('file', file)

    const metadata = JSON.stringify({
        name: whose+"_"+institutionName,
        keyValues: {
            ownerAddress: whose,
            institutionName : institutionName, 
            imgIpfsCreated : Date.now()
        }
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    })
    formData.append('pinataOptions', options);




    // const headers = {
    //     'Authorization': 'Bearer '+process.env.PINATA_JWT_TOKEN,
    // };





    try{
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          maxBodyLength: "Infinity",
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            'Authorization': 'Bearer '+process.env.PINATA_JWT_TOKEN
          }
        });
        console.log("pinata img pin res.data = ",res.data);

        return res.data.IpfsHash;
        
    } catch (error) {
        console.log("error while pinata = ",error);

        return null;
    }


};

const pinMetaData = async (imgCid, whose, exposedData, institutionName)=>{
    var axios = require('axios');

    // const partAddress = whose.substring(whose.length-4,whose.length); 
    const partAddress = smartTrim(whose,8);

    var sbtData ="Soul bount token data\n";
    Object.entries(exposedData).forEach(([k,v])=>{
        sbtData += k;
        sbtData += " : ";
        sbtData += v+"\n";
    });

    var data = JSON.stringify({
    "pinataOptions": {
        "cidVersion": 1
    },
    "pinataMetadata": {
        name: whose+"_"+institutionName,
        keyValues: {
            ownerAddress: whose,
            institutionName : institutionName, 
            imgIpfsCreated : Date.now()
        }
    },
    "pinataContent": {
        "image": "https://gateway.pinata.cloud/ipfs/"+imgCid,
        "name": partAddress +` stellaiam SBT (${institutionName})`,
        "description": `This is SBT soul bount token which is issued by Stellaiam. \n User data is get from ${institutionName} Oauth.\n ${sbtData}`
    }
    });

    var config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${process.env.PINATA_JWT_TOKEN}`
    },
    data : data
    };

    try{
        const res = await axios(config);

        console.log("pinata json pin res.data = ",res.data);

        return res.data.IpfsHash
    } catch (error) {
        console.log("error while pinata = ",error);
        return null;
    }
};

const mintStellaSBT = async (whose, cryptedData, exposedData, institutionName, uri)=>{
    
    console.log("mintStellaSBT is called");

    try {
        const { ethers, BigNumber } = require("ethers");

        const abi = process.env.ABI;
        const stellaiamContractAddress = process.env.STELLAIAM_CONTRACT_ADDRESS;

        const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_MUMBAI_HTTP);
        
        const stellaiamNftContract = new ethers.Contract(stellaiamContractAddress,abi,provider);

        const wallet = new ethers.Wallet(process.env.PRIV_KEY);
        
        const connectedWallet = wallet.connect(provider);

        
        const gasData = await provider.getFeeData();

        // 'replacement fee too low' error kept being raised, so i had to jack up the gas

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
            nonce: await provider.getTransactionCount(process.env.WALLET_ADDRESS)
        };
        
        // send transaction with value
        // ref) https://vsupalov.com/ethers-call-payable-solidity-function/
        const result = await stellaiamNftContract.connect(connectedWallet).mintByOwner(whose,1,cryptedData,exposedData,institutionName,uri, options);
        
        const txReceipt = await result.wait();

        console.log("txReceipt : ", txReceipt);
        console.dir(txReceipt);

        if(txReceipt.blockNumber){
            console.log("stella SBT minted all right");
        }


    } catch (error) {
        console.log("failed to mint stella SBT :", error);
        console.dir(error);
    }
};


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


main();
