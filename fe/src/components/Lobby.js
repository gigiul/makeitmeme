import React, { useEffect, useState } from 'react'
import './css/Lobby.css'

const Lobby = ({ sendJsonMessage, gameStart, gameStarting, numberPlayersReady }) => {

    const [ready, setReady] = useState(false)

    function handleReady() {
        if (ready) {
            setReady(false)
            sendJsonMessage({ type: "NOT_READY" })
        } else {
            setReady(true)
            sendJsonMessage({ type: "READY" })
        }
    }

    return (
        <div className='bg-[#373737] h-screen'>
            <div className='relative flex flex-col text-center justify-center m-auto h-[20rem] items-center bg-gradient-to-r from-[#1EB7AE] via-[#9146FF]  to-[#0171DE]'>
                <h1 className='text-4xl md:text-6xl drop-shadow-[0_2.5px_1.9px_rgba(0,0,0,1)] tracking-wide text-white'>Make It Meme</h1>
                <h2 className='text-2xl md:text-3xl drop-shadow-[0_2.5px_1.9px_rgba(0,0,0,1)] tracking-wide text-white'>Twitch Edition</h2>
                <div className='absolute top-[75%]'>
                    <img className='m-auto rounded-full' src='https://avatars.githubusercontent.com/u/82161967?v=4' width={150} />
                </div>
            </div>
            <div className='flex flex-col text-center items-center justify-center h-[10rem] mt-16'>
                <div className='flex text-center mx-8 items-center max-w-[35%] w-full gap-4'>
                    <input type ="text" placeholder='username' className='flex items-center justify-center rounded-lg border-2 border-b-4 border-black px-8 py-5 cursor-text w-full'></input>
                    <div className='flex gap-4 bg-black/10'>
                        {
                            !ready ? <div className='flex items-center justify-center rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-2 cursor-pointer hover:-translate-y-1 transition-transform' onClick={() => handleReady()}><span className=' drop-shadow-[0_2.5px_1.9px_rgba(0,0,0,1)] tracking-wide text-white'>Not Ready</span></div> : <div className='flex items-center justify-center rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-5 cursor-pointer hover:-translate-y-1 transition-transform' onClick={() => handleReady()}><span className=' drop-shadow-[0_2.5px_1.9px_rgba(0,0,0,1)] tracking-wide text-white'>Ready</span></div>
                        }
                    </div>
                </div>
                <div className='mt-4'>
                    {(gameStarting > 0 && gameStarting != 1) ?
                        (<h1 className='drop-shadow-[0_2.5px_1.9px_rgba(0,0,0,1)] tracking-wide text-white'>Game is starting in <span>{gameStarting}</span></h1>)
                        :
                        (<h1 className='drop-shadow-[0_2.5px_1.9px_rgba(0,0,0,1)] tracking-wide text-white'>Waiting for others players<span className='dots'>...</span><span> ({numberPlayersReady}/10)</span></h1>)}
                </div>
            </div>
        </div>
    )
}

export default Lobby