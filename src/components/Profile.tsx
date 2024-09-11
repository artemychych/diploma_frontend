import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
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
    CardContent,
    Card,
  } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import SkillCard from './cards/SkillCard';

let config = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': ''
  }
};


type Props = {}

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

interface UserInfo {
    username: string;
    email: string;
    group: string;
}


const Profile: React.FC<Props> = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [savedSkills, setSavedSkills] = useState<string[]>([]); 
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const API = "http://localhost:8000"
    const [open, setOpen] = React.useState(false);
    const [groupedSkills, setGroupedSkills] = useState<Skill[][]>([]);
    const token = Cookies.get('user_id');
    const handleClose = () => setOpen(false);
    
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
        const sendData = async () => {
            try {
                const response = await axios.post(
                    API + '/auth/save_skills', 
                    JSON.stringify({ skills: selectedSkills }), // Явное преобразование 
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
        handleClose();
      };
    const handleSkillCheck = (groupIndex: number, skillIndex: number) => {
        const updatedSkills = [...groupedSkills]; 
        updatedSkills[groupIndex][skillIndex].checked = !updatedSkills[groupIndex][skillIndex].checked;
        setGroupedSkills(updatedSkills);
    };
    useEffect(() => {
        const getData = async () => {
            try {
                const token = Cookies.get('user_id');
                if (token != undefined) {
                    const response = await axios.get(API + '/auth/get_skills', {
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Token ${token}`
                        }
                      });
                    setSkills(response.data.skills);
                    console.log(response.data.skills);
                    setGroupedSkills([]);
                    for (let i = 0; i < response.data.skills.length; i += 10) { 
                        setGroupedSkills(previous => ([...previous, response.data.skills.slice(i, i + 10)])) 
                    }
                }
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

    return (
        <div className="flex flex-col items-center pb-20 bg-white">
            <Grid container spacing={2} sx={{ p: 2}}>
                <Grid item xs={4}>
                        <div className="mt-12 text-4xl font-semibold leading-10 text-center text-neutral-600 max-md:mt-10 max-md:max-w-full">
                            Данные пользователя:
                        </div>
                        <div className="flex gap-5 max-md:flex-col max-md:gap-0 mt-6 content-center justify-center">
                            <div className="flex flex-col ml-5 max-md:ml-0 max-md:w-full">
                                <div className="px-11 pt-6 pb-6 text-2xl font-semibold bg-green-100 text-neutral-800 max-md:px-5 max-md:mt-10 max-md:max-w-full">
                                    Логин: {userInfo?.username}
                                    <br />
                                    <span className="font-medium">Почта: {userInfo?.email}</span>
                                </div>
                            </div>
                        </div>
                    
                </Grid>
                <Grid item xs={8}>
                {userInfo?.group == "companies" ? <div></div> : 
                        <div>
                            <div className="mt-12 text-4xl font-semibold leading-10 text-center text-neutral-600 max-md:mt-10 max-md:max-w-full">
                                Навыки
                            </div>
                            <div>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button onClick={handleOpen} variant="contained" color="success" sx={{ width: '50%', mt: 2 }}>
                                        Выбрать навыки
                                    </Button>
                                </Grid>
                                <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                >
                                <Box sx={style}>
                                    <div>
                                        <Typography variant="h6" component="h2" gutterBottom>
                                            Выберите навыки
                                        </Typography>
                                        <Grid container spacing={2} sx={{ marginTop: 1 }}>
                                            {groupedSkills.map((group, groupIndex) => (
                                            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <PopupState variant="popover" popupId={`popup-${groupIndex}`}>
                                                {(popupState) => (
                                                    <React.Fragment>
                                                    <Button variant="outlined" color="success" {...bindTrigger(popupState)}>
                                                        Группа {groupIndex + 1}
                                                    </Button>
                                                    <Menu {...bindMenu(popupState)}>
                                                        {group.map((skill, skillIndex) => (
                                                        <MenuItem key={skillIndex} disableRipple> {/* disableRipple убирает эффект при клике */}
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
                                                    </React.Fragment>
                                                )}
                                                </PopupState>
                                                <br />
                                            </Grid>
                                            ))}
                                        </Grid>
                                    </div>
                                    <Button onClick={handleSaveSkills} sx={{ mt: 2, width: '100%' }} variant="contained" color="success"> 
                                            Сохранить
                                    </Button>
                                </Box>
                                </Modal>
                            </div>
                            
                            <Grid container spacing={2} sx={{ mt: 2}} >
                                {skills.map((skill) => (
                                    skill.checked == true ? <Grid item xs={4}>
                                            <Card sx={{ minWidth: 275, bgcolor: '#E8F5E9'}}>
                                                <CardContent>
                                                    <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                                                        <div className="text-xl font-semibold text-center text-neutral-600">
                                                            {skill.name}
                                                        </div>
                                                        
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                          </Grid> : null
                                ))}
                            </Grid>
                        </div>
                    }
                </Grid>
            </Grid>
        </div>
    );
}

export default Profile;