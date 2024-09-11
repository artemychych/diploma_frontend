import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { NavigateFunction, useNavigate, Link, useParams } from 'react-router-dom';
import { Button, Grid, Paper, Divider, Box, Card,
    CardHeader,
    CardContent,
    Typography,
    Chip,
    CardActions
  } from '@mui/material';
interface Company {
    name: string;
    email: string;
}

interface Internship {
    id: number;
    name: string;
    description: string;
}
const CompanyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<Company>();
    const [internships, setInternships] = useState<Internship[]>();
    const API = "http://localhost:8000";
    const token = Cookies.get('user_id');
    const [currentComponent, setCurrentComponent] = useState<string>('Default');
    let navigate: NavigateFunction = useNavigate();
    const handleButtonClick = (componentName: string) => {
        setCurrentComponent(componentName);
    };
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(API + "/auth/get_user_by_id/" + id?.toString(),  {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                    });
                setCompany(response.data);
                const internshipsResponse = await axios.get(API + "/auth/get_internships_by_company_id/" + id?.toString(),  {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                    });
                setInternships(internshipsResponse.data.internships)
              } catch (error) {
                console.error('Error:', error);
              }
        }
        getData();
    }, []);

    const logout = () => {
        Cookies.remove('user_id');
        navigate("/");
    };

    const handleCardClick = (internshipId: number) => {
        console.log(`Internship with ID ${internshipId} clicked`);
        
        navigate("/internship/" + internshipId.toString())
            
    };

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
            <Grid container spacing={2}>
                <Grid item xs={3}></Grid>
                <Grid item xs={6}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                            {company?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                            {company?.email}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3, fontSize: 20, fontWeight: 600}}>
                        <div>Стажировки компании</div>
                    </Grid>
                    
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                        {internships?.map((internship) => (
                            <Grid item xs={12} key={internship.id} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3 }}> 
                            <Card onClick={() => handleCardClick(internship.id)} style={{ margin: '20px', width: '100%', cursor: 'pointer' }}>
                                <CardContent>
                                <Typography variant="h5" component="h2">
                                    {internship.name}
                                </Typography>
                                <Typography color="textSecondary">
                                    {internship.description}
                                </Typography>
                                </CardContent>
                                <CardActions>
                                <Button size="small" onClick={() => handleCardClick(internship.id)}>Перейти к стажировке</Button>
                                </CardActions>
                            </Card>
                            </Grid>
                        ))}
                    </Grid>
                    
                    
                </Grid>
                <Grid item xs={3}></Grid>
            </Grid>
        </div>
    )
}

export default CompanyPage;