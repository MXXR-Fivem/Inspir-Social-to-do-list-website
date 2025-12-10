import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["400", "600", "700", "800", "900"],
});

export const metadata = {
    title: "Inspir",
    description: "Need good habits ? Get Inspir !",
    icons: {
        icon: "/inspir.png"
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
            <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
                {children}
            </body>
        </html>
    );
}