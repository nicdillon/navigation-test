'use client'

import { useState } from 'react'

export default function CounterButton() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fff3e0',
      borderRadius: '8px',
      marginTop: '20px',
      textAlign: 'center'
    }}>
      <p style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
        Client-side Counter: <strong>{count}</strong>
      </p>
      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff9800',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f57c00'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff9800'}
      >
        Increment Counter
      </button>
      <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
        (This state is maintained on the client only)
      </p>
    </div>
  )
}
