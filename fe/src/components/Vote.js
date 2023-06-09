import React, { useEffect, useState } from 'react'
import Draggable from 'react-draggable';

const Vote = ({ voteMemeObj, lastJsonMessage, sendJsonMessage }) => {

    const [countdown, setCountdown] = useState('')
    const [number, setNumber] = useState(0);
    const [vote, setVote] = useState(false)


    useEffect(() => {
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
        setVote(false)
    }, [voteMemeObj])

    function handleVote(vote) {
        setVote(true)
        sendJsonMessage({ type: vote, payload: voteMemeObj })
    }

    return (
        <div className='h-screen bg-[#373737]'>
            <div className='relative flex flex-col justify-center items-center h-screen py-8'>
                <div className='w-[75%] bg-[#3871F6] bg-opacity-20 py-2 rounded-t-lg border-2  border-black z-10'>
                    <div className='flex items-center justify-between md:mx-16 mx-4'>
                        <p className='font-semibold italic text-2xl drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white'>Vote: {number}/10</p>
                        <p className='font-semibold italic text-2xl drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white'>Time left: <span className='animate-ping'>{countdown}</span></p>
                    </div>
                </div>
                <div className='flex flex-col justify-center text-center items-center py-12 w-[75%] bg-gradient-to-b from-[#365CCC] to-[#4AA0ED] rounded-b-lg border-x-2 border-b-4 border-black'>
                        <img crossorigin src={voteMemeObj?.srcMeme} alt="meme" style={{"max-width": "none"}} className='md:w-[500px] md:h-[375px] w-[400px] h-[300px] drop-shadow-2xl rounded-md border-2 border-black border-opacity-30' />
                        {
                            voteMemeObj?.textArray?.map(function (item, i) {
                                console.log("item value", item)
                                return (
                                    <Draggable key={i} className=' z-20'
                                        positionOffset={{ x: '-50%', y: '-50%' }}
                                        position={{ x: item?.x, y: item?.y }}
                                    >
                                        <div className='absolute top-[50%] left-[50%] uppercase drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] text-white md:text-2xl text-xl font-bold  flex justify-center items-center z-20 ' style={{ '-webkit-text-stroke': '1px black' }}>
                                            <div className='relative'>
                                                <textarea placeholder='text' value={item?.text} spellCheck='false' style={{ resize: 'none' }} className='bg-transparent md:max-w-[600px] max-w-[300px] text-center overflow-hidden' />
                                            </div>
                                        </div>
                                    </Draggable>
                                )
                            })
                        }
                    <div className='mt-4 flex gap-4 justify-center w-full'>
                        {
                            !vote ? (<div className=' flex items-center justify-center rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-2 cursor-pointer hover:-translate-y-1 transition-transform' onClick={() => handleVote('UPVOTE')}><span className=' drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white uppercase font-semibold' style={{ '-webkit-text-stroke': '0.2px black' }}>Up Vote</span></div>
                            ) : (null)
                        }
                        {
                            !vote ? (<div className='flex items-center justify-center rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-2 cursor-pointer hover:translate-y-1 transition-transform' onClick={() => handleVote('DOWNVOTE')}><span className=' drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white uppercase font-semibold' style={{ '-webkit-text-stroke': '0.2px black' }}>Down Vote</span></div>
                            ) : (null)
                        }
                        {!vote ? (null) : (<div className='flex items-center justify-center rounded-lg border-2 border-b-4 bg-gradient-to-br from-[#9E9E9E] via-[#EFEFEF] to-[#9E9E9E] cursor-not-allowed border-black px-8 py-2'><span className=' drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white text-xl font-semibold' style={{ '-webkit-text-stroke': '0.2px black' }}>VOTED</span></div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Vote


{/*             {
                Object.keys(voteMemeObj).forEach(function(item, i) {
                    console.log("item value", item)
                     return (
                        <Draggable key={i} className=' z-20'
                            positionOffset={{ x: '-50%', y: '-50%' }}
                            position={item?.textArray}
                        >
                            <div className='absolute top-[50%] left-[50%] uppercase drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] text-white md:text-3xl text-xl font-bold  flex justify-center items-center z-20 ' style={{ '-webkit-text-stroke': '1px black' }}>
                                <div className='relative'> 
                                    <textarea placeholder='text' value={item?.textArray[0]?.text} spellCheck='false' style={{ resize: 'none' }} className={` bg-transparent' md:max-w-[600px] max-w-[300px] text-center overflow-hidden`} />
                                </div>
                            </div>
                        </Draggable>) 
                })}; */}