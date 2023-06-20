// import React from 'react'
// import Layout from './../components/Layout/Layout';

// const About = () => {
//     return (
//         <Layout>
//             <h1>About Page</h1>
//         </Layout>
//     )
// }

// export default About 
import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
    return (
        <Layout title={"About Us"}>
            <div className="row pagesus ">
                <div className="col-md-6 ">
                    <img
                        src="/images/about.jpeg"
                        alt="contactus"
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="col-md-4">
                    <h1 className="bg-dark p-2 text-white text-center">About</h1>
                    <p className="text-justify mt-2">
                        Becoming India’s no. 1 fashion destination is not an easy feat. Sincere efforts, digital enhancements and a team of dedicated personnel with an equally loyal customer base have made Ommi E-Commerce the online platform that it is today.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default About;
