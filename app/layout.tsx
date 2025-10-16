'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const wasPopState = useRef(false)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    const onPopState = () => {
      wasPopState.current = true
    }

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted && pathname === '/') {
        router.refresh()
      }
    }

    window.addEventListener('popstate', onPopState)
    window.addEventListener('pageshow', onPageShow)

    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [])

  useEffect(() => {
    if (pathname === '/' && prevPathname.current !== '/' && wasPopState.current) {
      router.refresh()
      wasPopState.current = false
    }
    prevPathname.current = pathname
  }, [pathname, router]) 

  return (
    <html lang="en">
      <body>
        <div style={{ padding: '20px' }}>
          <h1>Server Time Display</h1>
          {children}
        </div>
      </body>
    </html>
  )
}