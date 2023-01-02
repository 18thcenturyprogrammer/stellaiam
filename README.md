# Stellaiam 

Standard for Soul bound token(SBT) is not confirmed now (Dec 2022), but there are few brief standards. 
I chose to use [ERC 4671](https://eips.ethereum.org/EIPS/eip-4671) as SBT interface and [ERC1155](https://eips.ethereum.org/EIPS/eip-1155) for NFT tokens.

This project's name is Stellaiam. Users connect their wallet and they can choose popular Oauth api (ex. Google, Kakao) which they get personal data from and they can choose which data will be in a SBT and opt out data which user wants to hide from others.

SBT will be made with data only from trustworthy big tech company, so others can believe the SBT from user. 

In addition, SBT is not transferable ,so only original owner can have the soul bount token.


Let's talk abut real life example, Bob got the wallet address of Alice, and he wants to send some eth, but before sending he wants to make sure the wallet address is really Alice's. In this case, Bob can check Alice's SBT which shows her name on it. after that, Bob can be sure and he sends tokens to right address. 

Also, this project shows what SBT user has and how contract read fuctions work.

Stellaiam smart contract address on mumbai test net : 0x423B1375cdD7041AA9d4C54D039AAA00f9C12FD5

[mumbai scan 0x423B1375cdD7041AA9d4C54D039AAA00f9C12FD5](https://mumbai.polygonscan.com/address/0x423b1375cdd7041aa9d4c54d039aaa00f9c12fd5)

#### Tech stack
- UI : react, react semantic UI
- Smart contract : solidity
- Deploy network : mumbai
- Text editor : vbcode, remix

#### Minting SBT process
1. User click OAUTH button (frontend) -> 
2. OAUTH process (3rd party)-> 
3. User finished OAUTH process successfully -> 
4. User select data which will be exposed ->
5. Save SBT data into pinata ->
6. Write Pinata Uri , crypted data (all), expose data in smart contract 

#### References 

##### Ethereum improvement proposals

[EIP 4671 soul bound token](https://eips.ethereum.org/EIPS/eip-4671)

EIP 4973 account bound token 

[EIP 5114 soul bound badge](https://eips.ethereum.org/EIPS/eip-5114)

[EIP 5192 minimal soul bound token](https://eips.ethereum.org/EIPS/eip-5192)

[EIP 5484 consesual soul bound token](https://eips.ethereum.org/EIPS/eip-5484)

[EIP 5727 semi funsible soul bound token](https://eips.ethereum.org/EIPS/eip-5727)

##### 3rd libraries

[React component for google oauth](https://www.npmjs.com/package/react-google-login)

[Npm package for googl api client](https://www.npmjs.com/package/gapi-script)

[Jwt decode (after user logged in we get credential. We can decode to get user data)](https://www.npmjs.com/package/jwt-decode)

[React toast](https://react-hot-toast.com/docs)

[React router dom](https://www.npmjs.com/package/react-router-dom)

[RSA key(this is based on cryptico)](https://www.npmjs.com/package/@daotl/cryptico)

[RSA key(I couldn’t use this because I couldn’t find crypto library with this)](https://www.npmjs.com/package/cryptico)

[Password validator](https://www.npmjs.com/package/password-validator)

[Dot env](https://www.npmjs.com/package/dotenv)

[Query string](https://www.npmjs.com/package/query-string)



***
# Screen shots
### connecting metamask wallet
![sc1](http://jacob-yo.net/wp-content/uploads/2023/01/sc1.png)

---
<br/><br/>
<br/><br/>
<br/><br/>

### connecting Google Oauth
![sc2](http://jacob-yo.net/wp-content/uploads/2023/01/sc2.png)

---
<br/><br/>
<br/><br/>
<br/><br/>

### retrieved data from Google
![sc3](http://jacob-yo.net/wp-content/uploads/2023/01/sc3.png)

---
<br/><br/>
<br/><br/>
<br/><br/>

### user select data which will be exposed in Soul bound token
![sc4](http://jacob-yo.net/wp-content/uploads/2023/01/sc4.png)

---
<br/><br/>
<br/><br/>
<br/><br/>

### minting Soul bound token
![sc5](http://jacob-yo.net/wp-content/uploads/2023/01/sc5.png)

---
<br/><br/>
<br/><br/>
<br/><br/>

### paying fee and send transaction to smart contract
![sc6](http://jacob-yo.net/wp-content/uploads/2023/01/sc6.png)

---
<br/><br/>
<br/><br/>
<br/><br/>

### showing user's tokens
![sc7](http://jacob-yo.net/wp-content/uploads/2023/01/sc7.png)

---
<br/><br/>
<br/><br/>
<br/><br/>

### opensea showing minted Soul bound token
![sc8](http://jacob-yo.net/wp-content/uploads/2023/01/sc8.png)

---
<br/><br/>
<br/><br/>
<br/><br/>

### we can check user's exposed data in opensea
![sc9](http://jacob-yo.net/wp-content/uploads/2023/01/sc9.png)

---
<br/><br/>
<br/><br/>
<br/><br/>

### showing smart contract implemented ERC 4671 
![sc10](http://jacob-yo.net/wp-content/uploads/2023/01/sc10.png)

![sc11](http://jacob-yo.net/wp-content/uploads/2023/01/sc11.png)

