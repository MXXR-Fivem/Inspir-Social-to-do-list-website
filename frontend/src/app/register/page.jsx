"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { IoIosMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import Loading from "../components/loading/loading";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
    const [login, setLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userData, setUserData] = useState({email: "", name: "", firstname: "", password: "", confirmPassword: ""});
    const [showPassword, setshowPassword] = useState(false);

    useEffect(() => {
        const getUserAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, { credentials: "include" });
                const data = await response.json();
                if (data.success) {
                    window.location.href = "./home";
                }
            } catch(error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        getUserAuth();
    }, [])

    const onSubmit = async(e) => {
        e.preventDefault();
        setError("");
        if (!login && userData.password !== userData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/` + (login ? "login" : "register"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                credentials: "include",
                redirect: "follow",
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = "/home";
            } else {
                setError(data.message);
            }
        } catch(error) {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const changeUserData = (e) => {
        const {name, value} = e.target;
        setUserData((u) => ({...u, [name]: value}));
        setError(false);
    }

    if (loading) {
        return <Loading/>
    }

    return (
        <form onSubmit={onSubmit} className={styles.body}>
            {login ? (
                <div>
                    <h1 className={styles.h1}>
                        <span>
                            Hey,
                        </span>
                        <span>
                            Welcome Back
                        </span>
                    </h1>
                    <div className={styles.containerInputs}>
                        <div className={styles.inputContent}>
                            <IoIosMail className={styles.icon}/>
                            <input type="email" placeholder="Email" id="email" name="email" value = {userData.email || ""} onChange = {(e) => changeUserData(e)} autoComplete="email" required/>
                        </div>
                        <div className={styles.inputContent}>
                            <RiLockPasswordFill className={styles.icon}/>
                            <input type={showPassword ? "text" : "password"} placeholder="Password" id="password" name="password" value = {userData.password || ""} onChange = {(e) => changeUserData(e)} autoComplete="current-password" required/>
                            {showPassword ?
                                <FaEye className={styles.eye} onClick = {() => {setshowPassword(false)}}/>
                            : 
                                <FaEyeSlash className={styles.eye} onClick = {() => {setshowPassword(true)}}/>
                            }
                        </div >
                        <div className={styles.inputContent}>
                            <input type="submit" id="submit" value="Login"/>
                        </div>
                        <span className={styles.errorMessage}>{error}</span>
                        <a className={styles.switchText}>First visit ? <button className={styles.switchBtn} onClick={() => {setLogin(!login), setError("")}}>Create an account</button></a>
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className={styles.h1}>
                        <span>
                            Register
                        </span>
                    </h1>
                    <div className={styles.containerInputs}>
                        <div className={styles.inputContent}>
                            <IoIosMail className={styles.icon}/>
                            <input type="email" placeholder="Email" id="email" name="email" value = {userData.email || ""} onChange = {(e) => changeUserData(e)} autoComplete="email" required/>
                        </div>
                        <div className={styles.inputContent}>
                            <ImProfile className={styles.icon}/>
                            <input type="firstname" placeholder="Firstname" id="firstname" name="firstname" value = {userData.firstname || ""} onChange = {(e) => changeUserData(e)} autoComplete="given-name" required/>
                        </div>    
                        <div className={styles.inputContent}>
                            <ImProfile className={styles.icon}/>
                            <input type="lastname" placeholder="Lastname" id="lastname" name="name" value = {userData.name || ""} onChange = {(e) => changeUserData(e)} autoComplete="family-name" required/>
                        </div>                      
                        <div className={styles.inputContent}>
                            <RiLockPasswordFill className={styles.icon}/>
                            <input type={showPassword ? "text" : "password"} placeholder="Password" id="password" name="password" value = {userData.password || ""} onChange = {(e) => changeUserData(e)} autoComplete="new-password" required/>
                            {showPassword ?
                                <FaEye className={styles.eye} onClick = {() => {setshowPassword(false)}}/>
                            : 
                                <FaEyeSlash className={styles.eye} onClick = {() => {setshowPassword(true)}}/>
                            }
                        </div>
                        <div className={styles.inputContent}>
                            <RiLockPasswordFill className={styles.icon}/>
                            <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" id="confirmPassword" name="confirmPassword" value = {userData.confirmPassword || ""} onChange = {(e) => changeUserData(e)} autoComplete="new-password" required/>                     </div>
                        <div className={styles.inputContent}>
                            <input type="submit" id="submit" value="Login"/>
                        </div>
                        <span className={styles.errorMessage}>{error}</span>
                        <a className={styles.switchText}>Already member ? <button className={styles.switchBtn} onClick={() => {setLogin(!login), setError("")}}>Login</button></a>
                    </div>
                </div>
            )}
        </form>
    );
};