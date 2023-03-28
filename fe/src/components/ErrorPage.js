import React from 'react'
import {Link} from 'react-router-dom'

const ErrorPage = () => {
  return (
    <div className='flex flex-col gap-4 justify-center items-center h-screen m-auto'>
        <h1 className='font-bold text-xl'>Oops you are searching a page that doesn't exist!</h1>
        <p>Please click <Link to='/'>here</Link> to go back.</p>
    </div>
  )
}

export default ErrorPage