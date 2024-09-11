import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import CompaniesList from './CompaniesList';
type Props = {}

const Companies: React.FC<Props> = () => {
    return (
        <div>
            <div className="flex justify-center items-center px-16 w-full text-center bg-green-100 max-md:px-5 max-md:mt-10 max-md:max-w-full">
                <div className="flex flex-col w-full max-w-[1110px] max-md:max-w-full">
                    <div className="text-4xl font-semibold leading-10 text-neutral-600 max-md:max-w-full">
                        Компании
                    </div>
                    <div>
                        <CompaniesList/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Companies;