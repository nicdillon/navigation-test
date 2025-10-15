import { headers } from 'next/headers'
import HomeLink from './home-link'

export default async function About() {
  // Set no-store cache control
  const headersList = await headers()

  return (
    <>
      <div style={{
        padding: '20px',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>About This App</h2>
        <p style={{ marginBottom: '10px' }}>
          This is a simple Next.js application demonstrating server-side rendering with no caching.
        </p>
        <p style={{ marginBottom: '10px' }}>
          The home page displays the current server time, which updates on each refresh.
        </p>
        <p>
          This about page contains static content but is also server-rendered without caching.
        </p>
      </div>

      <nav style={{ marginTop: '20px' }}>
        <HomeLink
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          Back to Home
        </HomeLink>
      </nav>
    </>
  )
}

// Disable caching
export const dynamic = 'force-dynamic'
export const revalidate = 0
