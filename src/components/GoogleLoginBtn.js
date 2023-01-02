// https://www.npmjs.com/package/@react-oauth/google
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { Table,Button,Icon,Form, TextArea, Message,Item,List,Image,Comment,Header,Modal,Segment,Dimmer,Loader } from 'semantic-ui-react';
import { Toaster ,toast } from 'react-hot-toast';
import axios from 'axios';


const GoogleLoginBtn = ({isConnected,userDataHandler,resetWhichSNSAndUserData})=>{

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);

            try{
                // get user data from google through oauth 2 api
                // ref) https://stackoverflow.com/a/67431121
                // axios docs ref) https://masteringjs.io/tutorials/axios/get-query-params
                const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    params:{'access_token': tokenResponse.access_token}
                });

                console.log("response.data :", response.data);

                var exposable_data = {};

                if(response.data.email_verified == true){
                    exposable_data = {
                        email: response.data.email,
                        lastName: response.data.family_name,
                        firstName : response.data.given_name,
                        img_url: response.data.picture
                    };
                }else{
                    exposable_data = {
                        lastName: response.data.family_name,
                        firstName : response.data.given_name,
                        img_url: response.data.picture
                    };
                }

                userDataHandler(exposable_data);
            }catch(e){
                console.log("error :", e);
            }
        },
        onError: () => {
                    
            console.log('Login Failed');
            
        }
    });



    return(
        <>
            
            {/* this is using button provided by react oauth google package  
            <GoogleLogin
                onSuccess={credentialResponse => {
                    console.log(credentialResponse);
                    console.dir(credentialResponse);
                }}
                onError={() => {
                    
                    console.log('Login Failed');
                    
                }}
            /> */}

            {/* this is using custom button for google oauth 
            ref) https://youtu.be/TqlVP_IkS28 */}
            <Button disabled={!isConnected} color='blue' onClick={()=>{
                resetWhichSNSAndUserData("Google");
                login();
            }}>Google</Button>
        </>
    ); 
        
};

export default GoogleLoginBtn;

