"use client";

import styles from "./page.module.css";
import { useEffect, useState, useRef } from "react";
import Loading from "../components/loading/loading";
import Navbar from "../components/navbar/Navbar";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import { RiTodoLine } from "react-icons/ri";
import { IoFilterSharp } from "react-icons/io5";
import { MdArrowDropDown } from "react-icons/md";
import { IoCalendarNumber } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { RxLapTimer } from "react-icons/rx";
import { LiaHourglassEndSolid } from "react-icons/lia";
import { FaCheck } from "react-icons/fa";

export default function Mytodos() {
    const [loading, setLoading] = useState(true);
    const [todoData, setTodoData] = useState([]);
    const [search, setSearch] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterFinished, setFilterFinished] = useState(false);
    const [filterLessOneHour, setFilterLessOneHour] = useState(false);
    const [filterExpired, setFilterExpired] = useState(false);
    const [filterOthers, setFilterOthers] = useState(false);
    const filterRef = useRef(null);

    useEffect(() => {
        const getLogged = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/todos`, {credentials: "include"})
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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterOpen && filterRef.current && !filterRef.current.contains(e.target)) {
                setFilterOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [filterOpen]);

    if (loading) {
        return <Loading/>;
    }

    return (
        <div className={styles.body}>
            <Navbar
                className={styles.navBar}
                title="My todos"
                inMyTodos={true}
                onNavigate={() => setLoading(true)}
            />
            <div className={styles.containerSearchAndFilter}>
                <div className={styles.searchBar}>
                    <IoIosSearch className={styles.iconSearch}/>
                    <input className={styles.inputSearch} type="text" placeholder="Search by title, description, user, category or tag"
                        onChange={(e) => {setSearch(e.target.value)}}/>
                </div>
                <div ref={filterRef} className={styles.filterContainer}>
                    <button className={styles.filterButton} onClick={() => setFilterOpen(!filterOpen)}>
                        <IoFilterSharp className={styles.filterIcon}/>
                        <span>Filter</span>
                        <MdArrowDropDown className={styles.arrowIcon}/>
                    </button>
                    {filterOpen && (
                        <div className={styles.filterMenu}>
                            <label className={styles.filterOption}>
                                <input 
                                    type="checkbox" 
                                    checked={filterOthers}
                                    onChange={() => setFilterOthers(!filterOthers)}
                                />
                                <span>Active</span>
                            </label>
                            <label className={styles.filterOption}>
                                <input 
                                    type="checkbox" 
                                    checked={filterFinished}
                                    onChange={() => setFilterFinished(!filterFinished)}
                                />
                                <span>Finished</span>
                            </label>
                            <label className={styles.filterOption}>
                                <input 
                                    type="checkbox" 
                                    checked={filterLessOneHour}
                                    onChange={() => setFilterLessOneHour(!filterLessOneHour)}
                                />
                                <span>Less than 1 hour</span>
                            </label>
                            <label className={styles.filterOption}>
                                <input 
                                    type="checkbox" 
                                    checked={filterExpired}
                                    onChange={() => setFilterExpired(!filterExpired)}
                                />
                                <span>Expired</span>
                            </label>
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.todosContainer}>
                {todoData && todoData.map((todo, index) => {
                    const searchLower = search.toLowerCase();
                    const matchesSearch = !search || (search && (todo.title.toLowerCase().trim().includes(searchLower) || todo.description.toLowerCase().trim().includes(searchLower) || (todo.categories && todo.categories.some((cat) => cat.toLowerCase().trim() == searchLower.trim())) || (todo.tags && todo.tags.some((tag) => tag.toLowerCase().trim() == searchLower))));
                    
                    const isFinished = todo.status === "done";
                    const isLessOneHour = todo.status !== "done" && todo.cron_passed && !todo.overTime;
                    const isExpired = todo.status !== "done" && todo.overTime;
                    const isOther = !isFinished && !isLessOneHour && !isExpired;
                    
                    const noFilterActive = !filterFinished && !filterLessOneHour && !filterExpired && !filterOthers;
                    const matchesFilter = noFilterActive || 
                        (filterFinished && isFinished) || 
                        (filterLessOneHour && isLessOneHour) || 
                        (filterExpired && isExpired) ||
                        (filterOthers && isOther);
                    
                    if (matchesSearch && matchesFilter) {
                        return (
                            <Link key={index} className={styles.todoCard} onNavigate={(e) => {setLoading(true)}} href={"./tasks/"+todo.id}>
                                <div className={styles.containerIcon}>
                                    <RiTodoLine className={styles.iconCard}/>
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
                                        <span className={styles.createdAtSpan}>{todo.created_at.slice(0, 10) + (todo.due_time !== null ? (" to " + todo.due_time.slice(0, 16).replace("T", " at ")) : "")}</span>
                                    </div>
                                    <h3 className={styles.todoCardTitle}>{todo.title}</h3>
                                    <p className={styles.todoCardDescription}>{todo.description}</p>
                                    {todo.rating_count > 0 ?                                    
                                        <div className={styles.note}>
                                            <span className={styles.noteSpan}>{todo.average_rating}</span>
                                            <FaStar className={styles.iconStar}/>
                                        </div>
                                    : <></>}
                                    {todo.tasksRate > 0 ?                                
                                        <div className={styles.progressBarContainer}>
                                            <div className={styles.backgroundProgressBar}>
                                                <div style={{width: (todo.tasksRate+"%"), backgroundColor: todo.tasksRate > 65 ? "rgba(73, 202, 61, 0.64)" : todo.tasksRate > 40 ? "rgba(255, 177, 59, 0.72)" : "rgba(250, 84, 84, 0.463)"}} className={styles.contentProgressBar}/>
                                                <span className={styles.textProgresBar}>{todo.tasksRate+"%"}</span>
                                            </div>
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
                                {isExpired ? 
                                    <div className={styles.overTimeWrapper}>
                                        <RxLapTimer className={styles.overTimeIcon}/>
                                    </div>
                                : isLessOneHour ?
                                    <div className={styles.oneHourRemainingWrapper}>
                                        <LiaHourglassEndSolid className={styles.oneHourRemainingIcon}/>
                                    </div>
                                : isFinished ?
                                    <div className={styles.endedTaskWrapper}>
                                        <FaCheck className={styles.endedTaskIcon}/>
                                    </div>                                   
                                : <></>}
                            </Link>
                        )
                    }
                })}
                {todoData.length === 0 ? 
                    <p className={styles.noTodoShared}>No todolist ;) Create them !</p>
                : null}
            </div>
        </div>
    )
}