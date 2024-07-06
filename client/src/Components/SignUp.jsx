import React, { useState } from 'react';
import axios from 'axios';

const SignUp = ({ toggleForm }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleClick = (e) => {
        e.preventDefault(); // It is used to Prevent the form from submitting the default way
        axios({
            method: 'post',
            url: 'http://localhost:3000/api/register',
            data: { username: username, email: email, password: password }
        }).then(response => {
            console.log(response.data);
            alert("User Resgistered Successfull !!");
        }).catch(err => {
            console.log(err);
        });
    };

    return (
        <div className="form-container">
            <h2>Create Account</h2>
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
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Email"
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
                <button type="submit" className="btn">SIGN UP</button>
            </form>
            <div className="links">
                <h3>
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>
                        Already have an account? Log In
                    </a>
                </h3>
            </div>
        </div>
    );
};

export default SignUp;
