"use client";

import styles from "./page.module.css";
import { useEffect, useState, use } from "react";
import Loading from "../../components/loading/loading";
import Navbar from "../../components/navbar/Navbar";
import Link from "next/link";
import { FaCopy, FaTelegramPlane, FaPlus, FaStar } from "react-icons/fa";
import background2 from "../../images/background2.png";
import { IoMdRemove, IoMdClose } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { GoCopy } from "react-icons/go";
import { IoTrashBinOutline } from "react-icons/io5";
import { LiaCommentsSolid } from "react-icons/lia";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

export default function Home({ params }) {
    const paramsURL = use(params);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [tasksData, setTasksData] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [removeMode, setRemoveMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [commentsMode, setCommentsMode] = useState(false);
    const [newTasks, setNewTasks] = useState([{description: "", category: "", status: 0}]);
    const [nextIdTask, setNextIdTask] = useState(0);
    const [tasksRate, setTasksRate] = useState(0);
    const [newComment, setNewComment] = useState({ description: "", rating: 5 });
    const [userHasCommented, setUserHasCommented] = useState(false);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const { width, height } = useWindowSize();
    const [startConfetti, setStartConfetti] = useState(false);

    useEffect(() => {
        const getTasks = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/`+paramsURL.id, {credentials: "include"})
                const data = await response.json();
                if (!data.success) {
                    window.location.href = data.code == "INVALID_TOKEN" ? "/register" : "/not-found";
                    if (data.code != "INVALID_TOKEN" && data.code != "INTERNAL_ERROR") {
                        sessionStorage.setItem("errorCode", response.status);
                        sessionStorage.setItem("errorMessage", data.code)
                    }
                } else {
                    setTasksData(data.data);
                    setTasksRate(data.data.todoData[0].tasksRate);
                    if (data.data.todoNotice && data.data.todoNotice.length > 0 && data.data.user_id) {
                        const hasCommented = data.data.todoNotice.some(notice => notice.user_id === data.data.user_id);
                        setUserHasCommented(hasCommented);
                    }
                }
            } catch(error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getTasks();
    }, [paramsURL.id]);

    const updateTasks = (e, i) => {
        let {name, value} = e.target;
        setNewTasks(newTasks.map((t) => (i === t.id ? {...t, [name]: value} : t)));
    }

    const createTask = async (e) => {
        e.preventDefault();
        const sendData = {tasks: newTasks, todo_id: tasksData.todoData[0].id};
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/createTasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                credentials: "include",
                body: JSON.stringify(sendData)
            });
            const data = await response.json();
            if (data.success) {
                setTasksData((t) => ({...t, ["tasksData"]: [...t.tasksData, ...data.data.createdTasks]}));
                setTasksRate(data.data.tasksRate);
                setAddMode(!addMode)
            } else {
                console.log(data.message);
            }
        } catch(error) {
            setError("Error, please try again");
        } finally {
            setSubmitting(false);
        }
    }

    const removeTask = async (task_id) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteTask`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                credentials: "include",
                body: JSON.stringify({task_id, todo_id: tasksData.todoData[0].id})
            })
            const data = await response.json();
            if (data.success) {
                setStartConfetti(data.data.tasksRate == 100);
                data.data.tasksRate == 100 && setTimeout(() => {
                    setStartConfetti(data.data.tasksRate == 100 ? false : true);
                }, 8000)
                await setTasksData((t) => ({...t, ["tasksData"]: [...t.tasksData.filter((t2) => t2.id != task_id)]}));
                setTasksRate(data.data.tasksRate);
                if (tasksData.tasksData.length == 0) {
                    setRemoveMode(false);
                }
            } else {
                console.log(data.message);
            }
        } catch(error) {
            console.log(error);
        }
    }

    const updateTaskStatus = async (task_id, newStatus) => { 
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateTaskStatus`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                credentials: "include",
                body: JSON.stringify({task_id, todo_id: tasksData.todoData[0].id, newStatus, todo_status: tasksData.todoData[0].status})
            })
            const data = await response.json();
            if (data.success) {
                setStartConfetti(data.data.tasksRate == 100);
                data.data.tasksRate == 100 && setTimeout(() => {
                    setStartConfetti(data.data.tasksRate == 100 ? false : true);
                }, 8000)
                setTasksRate(data.data.tasksRate);
                setTasksData((t) => ({...t, todoData: t.todoData.map((tdData) => ({...tdData, status: data.data.todo_status})), taskData: data.data.updatedTasks}));
            } else {
                console.log(data.message);
            }
        } catch(error) {
            console.log(error);
        }
    }

    const updateTasksDb = async (e) => {
        try {
            e.preventDefault();
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updateTasks`, {
                method: "PUT",
                headers: {
                    "Content-Type" : "Application/json; charset=utf-8",
                },
                credentials: "include",
                body: JSON.stringify({updatedTasks: newTasks, todo_id: tasksData.todoData[0].id}),
            })
            const data = await response.json();
            if (data.success) {
                setStartConfetti(data.data.tasksRate == 100);
                data.data.tasksRate == 100 && setTimeout(() => {
                    setStartConfetti(data.data.tasksRate == 100 ? false : true);
                }, 8000)
                setTasksRate(data.data.tasksRate);
                setTasksData((t) => ({...t, ["tasksData"]: data.data.updatedTasks}));
                setEditMode(false);
            } else {
                console.log(data.message);
            }
        } catch(error) {
            console.log(error);
        }
    }

    const deleteTodo = async (todo_id) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deleteTodo/`+todo_id, {
            method: "DELETE",
            headers: {
                "Content-Type" : "Application/json; charset=utf-8",
            },
            credentials: "include",
        })
    }

    const createComment = async (e) => {
        e.preventDefault();
        const sendData = {
            todo_id: tasksData.todoData[0].id,
            description: newComment.description,
            value: newComment.rating
        };
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notice`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                credentials: "include",
                body: JSON.stringify(sendData)
            });
            const data = await response.json();
            if (data.success) {
                setTasksData((t) => ({...t, todoNotice: [...t.todoNotice, data.data.newNotice]}));
                setNewComment({ description: "", rating: 5 });
                setUserHasCommented(true);
            }
        } catch(error) {
            console.log(error);
        }
    }

    if (loading) {
        return <Loading/>;
    }

    const avatarSrc = tasksData.userData[0].photo && tasksData.userData[0].photo !== "/default-avatar.png" 
        ? tasksData.userData[0].photo
        : "/default-avatar.png";

    const backgroundPath = background2.src;

    return (
        <>
            <div className={styles.backgroundLayer} style={{ backgroundImage: `url(${backgroundPath})` }} />
            <div className={styles.body}>
                <Navbar
                    className={styles.navBar}
                    title={tasksData.todoData[0].title}
                    inTask={true}
                    onNavigate={() => setLoading(true)}
                /> 
                <div className={styles.bodyContainer}>
                    {tasksData.ownTodo ?
                        <div className={styles.topContainerOwn}>
                            <div className={styles.topThreeButtons}>
                                <button 
                                    className={styles.topButton}
                                    onClick={() => {setAddMode(!addMode); setRemoveMode(false); setEditMode(false); setNewTasks([{todo_id: tasksData.todoData[0].id, description: "", category: "", status: 0}]);}}>
                                    <FaPlus style={{color: "rgb(116, 187, 107)"}} className={styles.iconTopThreeButtons}/>
                                    <span>Add</span>
                                </button>
                                <button 
                                    className={styles.topButton}
                                    onClick={() => {setRemoveMode(!removeMode); setAddMode(false); setEditMode(false)}}>
                                    <IoMdRemove style={{color: "rgb(220, 107, 97)"}} className={styles.iconTopThreeButtons}/>
                                    <span>Remove</span>
                                </button>
                                <button
                                    className={styles.topButton}
                                    onClick={() => {setEditMode(!editMode); setAddMode(false); setRemoveMode(false); setCommentsMode(false); setNewTasks([...tasksData.tasksData])}}>
                                    <FiEdit style={{color: "rgba(253, 195, 95, 1)", transform: "scale(1.15)"}} className={styles.iconTopThreeButtons}/>
                                    <span>Edit</span>
                                </button>
                                <button
                                    className={styles.topButton}
                                    onClick={() => {setCommentsMode(!commentsMode); setAddMode(false); setRemoveMode(false); setEditMode(false)}}>
                                    <LiaCommentsSolid style={{color: "rgba(75, 249, 165, 0.8)", transform: "scale(1.45)"}} className={styles.iconTopThreeButtons}/>
                                    <span>Comments</span>
                                </button>
                                <Link
                                    className={styles.topButton}
                                    onNavigate={() => {
                                        setLoading(true);
                                        sessionStorage.setItem("transferTodoData", JSON.stringify(tasksData));
                                    }}
                                    href="../../createTodo">
                                    <GoCopy style={{color: "rgba(50, 50, 255, 0.5)"}} className={styles.iconTopThreeButtons}/>
                                    <span>Copy</span>
                                </Link>
                                <button
                                    style={{color: "rgb(220, 107, 97)"}}
                                    className={styles.topButton}
                                    onClick={() => {
                                        if (confirm("Are you sure you want to delete the todo ?")) {
                                            setLoading(true);
                                            deleteTodo(tasksData.todoData[0].id);
                                            window.location.href = "/mytodos";
                                        }
                                    }}>
                                    <IoTrashBinOutline className={styles.iconTopThreeButtons}/>
                                    <span>Delete *</span>
                                </button>
                            </div>
                            {tasksData.tasksData.length > 0 ?                            
                                <div className={styles.backgroundProgressBar}>
                                    <div style={{width: (tasksRate+"%"), backgroundColor: tasksRate > 65 ? "rgba(73, 202, 61, 0.64)" : tasksRate > 40 ? "rgba(255, 177, 59, 0.72)" : "rgba(250, 84, 84, 0.463)"}} className={styles.contentProgressBar}/>
                                    <span className={styles.textProgresBar}>{tasksRate+"%"}</span>
                                </div>
                            : <></>}
                        </div>
                    :
                        <div className={styles.topContainerNoOwn}>
                            <img className={styles.userPicture} src={avatarSrc} alt="user-picture"/>
                            <h3 className={styles.h3}>{tasksData.userData[0].name + " " + tasksData.userData[0].firstname}</h3>
                            <div className={styles.topButtonContainer}>
                                <Link className={styles.buttonTop} onNavigate={(e) => {setLoading(true)}} href={"../../profile/"+tasksData.userData[0].id}>
                                    <FaTelegramPlane className={styles.buttonIconTop}/>
                                    <span>Visit Profile</span>
                                </Link>
                                <button className={styles.buttonTop} onClick={() => setCommentsMode(!commentsMode)}>
                                    <LiaCommentsSolid style={{transform: "scale(1.45)"}} className={styles.buttonIconTop}/>
                                    <span>Comments</span>
                                </button>
                                <Link 
                                    className={styles.buttonTop} 
                                    onNavigate={() => {
                                        setLoading(true);
                                        sessionStorage.setItem("transferTodoData", JSON.stringify(tasksData));
                                    }}
                                    href="../../createTodo"
                                >
                                    <FaCopy className={styles.buttonIconTop}/>
                                    <span>Copy todo</span>
                                </Link>
                            </div>
                        </div>
                    }
                    <div className={styles.form}>
                        {tasksData.tasksData.length >=1 && (tasksData.todoData[0].categories).length >= 1 ?
                            <div className={styles.categoriesContainer}>
                                {tasksData.todoData[0].categories.map((category, i) => (
                                    <div key={"category"+i}className={styles.tasksContainerWithCategories}>
                                        {tasksData.tasksData.filter((t) => t.category.toLowerCase() === category.toLowerCase()).length >= 1 ?
                                            <h3 className={styles.titleCategory}>{category[0].toUpperCase()+category.slice(1, category.length).toLowerCase()}</h3>                                 
                                        : <></>}
                                        {tasksData.tasksData.map((task, index) => {
                                            if ((task.category).toLowerCase() == category.toLowerCase()) {
                                                return (
                                                    <div key={index} className={styles.taskCard}>
                                                        {removeMode ?
                                                            <div 
                                                                className={styles.removeWrapper}
                                                                onClick={(e) => {removeTask(task.id)}}>
                                                                <IoMdClose className={styles.removeIcon}/>
                                                            </div>
                                                        : <></>}
                                                        <input 
                                                            type="checkbox" 
                                                            onChange={() => {
                                                                updateTaskStatus(task.id, task.status);
                                                                setTasksData((t) => ({...t, tasksData: t.tasksData.map((t2) => t2.id === task.id ? {...t2, status: t2.status === 0 ? 1 : 0} : t2)}));
                                                            }} 
                                                            disabled={!tasksData.ownTodo} 
                                                            checked={task.status == 1}
                                                        />
                                                        <p>{task.description}</p>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                ))}
                            </div>
                        : tasksData.tasksData.length >= 1 ?
                            <div className={styles.tasksContainer}>
                                {tasksData.tasksData.map((task, index) => (
                                    <div key={index} className={styles.taskCard}>
                                        {removeMode ?
                                            <div className={styles.removeWrapper}>
                                                <IoMdClose className={styles.removeIcon}/>
                                            </div>
                                        : <></>}
                                        <input
                                            type="checkbox"
                                            onChange={() => {
                                                updateTaskStatus(task.id, task.status);
                                                setTasksData((t) => ({...t, tasksData: t.tasksData.map((t2) => t2.id === task.id ? {...t2, status: t2.status === 0 ? 1 : 0} : t2)}));
                                            }} 
                                            disabled={!tasksData.ownTodo} 
                                            checked={task.status == 1}
                                        />
                                        <p>{task.description}</p>
                                    </div>
                                ))}
                            </div>
                        :
                            <span className={styles.noTasks}>{"No tasks available ;) " + (tasksData.ownTodo  ? "Create them !" : "")}</span>
                        }  
                    </div>
                </div>
                {commentsMode ?
                    <div className={styles.addModeBackground}>
                        <IoMdClose onClick={() => setCommentsMode(false)} className={styles.closeIcon}/>
                        <div className={styles.addModeCard}>
                            <div className={styles.commentsHeader}>
                                <h2>Comments</h2>
                                {tasksData.todoNotice && tasksData.todoNotice.length > 0 && (
                                    <div className={styles.averageRating}>
                                        <span>{(() => {
                                            const avg = (tasksData.todoNotice.reduce((sum, notice) => sum + notice.value, 0) / tasksData.todoNotice.length);
                                            return avg % 1 === 0 ? avg.toFixed(0) : avg.toFixed(1);
                                        })()}/5</span>
                                        <FaStar style={{color: '#ffd700', fontSize: '1.2rem'}}/>
                                    </div>
                                )}
                                {!tasksData.ownTodo && !userHasCommented && (
                                    <button 
                                        className={styles.addCommentButton}
                                        onClick={() => setShowCommentForm(!showCommentForm)}>
                                        <FaPlus style={{fontSize: '1.2rem'}}/>
                                    </button>
                                )}
                            </div> 
                            {!tasksData.ownTodo && showCommentForm && !userHasCommented && (
                                <form className={styles.commentForm} onSubmit={createComment}>
                                    <div className={styles.ratingContainer}>
                                        <label>Rating</label>
                                        <div className={styles.starsContainer}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar 
                                                    key={star}
                                                    className={styles.starIcon}
                                                    style={{color: star <= newComment.rating ? '#ffd700' : '#ccc', cursor: 'pointer'}}
                                                    onClick={() => setNewComment({...newComment, rating: star})}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className={styles.commentInputContainer}>
                                        <label htmlFor="commentDesc">Your review</label>
                                        <textarea 
                                            id="commentDesc"
                                            maxLength={50}
                                            value={newComment.description}
                                            onChange={(e) => setNewComment({...newComment, description: e.target.value})}
                                            placeholder="Write your review (max 50 characters)"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className={styles.submitCommentButton}>Submit Review</button>
                                </form>
                            )}
                            <div className={styles.commentsContainer}>
                                {tasksData.todoNotice && tasksData.todoNotice.length > 0 ? (
                                    tasksData.todoNotice.map((notice, index) => {
                                        const noticeAvatar = notice.photo && notice.photo !== '/default-avatar.png'
                                            ? notice.photo
                                            : '/default-avatar.png';
                                        return (
                                            <div key={index} className={styles.commentCard}>
                                                <div className={styles.commentHeader}>
                                                    <img src={noticeAvatar} alt="user-avatar" className={styles.commentAvatar}/>
                                                    <div className={styles.commentUserInfo}>
                                                        <h4>{notice.name + ' ' + notice.firstname}</h4>
                                                        <span className={styles.commentDate}>{notice.created_at.slice(0, 10)}</span>
                                                    </div>
                                                    <div className={styles.commentRating}>
                                                        <FaStar className={styles.ratingStarIcon}/>
                                                        <span>{notice.value}/5</span>
                                                    </div>
                                                </div>
                                                <p className={styles.commentDescription}>{notice.description}</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className={styles.noComments}>{"No comments yet." + (!tasksData.ownTodo ? " Be the first to leave a good (or not) review !" : "")}</p>
                                )}
                            </div>
                        </div>
                    </div>
                : (addMode | editMode) ? 
                    <form onSubmit={addMode ? createTask : updateTasksDb} className={styles.addModeBackground}>
                        <IoMdClose onClick={() => {setAddMode(false); setEditMode(false)}} className={styles.closeIcon}/>
                        <div className={styles.addModeCard}>
                            <h2>{addMode ? "Add Task(s)" : "Edit task(s) ?"}</h2>
                            {newTasks.map((task, index) => {
                                return (
                                    <div key={"newTask"+index} className={styles.containerTaskAdd}>
                                        <h3>{"Task n°"+(Number(index+1))+":"}</h3>
                                        <div className={styles.taskInputLabel}>
                                            <label htmlFor="description">Description</label>
                                            <input type="text" id="description" name="description" value={task.description} onChange={(e) => {updateTasks(e, task.id)}} required/>
                                        </div>
                                        {(tasksData.todoData[0].categories).length > 0 ?
                                            <div className={styles.containerInputTask}>
                                                <label htmlFor="status">Todo status</label>
                                                <select list="category" placeholder="Choose task category" name="category" value={task.category} onChange={(e) => {updateTasks(e, task.id)}} required>
                                                    <option value="">Please choose a category</option>
                                                    {tasksData.todoData[0].categories.map((category, index) => {
                                                        return (
                                                            <option key={"opt"+index} value={category.toLowerCase()}>{category}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        : <></>}
                                        <div className={styles.taskButtons}>
                                            <button 
                                                className={task.status ? styles.doneButton : styles.notDoneButton}
                                                onClick={(e) => {
                                                    e.preventDefault(); 
                                                    setNewTasks(newTasks.map((t) => (task.id === t.id ? {...t, status: !t.status} : t)));
                                                }}
                                                >{task.status ? "Done" : "Not Done"}
                                            </button>
                                            <button 
                                                className={styles.removeButton}
                                                onClick={(e) => {e.preventDefault(); setNewTasks(newTasks.filter((t) => t.id !== task.id))}}
                                                >Remove
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                            <button 
                                className={styles.addButton}
                                onClick={(e) => {e.preventDefault(); setNewTasks((t) => [...t, {newTask: true, todo_id: tasksData.todoData[0].id, id: nextIdTask, status: 0, description: "", category: ""}]); setNextIdTask(nextIdTask+1)}}
                                >Add
                            </button>
                            <input
                                type="submit"
                                className={styles.saveButton}
                                onClick={(e) => {}}
                                value="Save"
                                disabled={submitting}>
                            </input>
                        </div>
                    </form>
                : editMode ?
                    <div>

                    </div>
                : <></>}
                {startConfetti ?                
                    <Confetti
                        className={styles.confetti}
                        width={width}
                        height={height}
                        numberOfPieces={500}
                        recycle={false}
                        run={startConfetti}
                    />
                : <></>}
            </div>
        </>
    )
}