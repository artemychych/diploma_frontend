import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import VacancyPage from './pages/VacancyPage';
import TestPage from './pages/TestPage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';
import CompanyPage from './pages/CompanyPage';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />}/>
            <Route path="/registration" element={<RegistrationPage />} />
            <Route path="/main/:page" element={<MainPage />} />
            <Route path="/internship/:id" element={<VacancyPage />}/>
            <Route path="/test/:id" element={<TestPage />} />
            <Route path="/company/:id" element={<CompanyPage />}/>
          </Routes>
      </BrowserRouter>
    </LocalizationProvider>
    
  );
}

export default App;