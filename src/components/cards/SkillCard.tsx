import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import axios from 'axios';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface Skill {
    id: number;
    name: string;
    description: string;
}

interface SkillCardProps {
    skill: Skill;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
    let navigate: NavigateFunction = useNavigate();

    const handleClick = () => {
        navigate("/test/" + String(skill.id));
    };

    return (
        <div className='' onClick={handleClick}>
            <div className="px-6 py-7 bg-white rounded-xl max-md:px-5 max-md:max-w-full border-4 border-slate-400 m-3">
                <div className="px-6 pt-5 pb-2.5 bg-white rounded-xl max-md:px-5 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                        <div className="flex flex-col w-[78%] max-md:ml-0 max-md:w-full">
                            <div className="flex flex-col grow font-semibold text-black leading-[150%] max-md:mt-8">
                            <div className="text-4xl tracking-tighter">{skill.name}</div>
                            <div className="flex flex-row font-semibold text-black "></div>
                                <div className=" text-2xl ">
                                    Отправить до 22 Мая
                                </div>
                                <div className=" text-xl  text-black text-opacity-80 text-ellipsis"> 
                                    Активно  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SkillCard;