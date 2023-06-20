// import React from 'react'
// import Layout from './../components/Layout/Layout';

// const Policy = () => {
//     return (
//         <Layout><h1>Policy Privacy</h1></Layout>
//     )
// }

// export default Policy
import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
    return (
        <Layout title={"Privacy Policy"}>
            <div className="row pagesus ">
                <div className="col-md-6 ">
                    <img
                        src="/images/contactus.jpeg"
                        alt="contactus"
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="col-md-4">
                    <h1 className="bg-dark p-2 text-white text-center">Privacy Policy</h1>
                    <p>Privacy Policy Please don't copy do it by yourself if you need some reference or help then you can happyily
                        visit.

                    </p>
                    <p>Thank you.</p>

                </div>
            </div>
        </Layout >
    );
};

export default Policy;
