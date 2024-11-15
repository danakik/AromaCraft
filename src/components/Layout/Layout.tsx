import React from 'react'
import { Outlet } from 'react-router-dom'
import { SideBar } from '../SideBar/SideBar'
import './Layout.css'

export const Layout = () => {
    return (
        <div className="layout">
            <div className="sidebar-container">
                <SideBar />
            </div>
            <div className="content-container">
                <Outlet />
            </div>
        </div>
    )
}