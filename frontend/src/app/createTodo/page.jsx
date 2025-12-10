"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Loading from "../components/loading/loading";
import Navbar from "../components/navbar/Navbar";
import { RiDeleteBack2Fill } from "react-icons/ri";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [UserData, setUserData] = useState([]);
    const [todoData, setTodoData] = useState({title: "", description: "", status: "", due_time: null})
    const [categories, setCategories] = useState([]);
    const [taskList, setTaskList] = useState([]);
    const [isPrivate, setPrivate] = useState(true);
    const [autEmails, setAutEmails] = useState([]);
    const [tags, setTags] = useState([]);
    const [nextIdCategory, setNextIdCategory] = useState(0);
    const [nextIdTag, setNextIdTag] = useState(0);
    const [nextIdEmail, setNextIdEmail] = useState(0);
    const [nextIdTask, setNextIdTask] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const getLogged = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {credentials: "include"})
                const data = await response.json();
                setUserData(data.data);
                const copyData = sessionStorage.getItem("transferTodoData");
                if (copyData) {
                    const parsedData = JSON.parse(copyData);
                    setTodoData(parsedData.todoData[0]);
                    setCategories(parsedData.todoData[0].categories.map((c, i) => ({id: i, name: c})));
                    setNextIdCategory(parsedData.todoData[0].categories.length);
                    if (parsedData.todoData[0].tags) {
                        setTags(parsedData.todoData[0].tags.map((t, i) => ({id: i, name: t})));
                        setNextIdTag(parsedData.todoData[0].tags.length);
                    }
                    setTaskList(parsedData.tasksData.map((task, i) => ({
                        id: i,
                        description: task.description,
                        category: task.category,
                        done: task.status === 1
                    })));
                    setNextIdTask(parsedData.tasksData.length);
                    setPrivate(parsedData.todoData[0].private === 1);
                    if (parsedData.todoData[0].aut_emails && parsedData.todoData[0].aut_emails.length > 0) {
                        setAutEmails(parsedData.todoData[0].aut_emails.map((email, i) => ({id: i, email: email})));
                        setNextIdEmail(parsedData.todoData[0].aut_emails.length);
                    }
                    sessionStorage.removeItem("transferTodoData");
                }
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

    const submitCreation = async (e) => {
        e.preventDefault();
        const sendData = {todoData: todoData, categories: categories, tags: tags, taskList: taskList, private: isPrivate, emails: autEmails}

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                credentials: "include",
                redirect: "follow",
                body: JSON.stringify(sendData)
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = ("/tasks/"+data.data.todoId);
            } else {
                setError(data.message);
            }
        } catch(error) {
            setError("Error, please try again")
        } finally {
            setSubmitting(false);
        }
    }

    const updateTodoData = (e) => {
        const {name, value} = e.target;
        setTodoData((t) => ({...t, [name]: value}));
    }

    const updateCategories = (e, i) => {
        const {name, value} = e.target;
        setCategories(categories.map((c) => (i === c.id ? {...c, [name]: value} : c)));
    }

    const updateEmails = (e, i) => {
        const {name, value} = e.target;
        setAutEmails(autEmails.map((e) => (i === e.id ? {...e, [name]: value} : e)));
    }

    const updateTags = (e, i) => {
        const {name, value} = e.target;
        setTags(tags.map((t) => (i === t.id ? {...t, [name]: value} : t)));
    }

    const updateTasks = (e, i) => {
        let {name, value} = e.target;
        setTaskList(taskList.map((t) => (i === t.id ? {...t, [name]: value} : t)));
    }

    if (loading) {
        return <Loading/>;
    }

    return (
        <div className={styles.body}>
            <Navbar
                className={styles.navBar}
                title="Create Todo"
                inCreateTodo={true}
                onNavigate={() => setLoading(true)}
            />
            <form className={styles.formContainer} onSubmit={submitCreation}>
                <div className={styles.containerTodo}>
                    <h3 className={styles.h3}>Todo informations</h3>
                    <div className={styles.grid3}>
                        <div className={styles.containerInput}>
                            <label htmlFor="tite">Title</label>
                            <input type="text" id="title" name="title" value={todoData.title || ""} placeholder="Please enter a title" onChange={(e) => {updateTodoData(e)}} required/>
                        </div>
                        <div className={styles.containerInput}>
                            <label htmlFor="description">Description</label>               
                            <input type="text" id="description" name="description" value={todoData.description || ""} placeholder="Please enter a description" onChange={(e) => {updateTodoData(e)}} required/>
                        </div>
                        <div className={styles.containerInput}>
                            <label htmlFor="description">End date ?</label>               
                            <input className={styles.dateTimeLocal} type="datetime-local" name="due_time" value={todoData.due_time ? new Date(todoData.due_time).toISOString().slice(0, 16) : ""} onChange={(e) => {updateTodoData(e)}}/>
                        </div>
                    </div>
                    <div className={styles.grid2}>
                        <div className={styles.containerInput}>
                            <label htmlFor="status">Todo status</label>
                            <select list="status" name="status" value={todoData.status || ""} placeholder="Choose todo status" onChange={(e) => {updateTodoData(e)}} required>
                                <option value="">Please choose an option</option>
                                <option value="in progress">In progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                        <div className={styles.containerInput}>
                            <label htmlFor="visibility">Private ?</label>
                            <input className={styles.checkbox} onChange={(e) => {setPrivate(!isPrivate)}} type="checkbox" name="visibility" id="visibility" checked={isPrivate ? true : false}/>
                        </div>
                    </div>
                    {!isPrivate ?
                        <div className={styles.containerEmail}>
                            <h4 className={styles.h4}>You can allow (or not) people by email</h4>
                            {autEmails.map((email, index) => {
                                return (
                                    <div key={index} className={styles.email}>
                                        <div className={styles.emailInputLabel}>
                                            <label htmlFor={"emailInput"+index}></label>
                                            <input type="text" id={"emailInput"+index} name="email" value={email.email || ""} placeholder="Please enter an email" onChange = {(e) => {updateEmails(e, email.id)}} required/>
                                        </div>
                                        <button 
                                        className={styles.buttonDeleteEmail}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setAutEmails(autEmails.filter((e, i) => e.id !== email.id));
                                        }}>
                                            <RiDeleteBack2Fill className={styles.deleteIcon}/>
                                        </button>
                                    </div>
                                )
                            })}
                            <button
                            className={styles.addButton}
                            onClick={(e) => {e.preventDefault(); setAutEmails(((e) => [...e, {id: nextIdEmail, email: ""}])), setNextIdEmail(nextIdEmail+1)}}
                            >
                                Add
                            </button>
                        </div>
                    : <></>}
                    <div className={styles.grid2}>
                        <div className={styles.containerCategories}>
                            <h4 className={styles.h4}>Categories</h4>
                            {categories.map((category, index) => {
                                return (
                                    <div key={category.id} className={styles.category}>
                                        <div className={styles.categoryInputLabel}>
                                            <label htmlFor={"categoryInput"+category.id}></label>
                                            <input type="text" id={"categoryInput"+category.id} name="name" value={category.name || ""} placeholder="Choose category name" onChange = {(e) => {updateCategories(e, category.id)}} required/>
                                        </div>
                                        <button 
                                        className={styles.buttonDeleteCategory}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCategories(categories.filter((c) => c.id !== category.id));
                                        }}>
                                            <RiDeleteBack2Fill className={styles.deleteIcon}/>
                                        </button>
                                    </div>
                                )
                            })}
                            {categories.length < 3 ?
                                <button
                                className={styles.addButton}
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    setCategories(((c) => [...c, {id: nextIdCategory, name: ""}]));
                                    setNextIdCategory(nextIdCategory+1);
                                }}
                                >
                                    Add
                                </button>
                            : <></>}
                        </div>
                        <div className={styles.containerTags}>
                            <h4 className={styles.h4}>Tags</h4>
                            {tags.map((tag, index) => {
                                return (
                                    <div key={tag.id} className={styles.tag}>
                                        <div className={styles.tagInputLabel}>
                                            <label htmlFor={"tagInput"+tag.id}></label>
                                            <input type="text" id={"tagInput"+tag.id} name="name" value={tag.name || ""} placeholder="Choose tag name" onChange = {(e) => {updateTags(e, tag.id)}} required/>
                                        </div>
                                        <button 
                                        className={styles.buttonDeleteTag}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setTags(tags.filter((c) => c.id !== tag.id));
                                        }}>
                                            <RiDeleteBack2Fill className={styles.deleteIcon}/>
                                        </button>
                                    </div>
                                )
                            })}
                            {tags.length < 5 ?
                                <button
                                className={styles.addButton}
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    setTags(((c) => [...c, {id: nextIdTag, name: ""}]));
                                    setNextIdTag(nextIdTag+1);
                                }}
                                >
                                    Add
                                </button>
                            : <></>}
                        </div>
                    </div>
                </div>
                <div className={styles.containerTasks}>
                    <h3 className={styles.h3}>Tasks informations</h3>
                    <div className={styles.grid2}>    
                        {taskList.map((task, index) => {
                            return (
                                <div className={styles.taskContainer} key={"task"+index}>
                                    <h4 className={styles.h4task}>Task n°{index+1}</h4>
                                    <div className={styles.taskInputLabel}>
                                        <label htmlFor={"taskInput"+task.id}>Description</label>
                                        <input type="text" id={"taskInput"+task.id} name="description" value={task.description || ""} placeholder="Choose task description" onChange = {(e) => {updateTasks(e, task.id)}} required/>
                                    </div>
                                    {categories.length > 0 && categories.every(c => c.name && c.name.trim().length) ?
                                        <div className={styles.containerInputTask}>
                                            <label htmlFor="status">Todo Category</label>
                                                <select list="category" placeholder="Choose task category" name="category" value={task.category || ""} onChange={(e) => {updateTasks(e, task.id)}} required>
                                                    <option value="">Please choose a category</option>
                                                    {categories.map((category, index) => {
                                                        return (
                                                            <option key={"opt"+index} value={category.name.toLowerCase()}>{category.name}</option>
                                                        )
                                                    })}
                                                </select>
                                        </div>
                                    : <></>}
                                    <div className={styles.taskButtons}>
                                        <button 
                                            className={task.done ? styles.doneButton : styles.notDoneButton}
                                            onClick={(e) => {
                                                e.preventDefault(); 
                                                setTaskList(taskList.map((t) => (task.id === t.id ? {...t, done: !t.done} : t)));
                                            }}
                                            >{task.done ? "Done" : "Not Done"}
                                        </button>
                                        <button 
                                            className={styles.removeButton}
                                            onClick={(e) => {e.preventDefault(); setTaskList(taskList.filter((t) => t.id !== task.id))}}
                                            >Remove
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <button 
                        className={styles.addButton}
                        onClick={(e) => {e.preventDefault(); setTaskList((t) => [...t, {id: nextIdTask, done: false, description: "", category: ""}]); setNextIdTask(nextIdTask+1)}}
                        >Add
                    </button>
                </div>
                <span style={{color: "red"}}>{error}</span>
                <input className={styles.submitBtn} type="submit" value={submitting ? "Submitting..." : "Create"} disabled={submitting}/>
            </form>
        </div>
    )
}