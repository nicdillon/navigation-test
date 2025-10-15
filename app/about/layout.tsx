'use client'

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (

        <div style={{ padding: '20px' }}>
            <h1>Server Time Display</h1>
            {children}
        </div>

    )
}
