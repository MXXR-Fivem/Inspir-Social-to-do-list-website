"use client";

import styles from "./not-found.module.css";
import Navbar from "./components/navbar/Navbar";
import Loading from "./components/loading/loading";
import { useState, useEffect } from "react";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [errorCode, setErrorCode] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        setErrorCode(sessionStorage.getItem("errorCode") || null);
        setErrorMessage(sessionStorage.getItem("errorMessage") || null)
        sessionStorage.removeItem("errorCode");
        sessionStorage.removeItem("errorMessage");
        setLoading(false);
    }, []);

    if (loading) {
        return <Loading/>;
    }

    return (
        <div className={styles.body}>
            <Navbar
                className={styles.navBar}
                title="Error"
                inError={true}
                onNavigate={() => setLoading(true)}
            />
            <h1 className={styles.h1}>{"Error " + (errorCode || "404") + ":"}</h1>
            <h2 className={styles.h2}>{errorMessage || "Page not found"}</h2>
        </div>
    );
}