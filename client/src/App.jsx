import React from 'react';
import Forms from './Components/Forms';
import Translate from './Components/Translate'
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './Components/AuthProvider';

function App() {
    const {isAuthenticated} = useAuth();
    return (
        <Routes>
            <Route path='/login' element={<Forms/>}/>
            <Route path='/translate' element={ isAuthenticated ? <Translate/> : <Navigate to="/login" />} />
            <Route path='/' element={<Navigate to="/login"/>} />
        </Routes>
    );
}

export default App;
