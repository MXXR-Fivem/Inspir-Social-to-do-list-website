"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import Loading from "../components/loading/loading";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [ passwordForm, setPasswordForm] = useState ({
        oldPassword: "",
        newPassword:"",
        confirmPassword: "",
    });
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect (() => {
        const getLogged = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                    credentials: "include",
                });
                const data = await response.json();
                if(!data.success && data.code === "INVALID_TOKEN") {
                    window.location.href = "/register";
                    return;
                }
                setUserData(data.data);
            } catch(error) {
                console.error(error);
                setError("Error while loadin user data");
            } finally {
                setLoading(false);
            }
        };
        getLogged();
    }, []);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((prev) =>({...prev, [name]: value}));
    };

    const submitPassword = async(e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);
        try {
            const response = await fetch (`${process.env.NEXT_PUBLIC_API_URL}/settings/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                credentials:"include",
                body:JSON.stringify(passwordForm),
            });
            const data = await response.json();
            if (data.success) {
                setSuccess(data.message || "Password changed successfully eheh.");
                setPasswordForm({
                    oldPassword:"",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                setError(data.message || "Error while changing password.");
            }
        } catch(error) {
            console.error(error);
            setError("Server error while changing passwrod");
        } finally {
            setSubmitting(false);
        }   
    };

    const handlLeLogout = async () => {
        setError("");
        setSuccess("");
        setSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/get-disconnected`, {
                method: "POST",
                credentials:"include",
            });
            const data =await response.json();
            console.log('LOGOUT RESPONSE =>', data);
            if (data.succes) {
                setSuccess(data.message || "You have been disconnected bye bye");
                window.location.href ="/register";
            } else{
                setError(data.message || "Error while disconnecting ^^.");
            }
        } catch(error) {
            console.error(error);
            setError("Server error while disconnecting.");
        } finally{
            setSubmitting(false);
        }
    };

    const handleExport = async () => {
        setError("");
        setSuccess("");
        setSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings/export`, {
                method:"GET",
                credentials: "include",
            });
            const data = await response.json();
            if (!data.success) {
                setError(data.message || "Error while exporting data.");
                return;
            }
            const exportData = data.data;
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "todo_export.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setSuccess("Export done,file download");
        } catch(error){
            console.error(error);
            setError("Server error while exporting data.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account ? All your data will be lost forever.");
        if (!confirmDelete) return;
        setError("");
        setSuccess("");
        setSubmitting(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/settings/delete-account`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (data.success) {
                setSuccess(data.message || "Account deleted successfully");
                router.push("/register");
            } else {
                setError(data.message || "Error while deleting account");
            }
        } catch(error) {
            console.error(error);
            setError("Server error while deleting account.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loading/>;
    }

    return (
        <div className={styles.body}>
            <Navbar
                className={styles.navbar}
                title="Settings"
                inSettings={true}
                onNavigate={() => {}} 
            />
            <div className={styles.container}>
                <h2 className={styles.title}>Settings page</h2>
                {userData && (
                    <p className={styles.text}>
                        Hi! you are currently logged on : <strong>{userData.email}</strong>
                    </p>
                )}
                {error && (
                    <div className={styles.alertError}>
                        {error}
                    </div>
                )}
                {success && (
                    <div className={styles.alertSuccess}>
                        {success}
                    </div>
                )}
                <h3 className={styles.subtitle}>Change password</h3>
                <form className={styles.form} onSubmit={submitPassword}>
                    <div className={styles.formGroup}>
                        <label htmlFor="oldPassword">Old password</label>
                        <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            value={passwordForm.oldPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="newPassword">New password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Confirm new password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <button className={styles.submitButton} type="submit">
                        Submite Changes
                    </button>
                </form>
                <h3 className={styles.subtitle}>Export my data</h3>
                <button
                    className={styles.submitButton}
                    type="button"
                    onClick={handleExport}
                    disabled={submitting}
                >
                    {submitting ? "Working..." : "Download my data"}
                </button>
                <h3 className={styles.subtitle}>Logout</h3>
                <button
                    className={styles.submitButton}
                    type="button"
                    onClick={handlLeLogout}
                    disabled={submitting}
                >
                    {submitting ? "Logging out..." : "Logout"}
                </button>
                <h3 className={styles.subtitle}>Delete your Account</h3>
                <button
                    className={styles.submitButton}
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={submitting}
                >
                    {submitting ? "Deleting Account..." : "Delete"}
                </button>
            </div>
        </div>
    );
}