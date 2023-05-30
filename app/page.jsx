'use client'
import Image from "next/image"
import Header from "@components/Header"
import Header2 from "@components/Header2"
import LotteryEntrance from "@components/LotteryEntrance"
export default function Home() {
    return (
        <main className="p-[2em] flex flex-col gap-[2em]">
             <Header2/>
             <LotteryEntrance/>
        </main>
    )
}
