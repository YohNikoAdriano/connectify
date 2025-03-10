import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'
import NavItems from './NavItems'
  

const MobileNav = () => {
  return (
    <nav className='md:hidden'>
        <Sheet>
            <SheetTrigger className='align-middle'>
                <Image 
                    src='/assets/icons/menu.svg'
                    alt='Nav Menu'
                    width={24}
                    height={24}
                    className="cursor-pointer"
                />
            </SheetTrigger>

            <SheetContent className='flex flex-col gap-6 bg-white md:hidden'>
                <SheetTitle>
                    <Image src={'/assets/images/logo.svg'} width={128} height={38} alt='Connectify Logo'/>
                </SheetTitle>
                <Separator />
                <NavItems />
                {/* <SheetHeader>
                <SheetTitle>Are you absolutely sure?</SheetTitle>
                <SheetDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                </SheetDescription>
                </SheetHeader> */}
            </SheetContent>
        </Sheet>
    </nav>
  )
}

export default MobileNav
