"use client";

import { useState } from "react";
import styles from "./Navbar.module.css";
import { FaUser } from "react-icons/fa";
import { IoSettings, IoFileTrayFull, IoShareSocial } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

export default function Navbar({title, infeed, inMyTodos, inMyProfile, inSettings, onNavigate, inCreateTodo, inTask, inProfile, inError}) {
  	const [isMenuOpen, setIsMenuOpen] = useState(false);

  	return (
		<>
			<nav className={styles.navbar}>
				<svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
					<defs>
					<linearGradient id="navGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="rgb(156, 0, 255)" />
						<stop offset="50%" stopColor="rgb(42, 79, 226)" />
						<stop offset="100%" stopColor="rgb(0, 255, 255)" />
					</linearGradient>
					</defs>
				</svg>

				<button
					className={styles.burgerButton}
					onClick={() => setIsMenuOpen((v) => !v)}
					type="button"
				>
					<span className={styles.burgerLine}></span>
					<span className={styles.burgerLine}></span>
					<span className={styles.burgerLine}></span>
				</button>

				{title ? 
					<h1 className={styles.titleNav}>{title}</h1>
				: <></>}

				<div
					id="mobile-menu"
					className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}
				>
					{!inMyProfile ?
					<Link className={styles.link} onNavigate={(e) => onNavigate()} type="button" href={(inProfile || inTask ? "./." : "") + "./editProfile"}>
						<FaUser className={styles.icon}/>
						<span>Profile</span>
					</Link>
					: <></>}

					{!inCreateTodo ?
						<Link className={styles.link} onNavigate={(e) => onNavigate()} type="button" href={(inProfile || inTask ? "./." : "") + "./createTodo"}>
							<FaPlus className={styles.icon}/>
							<span>Create todo</span>
						</Link>
					: <></>}

					{!inMyTodos ?
					<Link className={styles.link} onNavigate={(e) => onNavigate()} type="button" href={(inProfile || inTask ? "./." : "") + "./mytodos"}>
						<IoFileTrayFull className={styles.icon}/>
						<span>My todo</span>
					</Link>
					: <></>}

					{!infeed ?
					<Link className={styles.link} onNavigate={(e) => onNavigate()} type="button" href={(inProfile || inTask ? "./." : "") + "./home"}>
						<IoShareSocial className={styles.icon}/>
						<span>Feed</span>
					</Link>
					: <></>}

					{!inSettings ?        
					<Link className={styles.link} onNavigate={(e) => onNavigate()} type="button" href={(inProfile || inTask ? "./." : "") + "./settings"}>
						<IoSettings className={styles.icon}/>
						<span>Settings</span>
					</Link>
					: <></>}
				</div>

				<aside className={`${styles.sidebar} ${isMenuOpen ? styles.sidebarOpen : ""}`}>
					<div className={styles.sidebarInner}>
						{!inMyProfile ?
							<Link className={styles.link} onNavigate={(e) => onNavigate()} type="button" href={(inProfile || inTask ? "./." : "") + "./editProfile"}>
								<FaUser className={styles.icon}/>
								<span>Profile</span>
							</Link>
						: <></>}

						{!inCreateTodo ?
							<Link className={styles.link} onNavigate={(e) => onNavigate()} type="button" href={(inProfile || inTask ? "./." : "") + "./createTodo"}>
								<FaPlus className={styles.icon}/>
								<span>Create todo</span>
							</Link>
						: <></>}

						{!inMyTodos ?
							<Link className={styles.link} onNavigate={(e) => onNavigate()} type="button" href={(inProfile || inTask ? "./." : "") + "./mytodos"}>
								<IoFileTrayFull className={styles.icon}/>
								<span>My todo</span>
							</Link>
						: <></>}

						{!infeed ?
							<Link className={styles.link} onNavigate={(e) => onNavigate()} type="button" href={(inProfile || inTask ? "./." : "") + "./home"}>
								<IoShareSocial className={styles.icon}/>
								<span>Feed</span>
							</Link>
						: <></>}

						{!inSettings ?        
							<Link className={styles.link} onNavigate={(e) => onNavigate()} type="button" href={(inProfile || inTask ? "./." : "") + "./settings"}>
								<IoSettings className={styles.icon}/>
								<span>Settings</span>
							</Link>
						: <></>}
					</div>
				</aside>
			</nav>

			<div
				className={`${styles.overlay} ${isMenuOpen ? styles.overlayOpen : ""}`}
				onClick={() => setIsMenuOpen(false)}
			/>
		</>
	);
}