import styled from "styled-components";
import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { dbService } from '../../../fbase';
import Modal from 'react-modal';
import CopyToClipboard from 'react-copy-to-clipboard'; //링크복사
import { useNavigate, useParams } from 'react-router-dom';
import { UserNameContext } from '../../../UserNameContext';
import KakaoShareButton from '../ProfilePage/ShareKakao';

const Div = styled.div`

`;
//제목
const Title = styled.div`
    width: 400px;
    height: 50px;
    padding: 5px;
    background: pink;
`;
//투표 박스
const VoteBox = styled.button`
    width: 500px;
    height: 60px;
    margin: 5px;
    border: 1px solid black;
    background: linear-gradient(to right, pink ${props => props.percentage}%, yellow ${props => props.percentage}%);
    color: #000000;
`;
//버튼들
const LinkButton = styled.button` //링크복사
    width: 200px;
    height: 100px;
    padding: 5px;
    background: red;
    display: inline-block;
`;
const LinkMessage = styled.div` //링크복사
    width: 200px;
    background: white;
    padding: 10px;
    border: 1px solid black;
`;
const EndButton = styled.button`
    width: 200px;
    height: 100px;
    padding: 5px;
    background: red;
`;
//모달 안에 내용들
const modalStyles = {
    content: {
      width: '400px',
      height: '600px',
      margin: 'auto',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '20px',
      backgroundColor: '#fff',
    },
};
const ReasonBox = styled.div`
    width: 200px;
    height: 100px;
    background: yellow;
`;
const ModalCheck = styled.button`
    width: 100px;
    height: 50px;
    padding: 5px;
    background: white;
    color: black;
`;
const BackHomeButton = styled.button`
    width: 200px;
    height: 100px;
    padding: 5px;
    background: red;
`;

function PickAnswerPage() {
    // 답변 불러오기
    const [questionzip, setQuestionZip] = useState();
    const [commentzip, setCommentZip] = useState();
    const [answerzips, setAnswerZip] = useState([]);
    const [reasonzips, setReasonZip] = useState([]);
    const {questionId} = useParams(); //questionid 받아오기
    const [voteEnd, setVoteEnd] = useState(true);
    const [userNickname] = useState(localStorage.getItem("userName"));

    useEffect(() => {
        fetchDataQuestion();
        fetchDataAnswer();
    }, []);

    const fetchDataQuestion = async () => {
        const zipCollection = collection(dbService, "zip_Question");
        const zipQSnapshot = await getDocs(zipCollection);
        const QuestionzipArr = zipQSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const targetQ = QuestionzipArr.find((user) => user.id === questionId);
        console.log(targetQ);
        setQuestionZip(targetQ.question);
        setCommentZip(targetQ.comment);
        setVoteEnd(targetQ.voteEnd); // 투표 종료 여부 판단
    };

    const fetchDataAnswer = async () => {
        const answerZipCollection = collection(dbService, "zip_Answer");
        getDocs(answerZipCollection)
        .then((answerZipSnapshot) => {
            const answerZipArr = answerZipSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
        }));
        const targetAnswers = answerZipArr.filter((answer) => answer.questionId === questionId);
          setAnswerZip(targetAnswers);
          console.log(targetAnswers);
        });
        
        return () => {
          answerZipCollection(); // 감시 중지
        };
    };
    

    const fetchReasons = (answerID) => {
        if (!answerID) {return;}
        const reasonZipCollection = collection(dbService, "zip_Reason");
        getDocs(reasonZipCollection)
        .then((reasonZipSnapshot) => {
            const reasonZipArr = reasonZipSnapshot.docs.map((doc) => ({
                ...doc.data(),
        }));
        const targetReason = reasonZipArr.filter(
            (reason) => reason.answerId === answerID
          );
          setReasonZip(targetReason);
          console.log(targetReason);
        });
        return () => {
            reasonZipCollection();
        };
    };

    //modal창띄우고 내리는 함수 관련
    Modal.setAppElement('#root'); // 예시로 root 요소를 App 요소로 설정
    const [keyword, setKeyword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleVoteBoxClick = (answer, answerID) => {
        setKeyword(answer);
        setIsModalOpen(true);
        fetchReasons(answerID); //zip_reason컬렉션에서 해당 정보와 일치하는 이유 불러오기
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    

    //링크 복사하기
    const voteLink = `${window.location.origin}/answer/${questionId}`;
    const [showMessage, setShowMessage] = useState(false);
    const handleCopyLink = () => {
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
        }, 1000);
    };

    
    //투표종료하기
    const navigate = useNavigate();
    const handleEndVote = () => {
        const docRef = doc(dbService, "zip_Question", questionId);
        updateDoc(docRef, { voteEnd: false })
        .then(() => {
        // Update the local state after successful update in Firebase
        setVoteEnd(false);
            navigate('/MyProfile');
        })
        .catch((error) => {
        // Handle the error
        console.error("Error updating voteEnd field:", error);
        });
    };
    //홈으로 돌아가기
    const handleBackHome = () => {
        navigate('/Home');
    };
    const totalVotes = answerzips.reduce((sum, answerzip) => sum + answerzip.totalVote, 0);


    return (
        <Div>
        <h1>VOTE ME!</h1>
        <h1>{userNickname} 님의 진행중인 폴더</h1> 
        <h3>내가 생성한 폴더의 답변과 이유를 확인해보세요!</h3>
        <Title>질문 : {questionzip}</Title>
        <h3>comment : {commentzip}</h3>
        <KakaoShareButton/>
        <CopyToClipboard text={voteLink}>
            <LinkButton onClick={handleCopyLink}>링크 복사하기</LinkButton>
        </CopyToClipboard>
        {showMessage && <LinkMessage>링크가 복사되었습니다</LinkMessage>}
        <h2>투표결과 확인하기</h2>
        <h3>이유를 확인하고 싶다면 클릭해보세요.</h3>
        {answerzips.map((answerzip) => (
            <div key={answerzip.id}>
                <VoteBox percentage={(answerzip.totalVote / totalVotes) * 100} onClick={() => handleVoteBoxClick(answerzip.answer, answerzip.id)}>
                <div>
                    <span>
                    {answerzip.answer} {((answerzip.totalVote / totalVotes) * 100).toFixed(1)}%
                    </span>
                </div>
                </VoteBox>
            </div>
        ))}
        <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} style={modalStyles}>
            <h1>{keyword}으로 답변한 <br></br>사람들의 이유</h1>
            {reasonzips.map(({ reason, nickname }) => (
                <ReasonBox key={reason}>
                    <h6>작성자 nickname: {nickname}</h6>
                    <h3>{reason}</h3>
                </ReasonBox>
            ))}
            <ModalCheck isopen="false" onClick={handleCloseModal}>확인</ModalCheck>
        </Modal>
            {voteEnd ?  null : (<BackHomeButton onClick={handleBackHome}>홈으로 돌아가기</BackHomeButton>)}
            {voteEnd ? (<EndButton onClick={handleEndVote}>투표 종료하기</EndButton>) : null}
        </Div>
    );
};
//questionID가 같으면 이유는 answerArr비교해서 해당 모듈 창 띄우기 + 해당 사람의 별명
export default PickAnswerPage;