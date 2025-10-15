import { headers } from 'next/headers'
import CounterButton from './counter-button'
import Link from 'next/link'
import { useEffect } from 'react'


async function getCurrentTime() {
  // Server-side function that returns the current time
  const now = new Date()
  return now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })
}

export default async function Home() {
  // Set no-store cache control
  const headersList = await headers()

  const time = await getCurrentTime()


  return (
    <main>
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        padding: '20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        {time}
      </div>
      <p style={{ marginTop: '20px', color: '#666' }}>
        Refresh the page to see the time update (no caching)
      </p>

      <CounterButton />

      <nav style={{ marginTop: '20px' }}>
        <Link
          href="/about"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          Go to About Page
        </Link>
      </nav>
    </main>
  )
}

// Disable caching
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0
