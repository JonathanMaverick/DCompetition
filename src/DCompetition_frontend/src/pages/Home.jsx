import React, { useEffect, useState } from 'react'
import { DCompetition_backend_user } from "declarations/DCompetition_backend_user";

function Home() {
  const [id, setID] = useState('')
  useEffect(() => {
    const principalID = async() => {
        const principal = await DCompetition_backend_user.getPrincipalID()
        console.log(principal)
        setID(principal)
    }
    
    principalID()
  },[])  

  const signOut = async() => {
    await DCompetition_backend_user.clearPrincipalID()
    window.location.href = "/";
  }

  return (
    <div>
        <h1>Home Page</h1>
        {`Login as ${id}`}
        <br />
        <button onClick={signOut}>Sign Out</button>
    </div>
  )
}

export default Home