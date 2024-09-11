import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Card,
  CardContent,
  Box,
  Modal,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Cookies from 'js-cookie';
import internal from 'stream';

interface Question {
  id: number;
  type: string; // 'multiple-choice' or 'file-upload'
  text: string;
  options?: string[];
  correctAnswer?: number;
  fileType?: string;
  description?: string;
  uploadedFile?: File; 
}

interface Test {
  title: string;
  questions: Question[];
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '80vh', 
  overflowY: 'auto',
};

interface TestConstructorProps {
    id_internship?: string;
    
}

const TestConstructor: React.FC<TestConstructorProps> = ({id_internship}) => {
  const API = "http://localhost:8000" 
  const token = Cookies.get('user_id'); 
  const [test, setTest] = useState<Test>({
    title: '',
    questions: [],
  });
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: 1,
    type: 'multiple-choice',
    text: '',
    options: ['', '', '', ''],
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API + '/auth/get_test_by_id/' + id_internship, { 
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`
          },
        });
        const data = await response.json();
        setTest({
          title: data.title,
          questions: data.questions.map((question: Question) => ({
            ...question,
            uploadedFile: question.uploadedFile ? question.uploadedFile : null, // Обработка uploadedFile
          })),
        });
        

      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchData().then(() => {console.log(test)}); 
  }, []); 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewQuestion({ ...newQuestion, uploadedFile: e.target.files[0] });
    }
  };

  const handleTestTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTest({ ...test, title: e.target.value });
  };

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuestion({ ...newQuestion, text: e.target.value });
  };

  const handleQuestionTypeChange = (e: SelectChangeEvent<string>) => {
    setNewQuestion({ ...newQuestion, type: e.target.value as string });
  };

  const handleAddQuestion = () => {
    setTest({
      ...test,
      questions: [...test.questions, newQuestion],
    });
    setNewQuestion({
      id: test.questions.length + 2,
      type: 'multiple-choice',
      text: '',
      options: ['', '', '', ''],
    });
    setOpen(false);
    console.log(test);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOptionChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedOptions = [...(newQuestion.options || [])];
    updatedOptions[index] = e.target.value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuestion({ ...newQuestion, correctAnswer: parseInt(e.target.value, 10) });
  };

  const handleFileTypeChange = (e: SelectChangeEvent<string>) => {
    setNewQuestion({ ...newQuestion, fileType: e.target.value as string });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuestion({ ...newQuestion, description: e.target.value });
  };

  const handleDeleteQuestion = (questionId: number) => {
    setTest({
      ...test,
      questions: test.questions.filter((q) => q.id !== questionId),
    });
  };

  const handleEditQuestion = (questionId: number) => {
    const questionToEdit = test.questions.find((q) => q.id === questionId);
    if (questionToEdit) {
      setNewQuestion({ ...questionToEdit });
      setEditingQuestionId(questionId);
      setOpen(true);
    }
    console.log(test.questions.find((q) => q.id === questionId));
  };

  const handleSaveQuestion = () => {
    if (editingQuestionId !== null) {
      // Редактируем существующий вопрос
      setTest({
        ...test,
        questions: test.questions.map((q) =>
          q.id === editingQuestionId ? newQuestion : q
        ),
      });
      setEditingQuestionId(null);
    } else {
      // Добавляем новый вопрос
      handleAddQuestion();
    }
    setOpen(false);
  };

  const handleSubmitTest = async () => {
    const formData = new FormData();
    formData.append('title', test.title);
    console.log(id_internship);
    if (id_internship) {
      formData.append('internship_id', id_internship);
    }
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
    });
  
    try {
      const response = await fetch(API + '/auth/create_or_update_test', {
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


  return (
    <div>
    <Grid container spacing={2}>
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3}}>
                <Typography variant="h4" gutterBottom>
                    Конструктор теста
                </Typography>
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3}}>
                <TextField
                    label="Название теста"
                    fullWidth
                    margin="normal"
                    value={test.title}
                    onChange={handleTestTitleChange}
                />
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3}}>
                <Button variant="contained" onClick={handleOpen} sx={{ mt: 2 }}>
                    Добавить вопрос
                </Button>
            </Grid>
            
            <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                <Box sx={{ ...style, overflowY: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                    Новый вопрос
                </Typography>

                <TextField
                    label="Текст вопроса"
                    fullWidth
                    margin="normal"
                    value={newQuestion.text}
                    onChange={handleQuestionTextChange}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="question-type-label">Тип вопроса</InputLabel>
                    <Select
                    labelId="question-type-label"
                    id="question-type"
                    value={newQuestion.type}
                    onChange={handleQuestionTypeChange}
                    >
                    <MenuItem value="multiple-choice">Тест c 4 вариантами ответа</MenuItem>
                    <MenuItem value="file-upload">Задание c отправкой файла</MenuItem>
                    </Select>
                </FormControl>

                {newQuestion.type === 'multiple-choice' && (
                    <Card sx={{ mt: 2 }}>
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                        Варианты ответов:
                        </Typography>

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                        {newQuestion.options?.map((option, index) => (
                            <Grid item xs={12} key={index}>
                            <TextField
                                label={`Вариант ${index + 1}`}
                                fullWidth
                                margin="normal"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e)}
                            />
                            </Grid>
                        ))}
                        </Grid>

                        <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <FormLabel component="legend">Правильный ответ</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={newQuestion.correctAnswer?.toString() || ''}
                            onChange={handleCorrectAnswerChange}
                        >
                            {newQuestion.options?.map((_, index) => (
                            <FormControlLabel
                                key={index}
                                value={index.toString()}
                                control={<Radio />}
                                label={`Вариант ${index + 1}`}
                            />
                            ))}
                        </RadioGroup>
                        </FormControl>
                    </CardContent>
                    </Card>
                )}

                {newQuestion.type === 'file-upload' && (
                    <Card sx={{ mt: 2 }}>
                    <CardContent>
                        <FormControl fullWidth margin="normal">
                        <InputLabel id="file-type-label">Тип файла</InputLabel>
                        <Select
                            labelId="file-type-label"
                            id="file-type"
                            value={newQuestion.fileType || ''}
                            onChange={handleFileTypeChange}
                        >
                            <MenuItem value=".txt">.txt</MenuItem>
                            <MenuItem value=".pdf">.pdf</MenuItem>
                            <MenuItem value=".docx">.docx</MenuItem>
                            {/* Добавьте другие типы файлов */}
                        </Select>
                        <input 
                        type="file" 
                        id="uploaded-file" 
                        onChange={handleFileChange} 
                            />
                            {/* Отображение имени файла, если он загружен */}
                            {newQuestion.uploadedFile && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Выбранный файл: {newQuestion.uploadedFile.name}
                            </Typography>
                            )}
                        </FormControl>

                        <TextField
                        label="Описание задания"
                        fullWidth
                        margin="normal"
                        value={newQuestion.description || ''}
                        onChange={handleDescriptionChange}
                        />
                    </CardContent>
                    </Card>
                )}

                <Button variant="contained" onClick={handleSaveQuestion} sx={{ mt: 2 }}>
                    {editingQuestionId !== null ? 'Сохранить вопрос' : 'Добавить вопрос в тест'}
                </Button>
                </Box>
            </Modal>

            <List>
                {test.questions.map((question) => (
                <ListItem key={question.id}>
                    <ListItemText primary={question.text} secondary={question.type} />
                    <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditQuestion(question.id)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteQuestion(question.id)}>
                        <DeleteIcon />
                    </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                ))}
            </List>
        </Grid>
        <Grid item xs={3}></Grid>
    </Grid>
    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3}}>
                <Button variant="contained" onClick={handleSubmitTest} sx={{ mt: 2 }}>
                    Отправить тест
                </Button>
    </Grid>  
    </div>
  );
};

export default TestConstructor;