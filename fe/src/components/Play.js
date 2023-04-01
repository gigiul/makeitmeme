import React, { useEffect, useState } from 'react'
import Draggable from 'react-draggable';


const Play = ({ lastJsonMessage, sendJsonMessage, src }) => {

    const [srcMeme, setSrcMeme] = useState(src)
    const [countdown, setCountdown] = useState()
    const [notSend, setNotSend] = useState(true)
    const [textArray, setTextArray] = useState([{ text: "", x: 0, y: 0 }])

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
                    handleSend()
                }
                break;
            default:
        }
    }, [lastJsonMessage])

    function handleSkip() {
        sendJsonMessage({ type: "SKIP_BASE" })
    }

    function handleSend() {
        sendJsonMessage({ type: "MEME_DONE", payload: { srcMeme, textArray } })
        setNotSend(false)
    }

    function textAreaAdjust(element) {
        element.style.height = "1px";
        element.style.height = (25 + element.scrollHeight) + "px";
        element.style.width = (25 + element.scrollWidth) + "px";
    }

    function handleDrag(e, data, item, i) {
        item.x = item.x + data.deltaX;
        item.y = item.y + data.deltaY;
    }

    function handleText(e, i) {
        let textArrayCopy = [...textArray];
        textArray[i].text = e.target.value;
        setTextArray(textArrayCopy)
        textAreaAdjust(e.target)
    }

    function createNewTextField() {
        let textArrayCopy = [...textArray];
        textArrayCopy.push({ text: "", x: 0, y: 0 })
        setTextArray(textArrayCopy);
    }

    return (
        <div className='overflow-hidden h-screen bg-[#373737] '>
            <div className='relative flex flex-col justify-center items-center h-screen'>
                {
                    textArray.map(function (item, i) {
                        return (
                            <Draggable key={i} className=' z-20'
                                positionOffset={{ x: '-50%', y: '-50%' }}
                                position={item}
                                onDrag={(e, data) => handleDrag(e, data, item, i)}>
                                <div className='absolute top-[50%] left-[50%] uppercase drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] text-white md:text-3xl text-xl font-bold  flex justify-center items-center z-20 ' style={{ '-webkit-text-stroke': '1px black' }}>
                                    <textarea onChange={(e) => handleText(e, i, item)} placeholder='text' value={item.text} spellCheck='false' style={{ resize: 'none' }} className={` bg-${item.text ? 'transparent' : 'black/50'} md:max-w-[600px] max-w-[300px] text-center overflow-hidden`} />
                                </div>
                            </Draggable>)
                    })
                }
                <div className='w-[75%] bg-[#3871F6] bg-opacity-20 py-2 rounded-t-lg border-2  border-black z-10'>
                    <div className='flex items-center justify-between md:mx-16 mx-4'>
                        <div className=' md:flex hidden  items-center justify-center rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-2 cursor-pointer hover:-translate-y-1 transition-transform' onClick={() => createNewTextField()}><span className=' drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white' style={{ '-webkit-text-stroke': '0.2px black' }}>New Text</span></div>
                        <p className='font-semibold italic text-2xl drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white'>Time left: <span className='animate-ping'>{countdown}</span></p>
                    </div>
                </div>
                <div className='flex flex-col justify-center text-center items-center py-12 w-[75%] bg-gradient-to-b from-[#365CCC] to-[#4AA0ED] rounded-b-lg border-x-2 border-b-4 border-black'>
                    <img src={srcMeme} alt="meme" className='md:w-[800px] md:h-[600px] w-[400px] h-[300px] drop-shadow-2xl rounded-md border-2 border-black border-opacity-30' />
                    <div className='mt-4 md:hidden rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-2 cursor-pointer hover:-translate-y-1 transition-transform' onClick={() => createNewTextField()}><span className=' drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white' style={{ '-webkit-text-stroke': '0.2px black' }}>New Text</span></div>
                    <div className='mt-4 flex gap-4 justify-center w-full'>
                        <div className='flex items-center justify-center rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-2 cursor-pointer hover:-translate-y-1 transition-transform' onClick={() => handleSkip()}><span className=' drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white' style={{ '-webkit-text-stroke': '0.2px black' }}>Skip</span></div>
                        <div className='flex items-center justify-center rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-2 cursor-pointer hover:-translate-y-1 transition-transform' onClick={() => handleSend()}><span className=' drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white' style={{ '-webkit-text-stroke': '0.2px black' }}>Send</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Play