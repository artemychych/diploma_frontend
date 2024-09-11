import React, { useState, useEffect, useRef } from 'react';
import { Container, List, Pagination, TextField, Button } from '@mui/material';
import VacancyCard from './cards/VacancyCard';
import axios from 'axios';
import Cookies from 'js-cookie';



interface Internship {
    id: number;
    name: string;
    description: string;
    date_start: Date;
    date_end_selection: Date;
    skills: string[];
    created_at: string;
}

interface UserInfo {
    username: string;
    email: string;
    group: string;
}

interface Props {
    userInfo?: UserInfo;
    update?: number;
}

const VacanciesList: React.FC<Props> = ({ userInfo, update }) => {
    const [updateStatus, setUpdateStatus] = useState(update);
    const [internships, setInternships] = useState<Internship[]>([]);
    const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [internshipsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState(""); 
    const API = "http://localhost:8000"
    const token = Cookies.get('user_id'); 
    const [favoriteInternshipIds, setFavoriteInternshipIds] = useState<number[]>([]); // Пример массива с ID избранных стажировок
    const [showFavorites, setShowFavorites] = useState(false); // Состояние для переключения отображения

    useEffect(() => {
        console.log(performance.now());
        const getData = async () => {
            try {
                const response = await axios.get(API + "/auth/get_internships", {
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Token ${token}`
                    }
                  });
                setInternships(response.data.internships);
                setFilteredInternships(response.data.internships);
              } catch (error) {
                console.error('Error:', error);
              }
        }
        
        
        const getIds = async () => {
            try {
                const response = await axios.get(API + "/auth/get_company_internships_ids", {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                    });
                console.log(response.data.internships)
                setFavoriteInternshipIds(response.data.internships); // Установите массив ID 
                } catch (error) {
                console.error('Error:', error);
                }
        }
        getIds();
        getData();
        console.log(update);
        }, [updateStatus]);


    useEffect(() => {
        // Фильтрация стажировок при изменении searchTerm
        const filtered = internships.filter(internship => 
            internship.name.toLowerCase().includes(searchTerm.toLowerCase()) 
        );
        setFilteredInternships(filtered);
        setCurrentPage(1); // Сброс страницы на первую при новой фильтрации
    }, [searchTerm, internships]); // Зависимости useEffect 

    useEffect(() => {
        // Фильтрация стажировок при изменении searchTerm и showFavorites
        const filtered = internships.filter(internship => 
            internship.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (showFavorites ? favoriteInternshipIds.includes(internship.id) : true) // Фильтрация по избранным
        );
        setFilteredInternships(filtered);
        setCurrentPage(1); 
    }, [searchTerm, internships, favoriteInternshipIds, showFavorites]); 

    const indexOfLastInternship = currentPage * internshipsPerPage;
    const indexOfFirstInternship = indexOfLastInternship - internshipsPerPage;
    const currentInternships = filteredInternships.slice(indexOfFirstInternship, indexOfLastInternship);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };    

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };
    

    return (
        
        <div className='mx-36'>
            <div style={{ display: 'flex', justifyContent: 'center' }}> 
                <TextField 
                    label="Поиск по названию стажировки" 
                    variant="outlined" 
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ marginBottom: 3, width: '60%', mt: 3 }}
                />
            </div>
            {
                userInfo?.group === "companies" ? <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" onClick={() => setShowFavorites(false)}>
                    Все стажировки
                </Button>
                <Button variant="contained" color="primary" onClick={() => setShowFavorites(true)}>
                    Мои стажировки
                </Button>
            </div> : <div></div>
            }
            
            <List>
                {currentInternships.map((vacancy, index) => (
                    <VacancyCard key={vacancy.id} vacancy={vacancy} />
                ))}
            </List>
            <Pagination 
                count={Math.ceil(filteredInternships.length / internshipsPerPage)} // Пагинация по отфильтрованным 
                page={currentPage} 
                onChange={handleChangePage} 
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}
            />
        </div>
        
    );
}

export default VacanciesList;