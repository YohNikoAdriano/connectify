import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className='border-t'>
        <div className='flex justify-between p-5 gap-5 wrapper'>
            <Link href={'/'}>
                <Image src={'/assets/images/logo.svg'} width={128} height={38} alt='Connectify Logo'/>
            </Link>
            <p>Copyright 2025. All Rights Reserved</p>
        </div>
    </footer>
  )
}

export default Footer
