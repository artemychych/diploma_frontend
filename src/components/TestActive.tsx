import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
} from '@mui/material';

interface Question {
  id: number;
  type: string; // 'multiple-choice' or 'file-upload'
  text: string;
  options?: string[];
  correctAnswer?: number;
  fileType?: string;
  description?: string;
  uploadedFile?: string; // Adjusted to string for URL
  userAnswerFile?: File; 
  userAnswerChoice?: number; // Add userAnswer field
}

interface Test {
  title: string;
  questions: Question[];
}

interface TestDetailsProps {
  testId?: string;
}

const TestDetails: React.FC<TestDetailsProps> = ({ testId }) => {
  const [test, setTest] = useState<Test | null>(null);
  const API = "http://localhost:8000";
  const token = Cookies.get('user_id');

  useEffect(() => {
    axios.get(API + '/auth/get_test_by_id/' + testId, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
      .then(response => {
        setTest(response.data);
      })
      .catch(error => {
        console.error('Error fetching test details:', error);
      });
  }, [testId]);

  const handleDownload = (questionId: number) => {
    window.location.href = API + `/auth/download_file/${questionId}/`;
  };

  const handleAnswerChange = (questionId: number, answer: number) => {
    setTest((prevTest) => {
      if (prevTest) {
        return {
          ...prevTest,
          questions: prevTest.questions.map((q) =>
            q.id === questionId ? { ...q, userAnswerChoice: answer } : q
          ),
        };
      } else {
        return prevTest; 
      }
    });
  };

  const handleFileChange = (questionId: number, file: File | null) => {
    setTest((prevTest) => {
      // Проверяем, что prevTest не null 
      if (prevTest) {
        return { 
          ...prevTest, // Копируем все свойства prevTest
          questions: prevTest.questions.map((q) =>
            q.id === questionId ? { ...q, userAnswerFile: file } : q
          ),
        } as Test; // Явно указываем тип Test
      } else {
        // Если prevTest null, возвращаем null
        return null; 
      }
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (test !== null) {
        formData.append('title', test.title);
        test.questions.forEach((question, index) => {
            if (question.id !== undefined && question.id !== null) {
              formData.append(`questions[${index}]['id']`, question.id.toString());
            }
            if (question.type) {
              formData.append(`questions[${index}]['type']`, question.type);
            }
            if (question.text) {
              formData.append(`questions[${index}]['text']`, question.text);
            }
            if (question.options) {
              formData.append(`questions[${index}]['options']`, JSON.stringify(question.options));
            }
            if (question.correctAnswer !== undefined && question.correctAnswer !== null) {
              formData.append(`questions[${index}]['correctAnswer']`, question.correctAnswer.toString());
            }
            if (question.fileType) {
              formData.append(`questions[${index}]['fileType']`, question.fileType);
            }
            if (question.description) {
              formData.append(`questions[${index}]['description']`, question.description);
            }
            if (question.type === 'file-upload' && question.uploadedFile) {
              if (typeof question.uploadedFile === 'string') {
                formData.append(`questions[${index}]['uploadedFile']`, question.uploadedFile);
              } else if (question.uploadedFile) {
                formData.append(`questions[${index}]['uploadedFile']`, question.uploadedFile);
              }
            }

            if (question.type === 'file-upload' && question.userAnswerFile) {
                if (typeof question.uploadedFile === 'string') {
                  formData.append(`questions[${index}]['userAnswerFile']`, question.userAnswerFile);
                } else if (question.uploadedFile) {
                  formData.append(`questions[${index}]['userAnswerFile']`, question.userAnswerFile);
                }
              }
            if (question.userAnswerChoice) {
                formData.append(`questions[${index}]['userAnswerChoice']`, question.userAnswerChoice.toString());
            }
          });
    }
    if (testId) {
      formData.append('test_id', testId);
    }
  
    try {
      const response = await fetch(API + '/auth/add_user_test', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}` // 'Content-Type' is not needed for FormData
        },
        body: formData // Send FormData
      });
      console.log(response);
      // ... handle response ...
    } catch (error) {
      // ... handle errors ...
    }
  };

  if (!test) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Box>
     <Grid container spacing={2}>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
                <Typography variant="h4" gutterBottom>{test.title}</Typography>
            {test.questions.map((question, index) => (
                <Card key={question.id} sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="h6">{`Вопрос ${index + 1}`}</Typography>
                    <Typography>{question.text}</Typography>
                    {question.type === 'multiple-choice' && question.options && (
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <FormLabel component="legend">Выбери ответ:</FormLabel>
                        <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        value={question.userAnswerChoice ? question.userAnswerChoice.toString() : ''}
                        onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value, 10))}
                        >
                        {question.options.map((option, i) => (
                            <FormControlLabel
                            key={i}
                            value={(i+1).toString()}
                            control={<Radio />}
                            label={option}
                            />
                        ))}
                        </RadioGroup>
                    </FormControl>
                    )}
                    {question.type === 'file-upload' && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">Выбери файл:</Typography>
                        <Input
                            type="file"
                            onChange={(e) => {
                                const inputElement = e.target as HTMLInputElement; // Приведение типа
                                if (inputElement.files && inputElement.files[0]) {
                                  handleFileChange(question.id, inputElement.files[0]);
                                } else {
                                  handleFileChange(question.id, null); 
                                }
                              }}
                            />
                        {question.userAnswerFile && typeof question.userAnswerFile === 'string' && (
                        <Typography variant="body2" color="text.secondary">Выбранный файл: {question.userAnswerFile}</Typography>
                        )}
                    </Box>
                    )}
                    {question.type === 'file-upload' && question.uploadedFile && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">Файл задания:</Typography>
                        <Button
                        variant="contained"
                        onClick={() => handleDownload(question.id)}
                        >
                        Скачать задание
                        </Button>
                    </Box>
                    )}
                </CardContent>
                </Card>
            ))}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, mb: 6}}>
                <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>Отправить решение</Button>
            </Grid>
            
        </Grid>
        <Grid item xs={3}></Grid>
     </Grid>
      
    </Box>
  );
};

export default TestDetails;