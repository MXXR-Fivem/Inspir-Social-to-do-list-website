"use client";

import styles from "./page.module.css";
import { useEffect, useState, useRef } from "react";
import Loading from "../components/loading/loading";
import Navbar from "../components/navbar/Navbar";
import { FaRegEdit } from "react-icons/fa";

export default function Home() {
    const fileInputRef = useRef();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [userData, setUserData] = useState({})

    useEffect(() => {
        const getLogged = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {credentials: "include"})
                const data = await response.json();
                if (!data.success && data.code == "INVALID_TOKEN") {
                    window.location.href = "/register";
                }
                data.data.user_id = data.data.id
                setUserData(data.data);
            } catch(error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        };
        getLogged();
    }, []);

    const saveUserData = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setLoading(true);
        try {
            const fd = new FormData();
            for (const [key, value] of Object.entries(userData)) {
                if (key === "file") continue;
                if (value === undefined || value === null) continue;
                const val = typeof value === "object" ? JSON.stringify(value) : String(value);
                fd.append(key, val);
            }
            if (userData.file instanceof File) {
                fd.append("avatar", userData.file, userData.file.name);
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/` + userData.user_id, {
                method: "PUT",
                credentials: "include",
                body: fd,
            });
            const data = await response.json();
            setUserData(data.data);
            if (response.status == 413) {
                alert("Your image is too large !");
            }
        } catch(error) {
            console.log(error);
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    }

    const updateUserData = (e) => {
        if (e.target.files) {
            setUserData((u) => ({...u, file: e.target.files[0]}))
        } else {
            const {name, value} = e.target;
            setUserData((u) => ({...u, [name]: value}));
        }
    }

    if (loading) {
        return <Loading/>;
    }

    const avatarSrc = userData?.photo && userData.photo !== "/default-avatar.png" 
        ? userData.photo
        : "/default-avatar.png";

    const title = "Join Inspir on " + userData.created_at.slice(0, 10);
    return (
        <div className={styles.body}>
            <Navbar
                className={styles.navBar}
                title="Profile"
                inMyProfile={true}
                onNavigate={() => setLoading(true)}
            />
            <form onSubmit={saveUserData} className={styles.profile}>
                <input onChange={updateUserData} multiple={false} ref={fileInputRef} type="file" hidden/>
                <div className={styles.containerPicture}>
                    <img className={styles.userPicture} src={avatarSrc} alt="user profile picture"/>
                    <button type="button" onClick={(e)=>{ e.preventDefault(); fileInputRef.current.click(); }} className={styles.editWrapper}>
                        <FaRegEdit className={styles.editIcon}/>
                    </button>
                </div>
                <div className={styles.badgesContainer}>
                    {userData.ended_tasks >= 10 && (
                        <img
                            src={userData.ended_tasks >= 100 ? "/task100.png" : userData.ended_tasks >= 50 ? "/tasks50.png" : "/tasks10.png"} 
                            alt="tasks badge"
                            title={userData.ended_tasks >= 100 ? "100 tasks completed - Gold badge" : userData.ended_tasks >= 50 ? "50 tasks completed - Silver badge" : "10 tasks completed - Bronze badge"}
                            className={styles.badge}
                        />
                    )}
                    {userData.ended_todos >= 1 && (
                        <img 
                            src={userData.ended_todos >= 100 ? "/todos100.png" : userData.ended_todos >= 10 ? "/todos10.png" : "/todos1.png"} 
                            alt="todos badge"
                            title={userData.ended_todos >= 100 ? "100 todos completed - Gold badge" : userData.ended_todos >= 10 ? "10 todos completed - Silver badge" : "1 todo completed - Bronze badge"}
                            className={styles.badge}
                        />
                    )}
                </div>
                <div className={styles.created_at}>
                    {[...title].map((character, index) => (
                        <span key={index} className={styles.created_atCharacters} style={{animationDelay: `${index * 0.06}s`}}>{character}</span>
                    ))}
                </div>
                <div className={styles.containerName}>
                    <div className={styles.name}>
                        <label htmlFor="name">Lastname</label>
                        <input type="text" name="name" id="name" value={userData.name || ""} onChange={(e) => updateUserData(e)} required/>
                    </div>
                    <div className={styles.firstname}>
                        <label htmlFor="firstname">Firstname</label>
                        <input type="text" name="firstname" id="firstname" value={userData.firstname || ""} onChange={(e) => updateUserData(e)} required/>
                    </div>
                </div>
                <div className={styles.description}>
                    <label htmlFor="description">Description</label>
                    <textarea name="description" id="description" value={userData.description || ""} onChange={(e) => updateUserData(e)}/>
                </div>
                <div className={styles.contactLink}>
                    <label htmlFor="firstname">Contact link</label>
                    <input type="text" name="contactLink" id="contactLink" value={userData.contactLink || ""} onChange={(e) => updateUserData(e)}/>
                </div>
                <input className={styles.submit} type="submit" value="Save" disabled={submitting}/>
            </form>
        </div>
    )
}