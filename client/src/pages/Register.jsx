import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import Interests from '../components/Interests'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const { register, handleSubmit, formState: { errors } } = useForm();
    const [toggle, setToggle] = useState(true);
    const [interests, setInterests] = useState([]);

    async function registerUser(ev) {
        ev.preventDefault()
        const obj = { name, email, password, interests };
        console.log("Object before sending to backend ", obj);
        await axios.post('/register', {
            name, email, password, interests
        })
    }

    const changeToggle = () => {
        if (!name || !email || !password) {
            alert("Please fill all fields before proceeding")
        }
        else {
            setToggle(false);
        }
    }
    return (
        <form
            onSubmit={registerUser}
            className='flex flex-col gap-2 p-4 w-full rounded-md'>
            {
                toggle ? (
                    <div>
                        <input type="text" placeholder='Username'
                            value={name} onChange={ev => setName(ev.target.value)} />
                        <input type="email" placeholder='Email'
                            value={email} onChange={ev => setEmail(ev.target.value)} />
                        <input type="password" placeholder='Password'
                            value={password} onChange={ev => setPassword(ev.target.value)} />
                        {!toggle ? (<button type="submit">Register</button>) : null}
                        <button onClick={() => changeToggle()}>Next</button>
                    </div>
                ) : (
                    <Interests
                        setToggle={setToggle}
                        setInterests={setInterests}
                        interests={interests}
                    />
                )
            }
            {!toggle ? (<button type='Submit'> Register </button>) : null}
        </form>
    )
}