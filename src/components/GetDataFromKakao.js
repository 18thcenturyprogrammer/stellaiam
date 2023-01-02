import Axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button,Segment, Dimmer, Loader } from "semantic-ui-react";




const GetDataFromKakao = ()=>{
    console.log("GetDataFromKakao");
    require('dotenv').config();

    const navigate = useNavigate();
    const [redirect, setRedirect] = useState(false);
    const [userData, setUserData] = useState({});

    const [isProcess,setIsProcess] = useState(true);

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

    const Kakao = require("./Kakao");

    // get access token from kakao 
    // kakao doc ref) https://developers.kakao.com/docs/latest/en/kakaologin/rest-api#request-token
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

            // set access token into Kakao javascript SDK
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

        } catch (error) {
            console.log("error while  ",error);
        }

    };




    useEffect(()=>{
        
        // kakao oauth init
        // kakao oauth doc ref) https://developers.kakao.com/docs/latest/en/kakaologin/js
        // ref) https://developers.kakao.com/docs/latest/en/kakaologin/js#logout
        Kakao.init(process.env.REACT_APP_JAVASCRIPT_KEY);
        Kakao.isInitialized();

        // console.log('Kakao.Auth :');
        // console.dir(Kakao.Auth);

        // authorization code coming from kakao in query string format
        const queryParams = getQueryParams();

        const authorization_code = queryParams.code;

        console.log("kakao authorization_code", authorization_code)

        getAccessToken(authorization_code);

        
    },[]);

    useEffect(()=>{
        if (redirect){
            console.log("redirecting");
            console.log("userData : ",userData);

            navigate("/mint_sbt_with_sns",{state:userData});
        }
        
    },[redirect]);

   

    
    

    return (
        <>
            <Segment>
                <Dimmer active={isProcess}>
                    <Loader size='huge'>Processing</Loader>
                </Dimmer>
            <h1>....... </h1>
            <h1>....... </h1>
            <h1>....... </h1>
            <h1>Getting user data from Kakao </h1>
            <h1>Getting user data from Kakao </h1>
            <h1>Getting user data from Kakao </h1>
            <h1>Getting user data from Kakao </h1>
            <h1>Getting user data from Kakao </h1>
            <h1>....... </h1>
            <h1>....... </h1>
            <h1>....... </h1>
            
            </Segment>
            
        </>
    );
};

export default GetDataFromKakao;