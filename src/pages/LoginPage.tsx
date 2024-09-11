import React, { useState, useEffect } from 'react';
import { NavigateFunction, useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';


type Props = {}

interface CsrfInterface {
    csrf_token: string;
}
interface User{
  id: number;
  username: string;
  password: string;
  email: string;

}
interface LoginResponse {
  token: string;
  user: User;
}
// Функция для получения CSRF токена из cookie
const getCsrfToken = () => {
    const csrfCookie = document.cookie.match(/csrftoken=([^;]+)/);
    return csrfCookie ? csrfCookie[1] : null;
  };
// Создаем экземпляр Axios с настройками по умолчанию
const instance = axios.create({
    baseURL: 'http://localhost:8000', // Ваш URL API
    
  });

const LoginPage: React.FC<Props> = () => {
    let navigate: NavigateFunction = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const API = "http://localhost:8000"
    const [csrfData, setCsrfData] = useState<CsrfInterface | null>(null);


    useEffect(() => {
      const data = Cookies.get('user_id');
      if (data != undefined) {
        navigate("/main/internships");
      }
    
    }, []);

    const register = () => {
      navigate("/registration");
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const login = async () => {
            try {
                const login_response = await axios.post<LoginResponse>(API + "/auth/login", {
                  username: email,
                  password: password
                });
                console.log(login_response)
                navigate("/main/internships")
                return login_response
              } catch (error) {
                console.error('Error:', error);
              }
        }
        try {
        login().then( 
          (data) => {
            if (data) {
              Cookies.set('user_id', String(data.data.token));
              console.log(Cookies.get('user_id'));
            }
          });
              
        } catch (error) {
            console.error('Error fetching data:', error);
        };
        
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
              Вход
            </div>
            <form onSubmit={handleSubmit}>
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
                      Войти
                    </div>
                  </button>
                </div>
                
            </form>
            <div className="flex justify-center items-center">
              <button onClick={register} className='w-screen'>
                <div className="justify-center items-center px-16 py-4 mt-6 text-2xl font-medium text-center text-xl text-center border border-solid border-neutral-900 rounded-[40px] text-neutral-900 rounded-[40px] max-md:px-5 max-md:max-w-full">
                  Зарегистрироваться
                </div>
              </button>
              
            </div>
            
            
        </div>
      </div>
      
    );
};

export default LoginPage;