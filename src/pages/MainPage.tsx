import React, { useState, useEffect } from 'react';
import { Button, Grid, Paper} from '@mui/material';
import { styled } from '@mui/material/styles';
import Companies from '../components/Companies';
import Tests from '../components/Tests';
import Vacancies from '../components/Vacancies';
import Profile from '../components/Profile';
import axios from 'axios';
import Cookies from 'js-cookie';
import { NavigateFunction, useNavigate, Link, useParams } from 'react-router-dom';

const MainPage: React.FC = () => {
  const { page } = useParams<{ page: string }>();
  let navigate: NavigateFunction = useNavigate();
  const handleButtonClick = (componentName: string) => {
    navigate('/main/' + componentName);
  };

  const logout = () => {
    Cookies.remove('user_id');
    navigate("/");
  };

  useEffect(() => {
    const data = Cookies.get('user_id');
    if (data == undefined) {
      navigate("/");
    }
  }, []);
  // const Item = styled(Paper)(({ theme }) => ({
  //   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  //   ...theme.typography.body2,
  //   padding: theme.spacing(1),
  //   textAlign: 'center',
  //   color: theme.palette.text.secondary,
  // }));

  let content: JSX.Element;

  switch (page) {
    case 'internships':
      content = <Vacancies />;
      break;
    case 'companies':
      content = <Companies />;
      break;
    case 'tests':
      content = <Tests />;
      break;
    case 'profile':
      content = <Profile />;
      break;
    default:
      content = <Vacancies />;
    
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
            <button onClick={() => handleButtonClick('internships')}>
              <div className="font-bold">
                Стажировки
              </div>
            </button>
            <button onClick={() => handleButtonClick('companies')}>
              <div>
                Компании
              </div>
            </button>
            <button onClick={() => handleButtonClick('tests')}>
              <div>
                Тесты
              </div>
            </button>
            <button onClick={() => handleButtonClick('profile')}>
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
      <div>
        {content}
      </div>
    </div>
  );
};

export default MainPage;