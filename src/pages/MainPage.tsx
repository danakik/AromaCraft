import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'primereact/button'

const MainPage = () => {
    return (
        <div style={{position: "absolute"}}>
            <h1>Hello, Electron!</h1>
            <p>Welcome to Main Page.</p>
            <Link to="/second">
                <Button label="Go to Second Page" icon="pi pi-arrow-right" />
            </Link>
        </div>
    )
}

export default MainPage
