import React, { useState, useEffect } from 'react';
import { Container, List } from '@mui/material';
import VacancyCard from './cards/VacancyCard';
import axios from 'axios';
import CompanyCard from './cards/CompanyCard';
import Cookies from 'js-cookie';

interface Props {
    filter: string;
}

interface Company {
    id: number;
    name: string;
    email: string;
}

const VacanciesList: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const API = "http://localhost:8000"
    const token = Cookies.get('user_id');
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(API + "/auth/get_companies",  {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                    });
                setCompanies(response.data.companies);
              } catch (error) {
                console.error('Error:', error);
              }
        }
        getData();
    }, []);


    return (
        <div className='mx-36'>
            <List>
                {companies.map((company) => (
                    <CompanyCard key={company.name} company={company} />
                ))}
            </List>
        </div>
    );
}

export default VacanciesList;