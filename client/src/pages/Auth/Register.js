import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [answer, setAnswer] = useState("")

    const navigate = useNavigate()

    //form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        // toast.success("Register successfully");
        try {
            const res = await axios.post("/api/v1/auth/register",
                { name, email, password, phone, address, answer });
            if (res && res.data.success) {
                //alert notification 
                toast.success(res.data && res.data.message)
                navigate('/login')
            }
            else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("Oh bro error")
        }


    }

    return (
        <Layout title={"Sign Up E-Commerce"}>
            <div className="credential">
                {/* <h1>Sign Up  </h1> */}
                <img src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7875.jpg?w=2000" height="250" />
                <form onSubmit={handleSubmit}>
                    <h1>SIGN UP  </h1>
                    <div className="mb-3">

                        <input type="text" className="form-control" id="exampleInputEmail1" placeholder='Name'
                            value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>

                    <div className="mb-3">

                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder='Email'
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="mb-3">

                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder='Password'
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <div className="mb-3">

                        <input type="number" className="form-control" id="exampleInputEmail1" placeholder='Phone'
                            value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>

                    <div className="mb-3">

                        <input type="text" className="form-control" id="exampleInputEmail1" placeholder='Address'
                            value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>

                    <div className="mb-3">

                        <input type="text" className="form-control" id="exampleInputEmail1" placeholder='Sports'
                            value={answer} onChange={(e) => setAnswer(e.target.value)} required />
                    </div>

                    <div className='d-flex justify-content-center'>
                        <button type="submit" className="btn btn-primary">Sign Up </button>
                    </div>


                </form>

            </div>
        </Layout>
    )
}

export default Register