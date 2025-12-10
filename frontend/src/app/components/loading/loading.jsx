import styles from "./loading.module.css";

export default function Loading() {
    return (
        <div className={styles.body}>
            <div className={styles.loadingContent}>
                <div className={styles.spinner}/>
            </div>
            <h1 className={styles.loadingTitle}>Loading</h1>
            <p className={styles.loadingText}>
                Fetching data<span className={styles.dots}></span>
            </p>
        </div>
    );
}