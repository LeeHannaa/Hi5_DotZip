import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Inquiry from './pages/Inquiry';
import About from './pages/About';
import PickAnswerPage from './components/Web/VotePage/PickAnswerPage';
import MyProfilePage from './components/Web/ProfilePage/MyProfilePage';
import SurveyFirst from './components/Web/SurveyPage/SurveyFirst';
import SurveySecond from './components/Web/SurveyPage/SurveySecond';
import SurveyCreate from './components/Web/SurveyPage/SurveyCreate';
import Answer from './pages/Answer';
import AnswerEnd from './components/Web/AnswerPage/AnswerEnd';
import SurveyShare from './components/Web/SurveyPage/SurveyShare';
import Preferences from './components/Web/PreferencesPage/PreferencesPage';
import VotingPage from './components/Web/VotePage/VotingPage';
import { KakaoIdContext } from "./KakaoIdContext.js";

function App() {
  const [kakaoContext] = useContext(KakaoIdContext);
  const kakaoId =  localStorage.getItem("kakaoId")
  //로컬스토리지로 파람스를 저장하고 파람스와 로컬스토리지가 같을경우 투표한 걸로 챙긴다.
  return (
<Router>
  <Routes>
    <Route path= '/' element={<Auth/>}/>
    <Route path="/Home" element={kakaoId ? <Home /> : <Auth />} />
    <Route path='/Inquiry' element={<Inquiry/>}/>
    <Route path='About' element={<About/>}/>
    <Route path='/VotingPage' element={<VotingPage/>}/>
    <Route path='/PickAnswer/:questionId' element={<PickAnswerPage/>}/>
    <Route path='/MyProfile' element={<MyProfilePage/>}/>
    <Route path='/SurveyFirst' element={<SurveyFirst/>}/>
    <Route path='/SurveySecond' element={<SurveySecond/>}/>
    <Route path='/SurveyCreate' element={<SurveyCreate/>}/>
    <Route path='/SurveyShare/:questionId' element={<SurveyShare/>}/>
    <Route path='/Answer' element={<Answer/>}/>
    <Route path='/Answer/:questionId' element={<Answer/>}/>
    <Route path='/AnswerEnd' element={<AnswerEnd/>}/>
    <Route path='/AnswerEnd/:questionId' element={<AnswerEnd/>}/>
    <Route path='/Preferences' element={<Preferences/>}/>

  </Routes>


</Router>
  );
}

export default App;

