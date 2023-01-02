// this file is for testing kakao oauth. requesting for authorization code is done in TestKakaoOauth.js
// in this file, i can receive authorization code and i can ask for access token through REST api and 
// i can get user data with access token through REST api 

// oauth process javascript doc ref) https://developers.kakao.com/docs/latest/en/kakaologin/js
// get access token doc ref) https://developers.kakao.com/docs/latest/en/kakaologin/rest-api#request-token

import Axios from "axios";
import queryString from 'query-string';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "semantic-ui-react";




const TestKakaoOauth2 = ()=>{
    console.log('TestKakaoOauth2');
    require('dotenv').config();

    const navigate = useNavigate();
    const [redirect, setRedirect] = useState(false);
    const [userData, setUserData] = useState({})

    useEffect(()=>{
        // kakao oauth init
        Kakao.init(process.env.REACT_APP_JAVASCRIPT_KEY);
        Kakao.isInitialized();

        console.log('Kakao.Auth :');
        console.dir(Kakao.Auth);

        
    },[]);

    useEffect(()=>{
        if (redirect){
            console.log("redirecting");
            console.log("userData : ",userData);

            navigate("/mint_sbt_with_sns",{state:userData});
        }
        
    },[redirect]);

    const Kakao = require("./Kakao")

    

    

    const getQueryParams = (query = null) => {
        return (
          (query || window.location.search.replace("?", ""))
      
            // get array of KeyValue pairs
            .split("&") 
      
            // Decode values
            .map((pair) => {
              let [key, val] = pair.split("=");
      
              return [key, decodeURIComponent(val || "")];
            })
      
            // array to object
            .reduce((result, [key, val]) => {
              result[key] = val;
              return result;
            }, {})
        );
    };

    const getAccessToken = async (authorization_code)=>{
        // x-www-form-urlencoded post axios
        // ref) https://stackoverflow.com/a/67087324
        const data = new URLSearchParams({
            "grant_type": 'authorization_code',
            'client_secret':process.env.REACT_APP_CLIENT_SECRET,
            "client_id": process.env.REACT_APP_REST_API_KEY,
            "redirect_uri": process.env.REACT_APP_REDIRECT,
            "code":authorization_code
        });

        console.log("data: ",data);
        console.dir(data);


        try{
            
            const res = await Axios.post("https://kauth.kakao.com/oauth/token",data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });
            console.log("access token from kakao : ",res.data.access_token);

            Kakao.Auth.setAccessToken(res.data.access_token);

            Kakao.API.request({
                url: '/v2/user/me',
            })
                .then(function(response) {
                    console.log(response.properties);
                   
                    setUserData(response.properties);

                    setRedirect(true);
                })
                .catch(function(error) {
                console.log(error);
                });

            return res.access_token;
            
        } catch (error) {
            console.log("error while  ",error);

            return null;
        }



        
    };

    const onClickLogout = ()=>{
        Kakao.Auth.logout()
        .then(function(response) {
            console.log(Kakao.Auth.getAccessToken()); // null
        })
        .catch(function(error) {
            console.log('Not logged in.');
        });
    };

    const onClickNavigate = ()=>{
        console.log('onClickNavigate called');
        setRedirect(true);
    };

    
    const queryParams = getQueryParams();

    console.log(queryParams.code)//123

    getAccessToken(queryParams.code);


    return (
        <>
    
            <h1>Kakao oauth test page2</h1>
            <Button onClick={onClickLogout}>Logout</Button>
            <Button onClick={onClickNavigate}>Navigate</Button>
      
            
        </>
    );
};

export default TestKakaoOauth2;