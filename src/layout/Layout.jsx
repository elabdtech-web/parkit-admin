import React from 'react'
import Navbar from '../components/navbar/Navbar'
import Topbar from '../components/topbar/Topbar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
      <Navbar/>
      <Topbar/>
      <Outlet/>
    </div>
  )
}
