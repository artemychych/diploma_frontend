import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography } from '@mui/material';
import TestsList from './TestsList';
import axios from 'axios';
import Cookies from 'js-cookie';

type Props = {}

interface UserInfo {
    name: string;
    status: string;
}

const Tests: React.FC<Props> = () => {
    const [info, setInfo] = useState<UserInfo[]>([])
    const API = "http://localhost:8000"
    useEffect(() => {
        const getData = async () => {
            try {
                const token = Cookies.get('user_id');
                if (token != undefined) {
                    const response = await axios.get(API + '/auth/get_user_results_status', {
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Token ${token}`
                        }
                      });
                    setInfo(response.data.results)
                    
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        getData();
      }, []);

    return (
            <div> 
                <Grid container spacing={2} sx={{ mt: 3}}>
                    {info.map((user, index) => (
                        <Grid item xs={12} key={index} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> 
                            <Card sx={{ boxShadow: 3, minWidth: 400}}>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                    {user.name} 
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Статус: {user.status}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
    );
}

export default Tests;