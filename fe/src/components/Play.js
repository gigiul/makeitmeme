import React, { useEffect, useState } from 'react'
import Draggable from 'react-draggable';


const Play = ({ lastJsonMessage, sendJsonMessage }) => {

    const [src, setSrc] = useState('')
    const [countdown, setCountdown] = useState()
    const [notSend, setNotSend] = useState(true)

    useEffect(() => {
        console.log(lastJsonMessage)
        console.log("src", src)
        switch (lastJsonMessage?.type) {
            case "START_GAME":
                setSrc(lastJsonMessage?.payload)
                break;
            case "SKIP_BASE":
                setSrc(lastJsonMessage?.payload)
                break;
            case "SKIP_LIMIT":
                alert(lastJsonMessage?.payload);
                break;
            case "COUNTDOWN":
                setCountdown(lastJsonMessage?.payload);
                console.log("bk count", lastJsonMessage?.payload)
                if (lastJsonMessage?.payload === 0 && notSend) {
                    handleSend("Tempo scaduto mio padre")
                }
                break;
            default:
        }
    }, [lastJsonMessage])

    function handleSkip() {
        sendJsonMessage({ type: "SKIP_BASE" })
    }

    function handleSend(text) {
        sendJsonMessage({ type: "MEME_DONE", payload: { src, text } })
        setNotSend(false)
    }

    return (
        <div className='overflow-hidden'>
            <div className='flex flex-col justify-center items-center h-screen'>
            <Draggable>
                <div className='uppercase drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,40)] text-white md:text-3xl text-xl font-bold md:w-[700px] w-[400px] flex justify-center items-center'>
                    <textarea spellCheck='false' style={{resize: 'none'}} className='bg-transparent w-full text-center overflow-hidden' />
                </div>
            </Draggable>
                <p className='font-semibold italic text-2xl'>Countdown: <span className='animate-ping'>{countdown}</span></p>
                <img src={src} alt="meme" className='md:w-[700px] w-[400px]' />
                <div className='mt-4 flex gap-4 justify-between w-full'>
                    <button className=' mx-16 border-black border-2 py-4 px-8 rounded-md' onClick={() => handleSkip()}>Skip</button>
                    <button className=' mx-16 border-black border-2 py-4 px-8 rounded-md' onClick={() => handleSend("Gerry scotti mio padre")}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Play