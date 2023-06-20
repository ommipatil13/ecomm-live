import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/Auth'
import axios from 'axios'
import toast from 'react-hot-toast'

const Profile = () => {

    const [auth, setAuth] = useAuth()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

    //get user data
    useEffect(() => {
        const { name, email, phone, address } = auth?.user
        setName(name)
        setPhone(phone)
        setEmail(email)
        setAddress(address)
    }, [auth?.user])

    //form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        // toast.success("Register successfully");
        try {
            const { data } = await axios.put("/api/v1/auth/profile",
                { name, email, password, phone, address });
            if (data?.error) {
                toast.error(data?.error)
            } else {
                setAuth({ ...auth, user: data?.updatedUser })
                let ls = localStorage.getItem("auth")
                ls = JSON.parse(ls)
                ls.user = data.updatedUser
                localStorage.setItem("auth", JSON.stringify(ls))
                toast.success("profile updated")
            }

        } catch (error) {
            console.log(error);
            toast.error("Oh bro error")
        }
    }

    return (
        <Layout title={"Your Profile E-Comm"}>
            <div className="container-fluid p-3 m-3">

                <div className="row">
                    <div className="col-md-3"> <UserMenu /> </div>
                    <div className="col-md-9">

                        <div className="credential">

                            <form onSubmit={handleSubmit}>
                                <h1 className='title'>User Profile</h1>
                                <div className="mb-3">

                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder='Name'
                                        value={name} onChange={(e) => setName(e.target.value)} />
                                </div>

                                <div className="mb-3">

                                    <input type="email" className="form-control" id="exampleInputEmail1" placeholder='Email'
                                        value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                                </div>

                                <div className="mb-3">

                                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder='Password'
                                        value={password} onChange={(e) => setPassword(e.target.value)} disabled />
                                </div>

                                <div className="mb-3">

                                    <input type="number" className="form-control" id="exampleInputEmail1" placeholder='Phone'
                                        value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>

                                <div className="mb-3">

                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder='Address'
                                        value={address} onChange={(e) => setAddress(e.target.value)} />
                                </div>


                                <div className='d-flex justify-content-center'>
                                    <button type="submit" className="btn btn-primary"> Update </button>
                                </div>


                            </form>


                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    )
}

export default Profile