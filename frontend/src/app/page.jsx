"use client";

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import Loading from "./components/loading/loading";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [isLogged, setLogged] = useState(false);

    useEffect(() => {
        const getUserAuth = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                    credentials: "include"
                })
                const data = await response.json();

                setLogged(data.success);
            } catch(error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        getUserAuth();
    }, []);

    if (loading) {
        return <Loading/>;
    }

    const title = "Get inspir";
    return (
        <div className={styles.body}>
            <div className={styles.title}>
                <h2>Need good habits ?</h2>
                <h1>
                    {[...title].map((char, index) => (
                        <span key={index} className={styles.letterBounce} style={{ animationDelay: `${index * 0.06}s` }}>
                            {char}
                        </span>
                    ))}
                </h1>            
            </div>
            <Link onNavigate={(e) => {setLoading(true)}} href={isLogged ? "./home" : "./register"} className={styles.getStartedBtn}>
                <h3>Get started</h3>
            </Link>
        </div>
    );
}
