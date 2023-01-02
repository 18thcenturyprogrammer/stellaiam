import logo from './logo.svg';
import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

import 'semantic-ui-css/semantic.min.css'

import {BrowserRouter as Router, Routes, Route, Link, Redirect} from "react-router-dom";
import { Container } from 'semantic-ui-react';

import Main from './components/Main';
import MintSBTwithSNS from './components/MintSBTwithSNS';
import MySBT from './components/MySBT';
import TestDashboard from './components/TestDashboard';

import LoginBtn from './components/GoogleLoginBtn';
import MainBot from './components/MainBot';
import GetDataFromKakao from './components/GetDataFromKakao';

import TestKakaoOauth from './components/TestKakaoOauth';
import TestKakaoOauth2 from './components/TestKakaoOauth2';


function App() {
	

  return (
    <GoogleOAuthProvider clientId="420941753510-j3ki1na6bddvmvn1dcgidhhllcurmee6.apps.googleusercontent.com">
        <Container>
					<Router>
						<Routes>
							<Route exact path="/" element ={<Main />} />
							<Route exact path="/mint_sbt_with_sns" element ={<MintSBTwithSNS />} />
							<Route exact path="/get_data_from_kakao" element ={<GetDataFromKakao />} />
							<Route exact path="/my_sbt" element ={<MySBT />} />
							<Route exact path="/test_dashboard" element ={<TestDashboard />} />
							<Route exact path="/mainbot" element ={<MainBot />} />
							<Route exact path="/test_kakao" element ={<TestKakaoOauth />} />
							<Route exact path="/test_kakao2" element ={<TestKakaoOauth2 />} />
							


							{/* <Route path="/show-prices" element ={<ShowPrices />} />
							<Route path="/show-prices-separated-table" element ={<ShowPricesSeparatedTable2 />} />
							<Route path="/test1" element ={<GetAddressBalanceOfUSDT />} />
							<Route path="/monitor-prices" element ={<MonitorPrices />} />
							<Route path="/monitor-prices2" element ={<MonitorPrices2 tokens_and_paths ={this.state.tokens_and_paths}/>} />
							<Route path="/monitor-prices3" element ={<MonitorPrices3 tokens_and_paths ={this.state.tokens_and_paths}/>} />
							

							<Route path="/auth-test" element ={<AuthTest />} />
							<Route path="/signup-test" element ={<SignUpTest />} />
							<Route path="/monitor-prices" element ={<MonitorPrices />} />

							<Route path='/prices_screen1' element = {<PricesScreen1 />} />


							<Route path='/swaptest' element = {<SwapTest />} />
							<Route path='/swaptest2' element = {<SwapTest2 />} />
							<Route path='/swaptest3' element = {<SwapTest3 />} /> */}
							
						</Routes>
					</Router>
				</Container>







      {/* <div className="App">
        <header className="App-header">
          ABCDEFG
          <LoginBtn />
        </header>
      </div> */}
    </GoogleOAuthProvider>
    
  );
}

export default App;
