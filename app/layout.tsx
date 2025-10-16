'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const lastRefresh = useRef(0)
  const wasPopState = useRef(false)
  const prevPathname = useRef(pathname)

  const safeRefresh = () => {
    const now = Date.now()
    if (now - lastRefresh.current > 100) {
      lastRefresh.current = now
      console.log('[refresh] calling router.refresh()')
      router.refresh()
    } else {
      console.log('[refresh] skipped (debounced)')
    }
  }

  // Listen for back/forward navigation
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      const currentPath = window.location.pathname
      console.log('[pageshow] fired:', e.persisted ? 'from bfcache' : 'normal show', 'path:', currentPath)
      if (e.persisted && currentPath === '/') {
        console.log('[pageshow] persisted → refresh')
        safeRefresh()
      }
    }

    const onPopState = () => {
      console.log('[popstate] fired, marking for refresh check')
      wasPopState.current = true
    }

    window.addEventListener('pageshow', onShow)
    window.addEventListener('popstate', onPopState)
    console.log('[listeners] attached (root, once)')

    return () => {
      window.removeEventListener('pageshow', onShow)
      window.removeEventListener('popstate', onPopState)
      console.log('[listeners] removed (root, unmount)')
    }
  }, [])

  // Refresh when navigating to root via back/forward
  useEffect(() => {
    if (pathname === '/' && prevPathname.current !== '/' && wasPopState.current) {
      console.log('[pathname effect] navigated to / via popstate → refresh')
      safeRefresh()
      wasPopState.current = false
    }
    prevPathname.current = pathname
  }, [pathname]) 

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