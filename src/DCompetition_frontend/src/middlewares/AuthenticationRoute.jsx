import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../context/UserContext'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { RouteList } from '../settings/RouteMenu'

function AuthenticationRoute() {

  const { getPrincipal } = useUserAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const getID = async() => {
        const id = await getPrincipal()
        if(id === ""){
            navigate("/")
        }
    }
    getID()
  },[])

  return (
    <>
    <Routes>
        {RouteList.map((menu, index) => (
            <Route key={index} path={menu.path} element={menu.element} />
        ))}
    </Routes>
    </>
  )
}

export default AuthenticationRoute
