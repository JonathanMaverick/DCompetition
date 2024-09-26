import React, { useRef, useState } from 'react'
import { DContest_backend_user } from "declarations/DContest_backend_user";
import { useUserAuth } from '../context/UserContext';

function UpdateProfile() {
  const [username, setUsername] = useState("")
  const { getPrincipal } = useUserAuth();
  const inputRef = useRef(null)

  const handleChange = (e) => {
    const name = e.target.value
    setUsername(name)
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    const user = username
    const principal = await getPrincipal()

    const file = inputRef.current?.files[0]

    const profilePic = new Uint8Array(await file.arrayBuffer())

    await DContest_backend_user.updateProfile(principal, user, profilePic)
    console.log("success")
  }

  console.log(username)

  return (
    <div>
        <h1>Update Profile</h1>
        <form onSubmit={handleSubmit}>
            <input type="text" onChange={handleChange} placeholder='username' name='username' value={username}/>
            <input ref={inputRef} type="file" accept='image/*'/>
            <input type="submit" />
        </form>
    </div>
  )
}

export default UpdateProfile