import React from 'react';
import Navbar from './Navbar';

const layout = ({children}) => {
  return (
    <div className='min-h-screen bg-base-100'>
      <Navbar/>
      <main className='max-w-7x1 mx-auto px-3 py-6'>
        {children}
      </main>
    </div>
  )
}

export default layout
