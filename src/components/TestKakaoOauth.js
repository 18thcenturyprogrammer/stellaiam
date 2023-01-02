// this file is for testing kakao oauth 
// in this file, i can ask for authorization code and it will be returned into TestKakaoOauth2.js 

// oauth process javascript doc ref) https://developers.kakao.com/docs/latest/en/kakaologin/js

import { Button } from "semantic-ui-react";

const TestKakaoOauth = ()=>{
    console.log("TestKakaoOauth");

    require('dotenv').config();
    const Kakao = require("./Kakao")

    // kakao oauth init
    Kakao.init(process.env.REACT_APP_JAVASCRIPT_KEY);
    Kakao.isInitialized();  

    const onClickKakao = ()=>{
        Kakao.Auth.authorize({
            redirectUri: process.env.REACT_APP_REDIRECT,
        });
    };


    return (
        <>
            <h1>Kakao oauth test page</h1>
            <Button primary onClick={onClickKakao}>Kakao</Button>
        </>
    );
};

export default TestKakaoOauth;