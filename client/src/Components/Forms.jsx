import React, { useState } from "react";
import SignUp from "./SignUp";
import LogIn from "./LogIn";

const Forms = () => {
    const [toggle, setToggle] = useState(true);

    const toggleForm = () => {
        setToggle(!toggle);
    };

    return <div>{toggle ? <SignUp toggleForm={toggleForm} /> : <LogIn toggleForm={toggleForm} />}</div>;
};

export default Forms;
