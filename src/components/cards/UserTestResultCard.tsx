import React, {useEffect, useState} from 'react';
import { Typography, Card, CardContent, Box, Button, Select, Grid, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material'; 
import axios from 'axios';
import Cookies from 'js-cookie';
const statuses = ['В обработке', 'Принято', 'Не принято'];

interface Question {
  id: number;
  text: string;
  type: string;
  options?: string[];
  correctAnswer?: number;
  fileType?: string;
  description?: string;
  userAnswerFile?: string;
  user_answer_choice?: string;
}

interface UserTest {
  test_id: number; // Добавил test_id
  user_id: number;
  status: string;
  questions: Question[];
}

interface TestDetails {
  title: string;
  tests: UserTest[];
}

interface UserInfo {
  name: string;
  email: string;
}

interface UserTestCardProps {
  userTest: UserTest;
  onUpdateStatus: (testId: number, newStatus: string, userId: number) => void; 
}

const UserTestCard: React.FC<UserTestCardProps> = ({ userTest, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(
    userTest.status || 'В обработке' // Устанавливаем текущий статус из userTest
    );
  const API = "http://localhost:8000";
  const token = Cookies.get('user_id');
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const handleDownload = (userId: number, testId: number) => {
    window.location.href = API + `/auth/download_user_file/${userId}/${testId}`;
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => { 
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);
    onUpdateStatus(userTest.test_id, newStatus, userTest.user_id);
  };
  
  useEffect(() => {
    console.log("Отображение:");
    console.log(userTest);
    const getData = async () => {
        try {
            const userResponse = await axios.get(API + '/auth/get_user_by_id/' + userTest.user_id.toString(), {
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
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant='h6'>
          Логин пользователя: {userInfo?.name}
        </Typography>
        <Typography variant='h6' sx={{ mb: 2}}>
          Почта пользователя: {userInfo?.email}
        </Typography>
        {userTest.questions.map((question) => (
          <Box key={question.id} sx={{ mb: 2, boxShadow: 3, p: 2}}>
            <Typography variant="h6">{question.text}</Typography>
            {question.userAnswerFile && ( 
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <Button variant="outlined" onClick={() => handleDownload(userTest.user_id, question.id)}> 
                    Скачать файл ответа
                  </Button>
                </Grid>
                
                )}
            {question.user_answer_choice === "" ? null : 
            <div>
              <Typography variant="subtitle2" gutterBottom> Ответ пользователя: {question.user_answer_choice}</Typography>
              <Typography variant="subtitle2" gutterBottom> Правильный ответ: {question.correctAnswer}</Typography>
            </div>
            }
          </Box>
        ))}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <FormControl sx={{ mt: 2, minWidth: 120 }}>
            <InputLabel id="status-select-label">Статус</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={selectedStatus}
              label="Статус"
              onChange={handleStatusChange}
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
      </CardContent>
    </Card>
  );
};

interface UserTestListProps {
  testId?: string;
}

const UserTestList: React.FC<UserTestListProps> = ({testId}) => {
  const token = Cookies.get('user_id');
  const API = "http://localhost:8000";
  const [testDetails, setTestDetails] = useState<TestDetails>();

  useEffect(() => {
    console.log("ФЫЦВ")
    axios.get(`${API}/auth/get_users_test_details/${testId}`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(response => {
      setTestDetails(response.data);
    })
    .catch(error => {
      console.error('Error fetching test details:', error);
    });
  }, [testId]);


  const handleUpdateStatus = (testId: number, newStatus: string, userId: number) => {
    const sendData = async () => {
      try {
          const response = await axios.post(
              API + '/auth/update_status', 
              {
                testId: testId,
                userId: userId,
                newStatus: newStatus,
              }, 
              { headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${token}`
              }} 
          );

      } catch (error) {
          console.error('Error:', error);
      }

    }
    sendData();
    console.log(`Обновление статуса теста ${testId} на ${newStatus}`);
  };


  return (
    <Box sx={{ mt: 6 }}>
      <Grid container spacing={2}>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          <Typography variant="h4" gutterBottom>Результаты тестов кандидатов</Typography>
          {testDetails?.tests.map((userTest) => (
            <UserTestCard key={userTest.test_id} userTest={userTest} onUpdateStatus={handleUpdateStatus} />
          ))}
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
      
    </Box>
  );
};

export default UserTestList;