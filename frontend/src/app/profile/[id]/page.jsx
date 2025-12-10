"use client";

import styles from "./page.module.css";
import { useEffect, useState, use } from "react";
import Loading from "../../components/loading/loading";
import Navbar from "../../components/navbar/Navbar";
import { FaRegPaperPlane } from "react-icons/fa6";
import Link from "next/link";
import { RiTodoLine } from "react-icons/ri";
import { IoCalendarNumber } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

export default function Home({ params }) {
    const paramsURL = use(params);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState({})

    useEffect(() => {
        const getLogged = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`+paramsURL.id, {credentials: "include"})
                const data = await response.json();
                if (!data.success) {
                    window.location.href = data.code == "INVALID_TOKEN" ? "/register" : "/not-found";
                }
                data.data = data.data[0];
                setUserData(data.data);
            } catch(error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        };
        getLogged();
    }, []);

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
                inProfile={true}
                onNavigate={() => setLoading(true)}
            />
            <div className={styles.profile}>
                <div className={styles.containerPicture}>
                    <img className={styles.userPicture} src={avatarSrc} alt="user profile picture"/>
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
                        <span>{userData.name + " " + userData.firstname}</span>
                    </div>
                </div>
                {userData.description && userData.description.trim().length > 0 && (
                    <div className={styles.description}>
                        <textarea name="description" id="description" value={userData.description || ""} onChange={() => {}} readOnly/>
                    </div>
                )}
                <a href={userData.contactLink || ""} target="_blank" className={styles.contactButton}>
                    <FaRegPaperPlane/>
                    <span>Contact</span>
                </a>
                {userData.userTodos.length > 0 && (
                    <div className={styles.todosContainer}>
                        <h2 className={styles.titleSharedTodos}>Shared todo</h2>
                        {userData.userTodos.map((todo, index) => {
                            return (
                                <Link key={index} className={styles.todoCard} onNavigate={(e) => {setLoading(true)}} href={"../tasks/"+todo.id}>
                                    <div className={styles.containerIcon}>
                                        {avatarSrc && avatarSrc !== "/default-avatar.png" ?                                    
                                            <div className={styles.containerPicture}>
                                                <img className={styles.userPicture} src={avatarSrc} alt="user profile picture"/>
                                            </div>
                                        :                                     
                                            <RiTodoLine className={styles.iconCard}/>
                                        }
                                        <div className={styles.categories}>
                                            {todo.categories.length > 0 ? 
                                                <h4 className={styles.titleCategories}>Categories :</h4>
                                            : null}
                                            {todo.categories.length > 0 ?
                                                todo.categories.map((todoCategory, indexCategory) => (
                                                    <span className={styles.categoriesName} key={index+" "+indexCategory}>{todoCategory + (indexCategory < todo.categories.length-1 ? " / " : "")}</span>
                                                ))
                                            : null}
                                        </div>
                                    </div>
                                    <div className={styles.containerText}>
                                        <div className={styles.createdAt}>
                                            <IoCalendarNumber className={styles.iconCalendar}/>
                                            <span className={styles.createdAtSpan}>{todo.created_at.slice(0, 10)}</span>
                                        </div>
                                        <h3 className={styles.todoCardTitle}>{todo.title}</h3>
                                        <p className={styles.todoCardDescription}>{todo.description}</p>
                                        {todo.rating_count > 0 ?                                    
                                            <div className={styles.note}>
                                                <span className={styles.noteSpan}>{todo.average_rating}</span>
                                                <FaStar className={styles.iconStar}/>
                                            </div>
                                        : <></>}
                                        <div className={styles.tagsContainer}>
                                            {todo.tags && todo.tags.map((tag, index) => (
                                                <div key={"tag"+index} className={styles.tag}>
                                                    <span className={styles.textTag}>{"#"+tag}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}  