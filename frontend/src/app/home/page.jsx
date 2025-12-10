"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Loading from "../components/loading/loading";
import Navbar from "../components/navbar/Navbar";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import { RiTodoLine } from "react-icons/ri";
import { IoCalendarNumber } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [todoData, setTodoData] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const getLogged = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sharedTodos`, {credentials: "include"})
                const data = await response.json();
                setTodoData(data.data);

                if (!data.success && data.code == "INVALID_TOKEN") {
                    window.location.href = "/register";
                }
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

    return (
        <div className={styles.body}>
            <Navbar
                className={styles.navBar}
                title="Todo Feed"
                infeed={true}
                onNavigate={() => setLoading(true)}
            />
            <div className={styles.searchBar}>
                <IoIosSearch className={styles.iconSearch}/>
                <input className={styles.inputSearch} type="text" placeholder="Search by title, description, user, category or tag"
                    onChange={(e) => {setSearch(e.target.value)}}/>
            </div>
            <div className={styles.todosContainer}>
                {todoData.map((todo, index) => {
                    const avatarSrc = todo.photo && todo.photo !== "/default-avatar.png" 
                        ? todo.photo
                        : "/default-avatar.png";
                    const searchLower = search.toLowerCase();
                    if (!search || (search && (todo.title.toLowerCase().trim().includes(searchLower) || todo.description.toLowerCase().trim().includes(searchLower)) || todo.firstname.toLowerCase().trim().includes(searchLower) || todo.name.toLowerCase().trim().includes(searchLower)) || (todo.categories && todo.categories.some((cat) => cat.toLowerCase().trim() == searchLower.trim())) || (todo.tags && todo.tags.some((tag) => tag.toLowerCase().trim() == searchLower.trim()))) {
                        return (
                            <Link key={index} className={styles.todoCard} onNavigate={(e) => {setLoading(true)}} href={"./tasks/"+todo.id}>
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
                                    <span className={styles.name}>{"By " + todo.firstname + " " + todo.name}</span>
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
                    }
                })}
                {todoData.length === 0 ? 
                    <p className={styles.noTodoShared}>No todolist shared</p>
                : null}
            </div>
        </div>
    )
}