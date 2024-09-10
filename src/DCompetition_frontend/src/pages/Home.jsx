import React, { useEffect, useState } from 'react'
import { DCompetition_backend_user } from "declarations/DCompetition_backend_user";
import { useUserAuth } from '../context/UserContext';

function Home() {
  const [id, setID] = useState('')
  const { getPrincipal , getUserData } = useUserAuth()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const principalID = async() => {
        const principal = await getPrincipal()
        setID(principal)
        console.log(principal)
    }
    principalID()
  },[getPrincipal])
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (id !== '') {
        console.log(id)
        const fetchedUser = await getUserData(id);
        console.log(fetchedUser)
        setUser(fetchedUser[0]);
      }
    };
    fetchUserData();
  }, [id !== '']);

  const signOut = async() => {
    await DCompetition_backend_user.clearPrincipalID()
    window.location.href = "/";
  }

  return (
    <div>
        <h1>Home Page</h1>
        {user ? `Login as username: ${user.username} and email ${user.email}` : 'Loading...'}
        <br />
        <button onClick={signOut}>Sign Out</button>
    </div>
  )
}

export default Home