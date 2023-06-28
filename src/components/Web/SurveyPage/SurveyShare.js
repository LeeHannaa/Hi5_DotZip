import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { dbService } from '../../../fbase';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import styled from 'styled-components';
import { KakaoIdContext } from '../../../KakaoIdContext';
import { UserNameContext } from '../../../UserNameContext';
import AddAnswer from '../AnswerPage/AddAnswer';
import CopyToClipboard from 'react-copy-to-clipboard'; //링크복사


const Div = styled.div`
  margin-top: 70px;
  height: 1000px;
  
`;

const HeaderP = styled.p`
  width: 260px;
  height: 19px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 19px;
  color: #818181;
`;

const HeaderDiv = styled.header`
  width: 120px;
  height: 19px;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #efefef;
  left: calc(50% - 311px/2);
`;

const Header3 = styled.p`
  width: 110px;
  height: 24px;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
  color: #efefef;
`;

const Header2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-top: 20px;
`;

const Survey = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 375px;
  height: 812px;
  background: black;
  margin: 0 auto;
  overflow-x: hidden;
`;
const Button2 = styled.button`
  box-sizing: border-box;
  position: absolute;
  width: 375px;
  height: 60px;
  left: calc(50% - 375px/2);
  top: 648px;
  background: #212121;
  border: 1px solid #ABABAB;
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #ABABAB;
  
`;
const P = styled.p`

background: #EEFF01;

  
`;//버튼들
const LinkButton = styled.button` //링크복사
    width: 200px;
    height: 100px;
    padding: 5px;
    background: red;
`;
const LinkMessage = styled.div` //링크복사
    width: 200px;
    background: white;
    padding: 10px;
    border: 1px solid black;
`;



const SurveyShare = () => {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const [kakaoContext] = useContext(KakaoIdContext);
    const [userContext] = useContext(UserNameContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [question, setQuestion] = useState('');
    const [comment, setComment] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
  
    useEffect(() => {
      const unsubscribe = onSnapshot(doc(dbService, 'zip_Question', questionId), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setQuestion(data.question);
          setComment(data.comment);
        } else {
          // Handle case when document does not exist
        }
      });
  
      return () => {
        unsubscribe();
      };
    }, [questionId]);
  
    const showModal = ()=>{
      setModalOpen(!modalOpen);
    };

     //링크 복사하기
    const voteLink = window.location.href;
    const [showMessage, setShowMessage] = useState(false);
    const handleCopyLink = () => {
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
        }, 1000);
    };

    return (
        <Div>
          <Survey>
            <Header2>
              <HeaderDiv>{userContext}님의 .Zip이 완성되었어요.</HeaderDiv>
              <HeaderP>링크를 공유하고 투표를 받아보세요!</HeaderP>
            </Header2>
            <div>
            <P>Question: {question}</P>
            <P>Comment: {comment}</P>
             </div>
             <CopyToClipboard text={voteLink}>
  <div>
    <LinkButton onClick={handleCopyLink}>링크 복사하기</LinkButton>
    {showMessage && <LinkMessage>링크가 복사되었습니다</LinkMessage>}
  </div>
</CopyToClipboard>

            <Button2 onClick={() => navigate('/home')}>
            홈으로 돌아가기
          </Button2>
          <h2>투표하기</h2> <p>키워드 후보는 1인 1개만 추가할 수 있어요.</p>
          <button onClick={showModal}>키워드 후보 추가하기</button>
            {modalOpen && <AddAnswer setModalOpen={setModalOpen} />}
          </Survey>
        </Div>
      );
    };

export default SurveyShare;


