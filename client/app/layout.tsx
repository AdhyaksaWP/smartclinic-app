import '@/styles/global.css'
import AuthProvider from '@/components/AuthProvider'
import React from 'react'

const RootLayout = ({ children }) => {
    return (
        <html>
            <body>
                <AuthProvider>  
                    {children}
                </AuthProvider>
            </body>
        </html>
    )
}

export default RootLayout;

