import React, { useEffect, useState } from 'react'
import Draggable from 'react-draggable';


const Play = ({ lastJsonMessage, sendJsonMessage, src }) => {

    const [srcMeme, setSrcMeme] = useState(src)
    const [countdown, setCountdown] = useState()
    const [notSend, setNotSend] = useState(true)
    const [text, setText] = useState("");
    const [text2, setText2] = useState("");
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const [pos2, setPos2] = useState({ x: 0, y: 0 })

    useEffect(() => {
        switch (lastJsonMessage?.type) {
            case "SKIP_BASE":
                setSrcMeme(lastJsonMessage?.payload)
                break;
            case "SKIP_LIMIT":
                alert(lastJsonMessage?.payload);
                break;
            case "COUNTDOWN":
                setCountdown(lastJsonMessage?.payload);
                if (lastJsonMessage?.payload === 0 && notSend) {
                    handleSend("Tempo scaduto mio padre", pos)
                }
                break;
            default:
        }
    }, [lastJsonMessage])

    function handleSkip() {
        sendJsonMessage({ type: "SKIP_BASE" })
    }

    function handleSend(text, coordinates) {
        let textObj = {};
        textObj.text = text;
        textObj.x = coordinates.x;
        textObj.y = coordinates.y;
        sendJsonMessage({ type: "MEME_DONE", payload: { srcMeme, textObj } })
        setNotSend(false)
    }

    function textAreaAdjust(element) {
        element.style.height = "1px";
        element.style.height = (25 + element.scrollHeight) + "px";
        element.style.width = (25 + element.scrollWidth) + "px";
    }

    function handleDrag(e, data) {
        const { x, y } = pos;
        setPos({ x: x + data.deltaX, y: y + data.deltaY });
        console.log("x", pos.x, "y", pos.y)
    }
    function handleDrag2(e, data) {
        const { x, y } = pos2;
        setPos2({ x: x + data.deltaX, y: y + data.deltaY });
        console.log("x", pos.x, "y", pos.y)
    }

    return (
        <div className='overflow-hidden h-screen bg-[#373737] '>
            <div className='relative flex flex-col justify-center items-center h-screen'>
                <Draggable className=' z-20'
                    defaultPosition={{ x: 0, y: 0 }}
                    position={pos}
                    onDrag={handleDrag}>
                    <div className='absolute top-0 left-0 uppercase drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] text-white md:text-3xl text-xl font-bold  flex justify-center items-center z-20 ' style={{ '-webkit-text-stroke': '1px black' }}>
                        <textarea placeholder='text' value={text} onInput={(event) => {
                            setText(event.target.value);
                            textAreaAdjust(event.target);
                        }} spellCheck='false' style={{ resize: 'none' }} className={` bg-${text ? 'transparent' : 'black/50'} md:max-w-[600px] max-w-[300px] text-center overflow-hidden`} />
                    </div>
                </Draggable>
                <Draggable className=' z-20'
                    defaultPosition={{ x2: 0, y2: 0 }}
                    position={pos2}
                    onDrag={handleDrag2}>
                    <div className='absolute top-0 left-0 uppercase drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] text-white md:text-3xl text-xl font-bold  flex justify-center items-center z-20 ' style={{ '-webkit-text-stroke': '1px black' }}>
                        <textarea placeholder='text' value={text2} onInput={(event) => {
                            setText2(event.target.value);
                            textAreaAdjust(event.target);
                        }} spellCheck='false' style={{ resize: 'none' }} className={` bg-${text ? 'transparent' : 'black/50'} md:max-w-[600px] max-w-[300px] text-center overflow-hidden`} />
                    </div>
                </Draggable>
                <div className='w-[75%] bg-[#3871F6] bg-opacity-20 flex items-center justify-center py-2 rounded-t-lg border-2  border-black z-10'>
                    <p className='font-semibold italic text-2xl drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white'>Countdown: <span className='animate-ping'>{countdown}</span></p>
                </div>
                <div className='flex flex-col justify-center text-center items-center py-12 w-[75%] bg-gradient-to-b from-[#365CCC] to-[#4AA0ED] rounded-b-lg border-x-2 border-b-4 border-black'>
                    <img src={srcMeme} alt="meme" className='md:w-[800px] md:h-[600px] w-[400px] h-[300px] drop-shadow-2xl rounded-md border-2 border-black border-opacity-30' />
                    <div className='mt-4 flex gap-4 justify-center w-full'>
                        <div className='flex items-center justify-center rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-2 cursor-pointer hover:-translate-y-1 transition-transform' onClick={() => handleSkip()}><span className=' drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white' style={{ '-webkit-text-stroke': '0.2px black' }}>Skip</span></div>
                        <div className='flex items-center justify-center rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-2 cursor-pointer hover:-translate-y-1 transition-transform' onClick={() => handleSend("Prova con coordinate", pos)}><span className=' drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white' style={{ '-webkit-text-stroke': '0.2px black' }}>Send Meme</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Play