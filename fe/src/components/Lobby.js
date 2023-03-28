import React, { useState } from 'react'

const Lobby = ({ sendJsonMessage, gameStart }) => {

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
        <>
            <div className=' flex text-center justify-center m-auto h-[20rem] items-center'>
                <h1 className='text-2xl font-bold'>Make It Meme Twitch Edition</h1>
            </div>
            <div className='flex justify-center h-[10rem]'>
            <div className='flex text-center my-auto mx-8 items-center gap-8'>
                <input placeholder='username'></input>
                <div className='flex gap-4'>
                    {
                        !ready ? <button onClick={() => handleReady()}>Not Ready</button> : <button onClick={() => handleReady()}>Ready</button>
                    }
                    {gameStart ? <h1>Game is starting</h1> : <h1>Waiting for others players</h1>}
                </div>
            </div>
            </div>
        </>
    )
}

export default Lobby