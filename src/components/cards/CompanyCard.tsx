import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import axios from 'axios';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface Company {
    id: number;
    name: string;
    email: string;
}

interface CompanyCardProps {
    company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
    let navigate: NavigateFunction = useNavigate();
    const handleClick = () => {
        navigate("/company/" + company.id.toString())
    };
    return (
            <div className="px-6 py-7 bg-white rounded-xl max-md:px-5 max-md:max-w-full border-4 border-slate-400 m-3" onClick={handleClick}>
                <div className="px-6 pt-5 pb-2.5 bg-white rounded-xl max-md:px-5 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                        <div className="flex flex-col w-[78%] max-md:ml-0 max-md:w-full">
                            <div className="text-4xl tracking-tighter">{company.name}</div>
                        </div>
                        <div className="flex flex-col ml-5 w-[22%] max-md:ml-0 max-md:w-full">
                            <div className="flex flex-col mt-12 max-md:mt-10">
                                
                                <div className="mt-3.5 text-xl tracking-tight text-black text-opacity-80 bg-indigo-50 rounded-3xl text-center" >
                                    {company.email}
                                </div>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default CompanyCard;