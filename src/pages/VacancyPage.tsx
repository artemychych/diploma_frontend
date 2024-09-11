import React, { useState, useEffect } from 'react';
import { Button, Grid, Paper, Divider, Box, Card,
  CardHeader,
  CardContent,
  Typography,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Companies from '../components/Companies';
import Tests from '../components/Tests';
import Vacancies from '../components/Vacancies';
import Profile from '../components/Profile';
import axios from 'axios';
import Cookies from 'js-cookie';
import { NavigateFunction, useNavigate, Link, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

interface UserInfo {
  username: string;
  email: string;
  group: string;
}

interface Internship {
  id: number;
  name: string;
  description: string;
  date_start: Date;
  date_end_selection: Date;
  skills: string[];
  created_at: string;
}

const VacancyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  let navigate: NavigateFunction = useNavigate();
  const [internshipData, setInternshipData] = useState<Internship>();
  const API = "http://localhost:8000";
  const token = Cookies.get('user_id'); 
  const [currentComponent, setCurrentComponent] = useState<string>('Default');
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const handleButtonClick = (componentName: string) => {
    navigate('/main/' + componentName);
  };

  const logout = () => {
    Cookies.remove('user_id');
    navigate("/");
  };
  const handleDoTest = () => {
    navigate('/test/' + id);
  }

  const handleChangeTest = () => {
    navigate('/test/' + id);
  }
  useEffect(() => {
    const getData = async () => {
      try {
          const response = await axios.get(API + "/auth/get_internship/" + id, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
              }
            });
          setInternshipData(response.data.internship);
          const userResponse = await axios.get(`${API}/auth/get_user`, {
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
        <Grid container spacing={2}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {internshipData?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {internshipData?.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={2}>
                  <b>Необходимые навыки:</b>
                </Typography>
                 {/* Отображение навыков как Chip */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '20px' }}>
                  {internshipData?.skills.map((skill, index) => (
                    <Chip key={index} label={skill} size="small" />
                  ))}
                </div>
              </CardContent>
              <CardContent>
                Начало стажировки: {internshipData?.date_start ? dayjs(internshipData.date_start).format('DD.MM.YYYY') : "N/A"}
              </CardContent>
              <CardContent>
                Конец отбора: {internshipData?.date_end_selection ? dayjs(internshipData.date_end_selection).format('DD.MM.YYYY') : "N/A"}
              </CardContent>
            </Card>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3}}>
              {
                userInfo?.group === "companies" ? 
                <Button variant="contained" color="primary" onClick={handleChangeTest}>
                    Редактировать тестовое задание
                </Button> : <Button variant="contained" onClick={handleDoTest}>
                  Пройти тестовое задание
              </Button>
              }
            </Grid>
            
            
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
        
      </div>
    </div>
  );
};

export default VacancyPage;