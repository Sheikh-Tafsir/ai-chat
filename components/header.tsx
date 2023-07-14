import Link from 'next/link'
import * as React from 'react'

import { clearChats } from '@/app/actions'
import { ClearHistory } from '@/components/clear-history'
import { Sidebar } from '@/components/sidebar'
import { SidebarFooter } from '@/components/sidebar-footer'
import { SidebarList } from '@/components/sidebar-list'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { cn } from '@/lib/utils'

import { UserButton, auth } from '@clerk/nextjs'

export async function Header() {
  const { userId } = auth()
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex justify-center items-center">
        {userId ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              {/* @ts-ignore */}
              <SidebarList userId={userId} />
            </React.Suspense>
            <SidebarFooter>
              <ThemeToggle />
              <ClearHistory clearChats={clearChats} />
            </SidebarFooter>
          </Sidebar>
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            <IconNextChat className="w-6 h-6 mr-2 dark:hidden" inverted />
            <IconNextChat className="hidden w-6 h-6 mr-2 dark:block" />
          </Link>
        )}
        <div className="flex items-center">
          <IconSeparator className="w-6 h-6 text-muted-foreground/50" />
          {userId && <UserButton />}
        </div>
        <div className="absolute right-0 mx-4">
          <Button className="hover:bg-green-600">
            <Link
              target="_blank"
              href="https://funny-cajeta-8ff3de.netlify.app/pdfplatform"
            >
              Read AI Generated PDF's
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
