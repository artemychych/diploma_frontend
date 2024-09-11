import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import VacanciesList from './VacanciesList';
import Cookies from 'js-cookie';
import axios from 'axios';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { 
    Box, 
    Button, 
    Menu, 
    MenuItem, 
    FormControlLabel, 
    Checkbox, 
    Typography,
    Modal,
    TextField,
    Grid,
  } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';

type Props = {}

interface UserInfo {
    username: string;
    email: string;
    group: string;
}

interface Skill {
    name: string;
    checked: boolean;
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
};

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
    width: '100%', 
}));

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const Vacancies: React.FC<Props> = () => {
    const [selectedFilter, setSelectedFilter] = useState<string>('Без опыта работы');
    const [skills, setSkills] = useState<Skill[]>([]);
    const [savedSkills, setSavedSkills] = useState<string[]>([]); 
    const [open, setOpen] = React.useState(false);
    const [groupedSkills, setGroupedSkills] = useState<Skill[][]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const token = Cookies.get('user_id');
    const API = "http://localhost:8000";
    const [openSkillsModal, setOpenSkillsModal] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formDateStart, setFormDateStart] = React.useState<Dayjs | null>(null);
    const [formDateEndSelection, setFormDateEndSelection] = React.useState<Dayjs | null>(null);

    const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormName(e.target.value);
    };

    const handleFormDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormDescription(e.target.value);
    };

    const handleFilterClick = (filter: string) => {
        setSelectedFilter(filter);
    };
    const handleClose = () => {
        setSavedSkills([]);
        setFormName('');
        setFormDescription('');
        setFormDateStart(null);
        setFormDateEndSelection(null);
        setOpen(false);
        console.log(formDateStart);
    }

    const handleOpenSkillsModal = () => setOpenSkillsModal(true);
    const handleCloseSkillsModal = () => setOpenSkillsModal(false);

    const handleOpen = () => {
        setOpen(true);
        console.log(groupedSkills)
    }
    const handleSaveSkills = () => {
        const selectedSkills: string[] = [];
        groupedSkills.forEach((group) => {
          group.forEach((skill) => {
            if (skill.checked) {
              selectedSkills.push(skill.name);
            }
          });
        });
        console.log(groupedSkills);
        setSavedSkills(selectedSkills);
        console.log("Сохраненные навыки:", selectedSkills);
        handleCloseSkillsModal();
    };

    const handleSkillCheck = (groupIndex: number, skillIndex: number) => {
        const updatedSkills = [...groupedSkills]; 
        updatedSkills[groupIndex][skillIndex].checked = !updatedSkills[groupIndex][skillIndex].checked;
        setGroupedSkills(updatedSkills);
    };

    const handleAddInternship = () => {
        console.log(formDateStart);
        const sendData = async () => {
            try {
                const response = await axios.post(
                    API + '/auth/add_internship', 
                    {
                        name: formName,
                        description: formDescription,
                        date_start: dayjs(formDateStart).format('YYYY-MM-DD'),
                        date_end_selection: dayjs(formDateEndSelection).format('YYYY-MM-DD'),
                        skills: savedSkills,
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
        console.log(dayjs(formDateStart).format('YYYY-MM-DD'));
        sendData();
        handleClose();
        setForceUpdate(forceUpdate + 1);
        console.log(forceUpdate);
    }

    let content: JSX.Element;

    useEffect(() => {
        const getData = async () => {
            try {
                if (token) {
                    const skillsResponse = await axios.get(`${API}/auth/get_skills`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${token}`
                        }
                    });
                    const skillsData = skillsResponse.data.skills;
                    setSkills(skillsData);
                    const groupedSkillsData = [];
                    for (let i = 0; i < skillsData.length; i += 10) {
                        groupedSkillsData.push(skillsData.slice(i, i + 10));
                    }
                    setGroupedSkills(groupedSkillsData);
    
                    const userResponse = await axios.get(`${API}/auth/get_user`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Token ${token}`
                        }
                    });
                    console.log(userResponse.data)
                    setUserInfo(userResponse.data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        getData();
    }, []);



    return (
        <div>
            <div className="flex p-4 justify-center items-center px-16 w-full text-center bg-green-100 max-md:px-5 max-md:mt-10 max-md:max-w-full">
                <div className="flex flex-col w-full max-w-[1110px] max-md:max-w-full">
                    <div className="text-4xl font-semibold leading-10 text-neutral-600 max-md:max-w-full">
                        Стажировки
                    </div>
                </div>
            </div>
        
            {userInfo?.group == "candidates" ? <div></div> : 
                <div>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button onClick={handleOpen} variant="contained" color="success" sx={{ width: '50%', mt: 2 }}>
                            Создать новую стажировку
                        </Button>
                    </Grid>
                   
                    <Modal open={open} onClose={handleClose}>
                        <Box sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        bgcolor: 'background.paper', 
                        boxShadow: 24, 
                        p: 4 
                        }}>
                        {/* ... Содержимое главного модального окна ... */}
                        <div className="text-4xl tracking-tighter">Создание стажировки</div>
                        <TextField
                            label="Название стажировки"
                            fullWidth
                            value={formName}
                            onChange={handleFormNameChange}
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            label="Описание стажировки"
                            fullWidth
                            value={formDescription}
                            onChange={handleFormDescriptionChange}
                            margin="normal"
                            variant="outlined"
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div className="text-xl tracking-tighter">Начало стажировки</div>
                            </Grid>
                            <Grid item xs={8}>
                                <DatePicker 
                                        value={formDateStart}
                                        onChange={(newFormDateStart) => setFormDateStart(newFormDateStart)}
                                        label={'День, месяц, год'}
                                        sx={{ width: '100%' }} 
                                />
                            </Grid>
                            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <div className="text-xl tracking-tighter">Дата конца отбора</div>
                            </Grid>
                            <Grid item xs={8}>
                                <DatePicker value={formDateEndSelection} 
                                onChange={(newFormDateEndSelection) => setFormDateEndSelection(newFormDateEndSelection)}
                                label={'День, месяц, год'}
                                sx={{ width: '100%' }} />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ marginTop: 1 }}>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button onClick={handleOpenSkillsModal} variant="contained" color="success" sx={{ width: '50%' }}>
                                    Выбрать навыки
                                </Button>
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button onClick={handleAddInternship} variant="contained" color="success" sx={{ width: '50%' }} >
                                    Создать стажировку
                                </Button>
                            </Grid>
                        </Grid>
                        
                        {/* Кнопка для открытия модального окна с выбором навыков */}
                        
                        {/* Модальное окно с выбором навыков */}
                        <Modal open={openSkillsModal} onClose={handleCloseSkillsModal}>
                            <Box sx={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%)', 
                            bgcolor: 'background.paper', 
                            boxShadow: 24, 
                            p: 4 
                            }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Выберите навыки
                            </Typography>
                            <Grid container spacing={2} sx={{ marginTop: 1 }}>
                            {groupedSkills.map((group, groupIndex) => (
                                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <PopupState key={groupIndex} variant="popover" popupId={`popup-${groupIndex}`}>
                                        {(popupState) => (
                                                <Container>
                                                    <Button variant="outlined" color="success" {...bindTrigger(popupState)} sx={{ mb: 1, width: '100%' }}> 
                                                        <div className="text-base tracking-tight font-semibold">
                                                            {groupIndex + 1}
                                                        </div>
                                                    </Button>
                                                    <Menu {...bindMenu(popupState)}>
                                                        {group.map((skill, skillIndex) => (
                                                        <MenuItem key={skillIndex} disableRipple>
                                                            <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                checked={skill.checked}
                                                                onChange={() => handleSkillCheck(groupIndex, skillIndex)}
                                                                />
                                                            }
                                                            label={skill.name}
                                                            />
                                                        </MenuItem>
                                                        ))}
                                                    </Menu>
                                                </Container>
                                        )}
                                        </PopupState>
                                </Grid>
                            ))}
                            </Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button onClick={handleSaveSkills} sx={{ mt: 2, width: '100%' }} variant="contained" color="success"> 
                                    Сохранить
                                </Button>
                            </Grid>
                            
                            </Box>
                        </Modal>
                        </Box>
                    </Modal>
                </div>
               }
            <div>
                <VacanciesList userInfo={userInfo} update={forceUpdate}/>
            </div>
        </div>
       
        
    );
}

export default Vacancies;