import React, { useState, useEffect } from 'react';
import { Container, Card } from '@mui/material';
import axios from 'axios';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface Internship {
    id: number;
    name: string;
    description: string;
    date_start: Date;
    date_end_selection: Date;
    skills: string[];
    created_at: string;
}


interface VacancyCardProps {
    vacancy: Internship;
    
}
const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy }) => {
    let navigate: NavigateFunction = useNavigate();
    const handleClick = () => {
        navigate("/internship/" + vacancy.id.toString())
        console.log(vacancy.skills);
    };

    return (
            <div className="px-6 py-7 bg-white rounded-xl max-md:px-5 max-md:max-w-full border-4 border-slate-400 m-3" onClick={handleClick}>
                <div className="px-6 pt-5 pb-2.5 bg-white rounded-xl max-md:px-5 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                        <div className="flex flex-col w-[78%] max-md:ml-0 max-md:w-full">
                            <div className="flex flex-col grow font-semibold text-black leading-[150%] max-md:mt-8">
                                <div className="text-4xl tracking-tighter">{vacancy.name}</div>
                                <div className="mt-3.5 text-xl tracking-tight text-black text-opacity-80">
                                    {vacancy.description}
                                </div>
                                <div className="mt-3 text-base tracking-tight">
                                    <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                        {vacancy.skills.map((skill) => (
                                            <div key={skill} style={{ display: 'inline-block' }}> 
                                                <Card 
                                                    variant="outlined" 
                                                    sx={{ 
                                                        mr: 1, 
                                                        bgcolor: "#F5F7FA",
                                                        boxShadow: 'none', // Убираем тень у карточки
                                                    }}
                                                >
                                                    <p style={{ margin: '0.5rem', padding: 0 }}>{skill}</p>  {/* Задаем отступы тексту */}
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                
                            </div>
                        </div>
                        <div className="flex flex-col ml-5 w-[22%] max-md:ml-0 max-md:w-full">
                            <div className="flex flex-col max-md:mt-10">
                                <div className="mt-1 text-base"> Начало стажировки: </div>
                                <div className="mt-1 text-xl tracking-tight text-black text-opacity-80 bg-green-300 rounded-3xl text-center">
                                    {vacancy.date_start.toString()}
                                </div>
                                <div className="mt-1 text-base"> Конец отбора: </div>
                                <div className="mt-1 text-xl tracking-tight text-black text-opacity-80 bg-indigo-50 rounded-3xl text-center" >
                                    {vacancy.date_end_selection.toString()}
                                </div>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default VacancyCard;