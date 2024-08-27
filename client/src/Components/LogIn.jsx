import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const LogIn = ({ toggleForm }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault(); // It is used to Prevent the form from submitting the default way
        axios({
            method: 'post',
            url: 'http://localhost:3000/api/login',
            data: { username: username, password: password }
        }).then(response => {
            localStorage.setItem('token', response.data.token);
            login();
            navigate('/translate');
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <div className="form-container">
            <h2>Account Login</h2>
            <form onSubmit={handleClick}>
                <div className="input-group">
                    <input
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        placeholder="Username"
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="Password"
                        required
                    />
                </div>
                <button type="submit" className="btn">SIGN IN</button>
            </form>
            <div className="links">
                <h3>
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>
                        Don't have an account? Sign Up
                    </a>
                </h3>
            </div>
        </div>
    );
};

export default LogIn;
