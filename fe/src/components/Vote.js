import React, { useEffect, useState } from 'react'

const Vote = ({ voteMemeObj, lastJsonMessage }) => {

    const [countdown, setCountdown] = useState('')
    const [number, setNumber] = useState(0);


    useEffect(() => {
        console.log(lastJsonMessage)
        switch (lastJsonMessage?.type) {
            case "COUNTDOWN":
                setCountdown(lastJsonMessage.payload);
                break;
            default:
        }
    }, [lastJsonMessage])

    useEffect(() => {
        let n = number;
        n++;
        setNumber(n);
    }, [voteMemeObj])

    return (
        <div className='overflow-hidden h-screen bg-[#373737]'>
            <div className='relative flex flex-col justify-center items-center h-screen'>

                <div className='w-[75%] bg-[#3871F6] bg-opacity-20 py-2 rounded-t-lg border-2  border-black z-10'>
                    <div className='flex items-center justify-between md:mx-16 mx-4'>
                        <p className='font-semibold italic text-2xl drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white'>Vote: {number}/10</p>
                        <p className='font-semibold italic text-2xl drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white'>Time left: <span className='animate-ping'>{countdown}</span></p>
                    </div>
                </div>
                <div className='flex flex-col justify-center text-center items-center py-12 w-[75%] bg-gradient-to-b from-[#365CCC] to-[#4AA0ED] rounded-b-lg border-x-2 border-b-4 border-black'>
                    <img src={voteMemeObj?.srcMeme} alt="meme" className='md:w-[800px] md:h-[600px] w-[400px] h-[300px] drop-shadow-2xl rounded-md border-2 border-black border-opacity-30' />
                    <div className='mt-4 md:hidden rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-2 cursor-pointer hover:-translate-y-1 transition-transform' onClick={() => null}><span className=' drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white' style={{ '-webkit-text-stroke': '0.2px black' }}>New Text</span></div>
                    <div className='mt-4 flex gap-4 justify-center w-full'>
                        <div className='flex items-center justify-center rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-2 cursor-pointer hover:-translate-y-1 transition-transform' onClick={() => null}><span className=' drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white' style={{ '-webkit-text-stroke': '0.2px black' }}>Up Vote</span></div>
                        <div className='flex items-center justify-center rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-2 cursor-pointer hover:translate-y-1 transition-transform' onClick={() => null}><span className=' drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white' style={{ '-webkit-text-stroke': '0.2px black' }}>Down Vote</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Vote