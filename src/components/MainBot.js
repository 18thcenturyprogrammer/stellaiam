const MainBot = ()=>{


    require('dotenv').config();
    console.log(process.env);

    const { ethers, BigNumber } = require("ethers");

        // const contractAddress = process.env.STELLAIAM_CONTRACT_ADDRESS;
        const contractAddress = "0xB46e826F51718dC013A2872900dBa64e71e198F2";

        console.log("contractAddress :",contractAddress);

        const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Minted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Revoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"indexed":false,"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"TransferBatch","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"TransferSingle","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"value","type":"string"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"URI","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_whose","type":"address"},{"indexed":false,"internalType":"string","name":"_cryptedData","type":"string"},{"indexed":true,"internalType":"string","name":"_exposedData","type":"string"},{"indexed":true,"internalType":"string","name":"_instituionName","type":"string"},{"indexed":false,"internalType":"uint256","name":"_at","type":"uint256"}],"name":"groundSBTminted","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"}],"name":"SBTcollectionByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"values","type":"uint256[]"}],"name":"burnBatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"exists","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"hasValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"isValid","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"mintBatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"string","name":"_cryptedData","type":"string"},{"internalType":"string","name":"_exposedData","type":"string"},{"internalType":"string","name":"_institutionName","type":"string"}],"name":"mintByOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"mintFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_cryptedData","type":"string"},{"internalType":"string","name":"_exposedData","type":"string"},{"internalType":"string","name":"_institutionName","type":"string"}],"name":"mintGroundSBT","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"revokeToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeBatchTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newFee","type":"uint256"}],"name":"setMintFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"string","name":"_uri","type":"string"}],"name":"setOneUri","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newuri","type":"string"}],"name":"setURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"uri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"uris","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}];    

        // const providerUrl = process.env.ALCHEMY_MUMBAI_WEB_SOCKET;
        const providerUrl = "wss://polygon-mumbai.g.alchemy.com/v2/Uud_P7gk4UKBPIgcNN2nV3jsEbhn1R5Z";

        const provider = new ethers.providers.WebSocketProvider(providerUrl);
        const stellaiamNftContract = new ethers.Contract(contractAddress,abi,provider);

    try {
        stellaiamNftContract.on("groundSBTminted", async (whose, exposedData, institutionName, data) => {
            // user minted groundSBT , now we make stellaSBT

            console.log("groundSBTminted event received");
            
            // const params ={
            //     account:address,
            //     id:selectedContentId,
            //     amount:1
            // };
        

            // const wallet = new ethers.Wallet(process.env.PRIV_KEY);
            const wallet = new ethers.Wallet("ac955c2884b4138de7b095d867295f4bb40a78415bf7c0f52dbc4b97330b9568");

            const connectedWallet = wallet.connect(provider);

            
            console.log("1");

            const gasData = await provider.getFeeData();

            // 'replacement fee too low' error kept being raised, so i had to jack up the gas

            // if i follow eip 1559, i can't override gasprice option
            // maxFeePerGas must be higher than maxPriorityFeePerGas
            const mulMaxFeePerGas = gasData.maxFeePerGas.mul(BigNumber.from(50));
            const mulMaxPriorityFeePerGas = gasData.maxPriorityFeePerGas.mul(BigNumber.from(40));
            
            // const walletaAddress = process.env.WALLET_ADDRESS;
            const walletaAddress = "0x40cf69eee51f7d08a5a5beca394f245bec7e6bee";

            // normal gasLimit is 21000 , but not worked ,so i changed it to this
            const options = {
                value: 0,
                gasLimit:ethers.utils.hexlify(1000000),
                maxFeePerGas:mulMaxFeePerGas,
                maxPriorityFeePerGas:mulMaxPriorityFeePerGas,
                nonce: await provider.getTransactionCount(walletaAddress)
            };

            console.log("2");
            
            // send transaction with value
            // ref) https://vsupalov.com/ethers-call-payable-solidity-function/
            const result = await stellaiamNftContract.connect(connectedWallet).mintByOwner(whose,1,"cryptedData",exposedData,institutionName, options);
            
            console.log("3");

            const txReceipt = await result.wait();

            console.log("txReceipt : ", txReceipt);
            console.dir(txReceipt);

            if(txReceipt.blockNumber){
                console.log("stellaiam SBT minted");
            }
            
        });
        
    } catch (error) {
        console.log("error raised");
        console.dir(error);
    }





    return (
        <>
            <h3>Main Bot</h3>
        </>
    );
};

export default MainBot;