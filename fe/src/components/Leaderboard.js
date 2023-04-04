import React from 'react'
import { useNavigate } from "react-router-dom";

const Leaderboard = ({ scoreArray }) => {

    const navigate = useNavigate();

    const handleNextRound = () => {
        navigate('/play')
    }

    return (
        <div className='bg-[#373737]'>
            <div className='flex flex-col justify-center items-center py-8'>
                <div className='md:w-[75%] w-full bg-[#3871F6] bg-opacity-20 py-2 rounded-t-lg border-2  border-black z-10'>
                    <div className='flex items-center justify-between md:mx-16 mx-4'>
                        <p className='font-semibold italic text-2xl drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white'>Round 1/3</p>
                        <p className='font-semibold italic text-2xl drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white'>Next Round: 23s</p>                    </div>
                </div>
                <div className='relative h-full flex flex-col gap-4 md:justify-center text-center items-left py-12 md:w-[75%] w-full bg-gradient-to-b from-[#365CCC] to-[#4AA0ED] rounded-b-lg border-x-2 border-b-4 border-black'>
                    <div className='flex'>
                        <div className='ml-8 flex flex-col gap-8'>
                            {
                                scoreArray?.map((item, i) => {
                                    return (
                                        <div key={i} className=''>
                                            <div className='w-full bg-[#37435D] py-2 rounded-t-lg border-2  border-black z-10'>
                                                <div className='flex items-center justify-between mx-2'>
                                                    <p className='font-semibold italic text-2xl drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white'>{i + 1}.{' '}{item.clientID}</p>
                                                    { (item.score >= 0) ? (<p className='font-semibold italic text-2xl drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white'>+{item.score}pt</p>) : (<p className='font-semibold italic text-2xl drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white'>{item.score}pt</p>)}
                                                </div>
                                            </div>
                                            <img src={item.srcMeme} alt="meme" className='lg:w-[500px] lg:h-[375px] md:w-[400px] md:h-[300px] w-[160px] h-[120px] drop-shadow-2xl rounded-md rounded-t-none border-2 border-black border-t-0' />
                                        </div>
                                    )

                                })

                            }
                        </div>
                        <div className='w-full'>
                            <div className='w-[75%] m-auto bg-[#37435D] py-2 rounded-lg border-2  border-black z-10 drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)]'>
                                <div className='flex items-center justify-center w-full border-b-2 border-black border-opacity-50 pb-3 '>
                                    <p className='font-semibold italic md:text-2xl drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white text-xl'>Leaderboard</p>
                                </div>
                                <ul className='mt-4 bg-gradient-to-b from-[#365CCC] to-[#4AA0ED] w-[95%] m-auto rounded-md border-2 border-black border-opacity-50'>
                                    {
                                        scoreArray?.map((item, i) => {
                                            return (
                                                <li key={i} className='p-4 border-b-2 border-black border-opacity-50 last:border-b-0'>
                                                <div className='flex lg:flex-row flex-col md:justify-between md:gap-0 gap-2'>
                                                    <div className='flex text-center md:justify-center items-center'>
                                                        <p className='font-bold drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white'>{i + 1}. </p>
                                                        <img className='ml-2 rounded-full' src='https://avatars.githubusercontent.com/u/82161967?v=4' width={30}></img>
                                                        <h3 className='ml-2 font-semibold italic drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white text-xl'>{item.clientID}</h3>
                                                    </div>
                                                    <div className='flex text-center justify-center items-center gap-1 font-bold whitespace-nowrap'>
                                                        <p className='drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white text-l'>{4 + (10 - i)} pt</p>
                                                        <p className={`${(item.score >=0) ? 'text-green-700' : 'text-red-600'} font-bold drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide`}>({item.score})</p>
                                                    </div>
                                                </div>
                                            </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 flex gap-4 justify-center w-full'>
                        <div className='flex items-center justify-center rounded-lg border-2 border-b-4 bg-[#E9C543] border-black px-8 py-2 cursor-pointer hover:-translate-y-1 transition-transform' onClick={() => handleNextRound()}><span className=' drop-shadow-[0_2px_1.2px_rgba(0,0,0,90)] tracking-wide text-white' style={{ '-webkit-text-stroke': '0.2px black' }}>Next Round</span></div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Leaderboard