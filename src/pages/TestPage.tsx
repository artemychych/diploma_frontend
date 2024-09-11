import React, { useState, useEffect } from 'react';
import { Button, Grid, Paper, List} from '@mui/material';
import { styled } from '@mui/material/styles';
import Companies from '../components/Companies';
import Tests from '../components/Tests';
import Vacancies from '../components/Vacancies';

import Profile from '../components/Profile';
import axios from 'axios';

import { NavigateFunction, useNavigate, Link, useParams } from 'react-router-dom';
import Question from '../components/cards/Question';
import TestConstructor from '../components/TestConstructor';
import TestActive from '../components/TestActive';
import Cookies from 'js-cookie';
import UserTestList from '../components/cards/UserTestResultCard';

interface QuestionInterface {
  id: number;
  first: string;
  second: string;
  third: string;
  fourth: string;
  question: string;
  image: string;
  answer: string;
}

interface Answer {
  question_id: number;
  answer: string;
}

interface DataToSend {
  user_id: number;
  skill_id: number;
  questions: Answer[];
}

interface QuestionProps {
  question: QuestionInterface;
}

interface UserInfo {
  username: string;
  email: string;
  group: string;
}

const TestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  let navigate: NavigateFunction = useNavigate();
  const [questionsData, setQuestionsData] = useState<QuestionInterface[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const API = "http://localhost:8000"
  const token = Cookies.get('user_id');
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [currentComponent, setCurrentComponent] = useState<string>('Default');
  const handleButtonClick = (componentName: string) => {
    setCurrentComponent(componentName);
  };

  const logout = () => {
    Cookies.remove('user_id');
    navigate("/");
  };


  const changeQuestionAnswer = (questionId: number, answer: string) => {
    console.log(answer, questionId);
    updateAnswer(questionId, answer);
  };

  const addAnswer = (questionId: number, answer: string) => {
    setAnswers((prevAnswers) => [...prevAnswers, { question_id: questionId, answer }]);
  };

  const updateAnswer = (questionId: number, newAnswer: string) => {
    setAnswers((prevAnswers) => 
      prevAnswers.map((answer) => 
        answer.question_id === questionId 
          ? { ...answer, answer: newAnswer } 
          : answer 
      )
    );
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const userResponse = await axios.get(API + '/auth/get_user', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          }
        });
        setUserInfo(userResponse.data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    console.log("Обновленные ответы:", answers);
  }, [answers]);

  let content: JSX.Element;

  switch (currentComponent) {
    case 'Component1':
      navigate("/main/internships")  
      break;
    case 'Component2':
       navigate("/main/companies") 
      break;
    case 'Component3':
        navigate("/main/tests") 
      break;
    case 'Component5':
        navigate("/main/profile") 
      break;
    default:
    
  }

  return (
    <div>
      <div className="flex gap-5 justify-between px-16 py-6 w-full whitespace-nowrap bg-slate-100 max-md:flex-wrap max-md:px-5 max-md:max-w-full">
        <div className="flex gap-3.5 my-auto text-2xl font-bold leading-6 text-black">
          <img
            loading="lazy"
            src={require('../assets/Logo.png')}
            className="shrink-0 aspect-square w-[30px]"
          />
          <div className="flex-auto my-auto">InternShift</div>
        </div>
        <div className="flex gap-5 max-md:flex-wrap max-md:max-w-full">
          <div className="flex flex-auto gap-10 justify-center my-auto text-base leading-6 text-zinc-900 max-md:flex-wrap max-md:max-w-full">
            <button onClick={() => handleButtonClick('Component1')}>
              <div className="font-bold">
                Стажировки
              </div>
            </button>
            <button onClick={() => handleButtonClick('Component2')}>
              <div>
                Компании
              </div>
            </button>
            <button onClick={() => handleButtonClick('Component3')}>
              <div>
                Тесты
              </div>
            </button>
            <button onClick={() => handleButtonClick('Component5')}>
              <div>
                Профиль
              </div>
            </button>
          </div>
        </div>
        <div className="flex shrink gap-3.5 text-sm font-medium leading-5 text-center basis-auto grow-0">
            <button onClick={logout}>
              <div className="justify-center px-5 py-2.5 text-white bg-green-500 rounded-md">
                Выйти
              </div>
            </button>
            
          </div>
      </div>
      {
        userInfo?.group === "companies" ? <div>
            <TestConstructor id_internship={id}/>
            <UserTestList testId={id}/>
        </div>
        
         : <TestActive testId={id}/>
      }
      
    </div>
  );
};

export default TestPage;