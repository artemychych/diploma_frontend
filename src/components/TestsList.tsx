import React, { useState, useEffect } from 'react';
import { Container, List } from '@mui/material';
import VacancyCard from './cards/VacancyCard';
import axios from 'axios';
import CompanyCard from './cards/CompanyCard';
import SkillCard from './cards/SkillCard';

interface Props {
    filter: string;
}

interface Skill {
    id: number;
    name: string;
    description: string;
}


interface Company {
    id: number;
    name: string;
    description: string;
    address: string;
    email: string;
}

const TestsList: React.FC = () => {
    const [tests, setTests] = useState<Skill[]>([]);
    const API = "http://localhost:8000"
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(API + "/skill");
                setTests(response.data.skills);
              } catch (error) {
                console.error('Error:', error);
              }
        }
        getData();
    }, []);
    return (
        <div className='mx-16'>
            <div className="flex flex-wrap">
                {tests.map((test) => (
                    <SkillCard key={test.id} skill={test} />
                ))}
            </div>
            
        </div>
    );
}

export default TestsList;