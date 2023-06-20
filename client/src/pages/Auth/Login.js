import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
// import { toast } from 'react-toastify';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/Auth';

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [auth, setAuth] = useAuth()


    const navigate = useNavigate()
    const location = useLocation()

    //form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        // toast.success("Register successfully");
        try {
            const res = await axios.post("/api/v1/auth/login",
                { email, password });
            if (res && res.data.success) {
                //alert notification 
                toast.success(res.data && res.data.message)
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                });

                localStorage.setItem('auth', JSON.stringify(res.data));
                navigate(location.state || '/');

            }
            else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("Oh error")
        }


    }

    return (
        <Layout title={"Login E-Commerce"}>
            <div className="credential">
                {/* <h1>Sign Up  </h1> */}

                <form onSubmit={handleSubmit}>
                    <h1>LOGIN  </h1>

                    <div className="mb-3">

                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder='Email'
                            value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="mb-3">

                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder='Password'
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <div className='mt-2'>
                            <button type="button" className="btn btn-danger" onClick={() => { navigate('/forgot-password') }}>
                                Forgot Password
                            </button>
                        </div>
                    </div>






                </form>
                <img src="data:image/png;base64,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" height="250" />

            </div>
        </Layout>
    )
}

export default Login