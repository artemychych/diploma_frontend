import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { NavigateFunction, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';


const RegistrationPage: React.FC = () => {
  let navigate: NavigateFunction = useNavigate();
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [isCompany, setIsCompany] = useState('No');
  const [password, setPassword] = useState('');
  const API = "http://localhost:8000"

  useEffect(() => {
    const data = Cookies.get('user_id');
    if (data != undefined) {
      navigate("/main/internships");
    } else {}
  }, []);

  const handleIsCompany = () => {
    if (isCompany == "No") {
      setIsCompany("Yes")
    } else {
      setIsCompany("No")
    }
  }
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const register = async () => {
      try {
          const login_response = await axios.post(API + "/auth/signup", {
            username: login,
            email: email,
            password: password
          });
          console.log(login_response)
          return login_response
        } catch (error) {
          console.error('Error:', error);
        }
    }
    const register_company = async () => {
      try {
        const login_response = await axios.post(API + "/auth/signup_companies", {
          username: login,
          email: email,
          password: password
        });
        console.log(login_response)
        return login_response
      } catch (error) {
        console.error('Error:', error);
      }
    }

    if (isCompany == "No") {
      register();
    } else {
      register_company();
    }
    
    navigate("/");
    // Здесь вы можете написать код для отправки данных на сервер для регистрации
  };

  const toLogin = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-end items-center pt-20 bg-white">
        <div className="flex gap-3.5 my-auto text-4xl font-bold leading-6 text-black">
          <img
            loading="lazy"
            src={require('../assets/Logo.png')}
            className="shrink-0 aspect-square w-[30px]"
          />
          <div className="flex-auto my-auto">InternShift</div>
        </div>
        <div className="flex flex-col px-14 py-10 mt-8 max-w-full rounded-3xl border border-solid border-stone-500 border-opacity-50 w-[640px] max-md:px-5">
          <div className="self-center text-3xl font-medium text-center text-zinc-800">
            Регистрация
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative flex flex-end gap-x-3 mt-2.5" onClick={handleIsCompany}>
              <div className="flex h-6 items-center">
                <input
                  id="candidates"
                  name="candidates"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
              <div className="text-sm leading-6 text-xl">
                <label htmlFor="candidates" className="font-medium text-gray-900">
                  Вы Компания?
                </label>
              </div>
            </div>
            <div className='mt-2.5'>
              <TextField
                label="Логин"
                fullWidth
                value={login}
                onChange={handleLoginChange}
                margin="normal"
                variant="outlined"
              />
            </div>
          
              <div className='mt-2.5'>
                <TextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={handleEmailChange}
                    margin="normal"
                    variant="outlined"
                />
              </div>
              <div className='mt-2.5'>
              <TextField
                  label="Пароль"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={handlePasswordChange}
                  margin="normal"
                  variant="outlined"
              />
              </div>
              <div className="flex justify-center items-center">
                <button type='submit' className='w-screen'>
                  <div className="justify-center items-center px-16 py-4 mt-6 text-2xl font-medium text-center text-white bg-green-600 rounded-[40px] max-md:px-5 max-md:max-w-full">
                    Зарегистрироваться
                  </div>
                </button>
              </div>
              
          </form>
          <div className="flex justify-center items-center">
            <button onClick={toLogin} className='w-screen'>
              <div className="justify-center items-center px-16 py-4 mt-6 text-2xl font-medium text-center text-xl text-center border border-solid border-neutral-900 rounded-[40px] text-neutral-900 rounded-[40px] max-md:px-5 max-md:max-w-full">
                Войти
              </div>
            </button>
          </div>
          
            
        </div>
      </div>
    
  );
};

export default RegistrationPage;