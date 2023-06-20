import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const ProductDetails = () => {

    const params = useParams()
    // use curly braces we have sigle object
    const [product, setProduct] = useState({})
    const [relatedProducts, setRelatedProducts] = useState([])

    //initial product details
    useEffect(() => {
        if (params?.slug) getProduct()
    }, [params?.slug])

    //get product
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
            setProduct(data?.product);
            getSimilarProduct(data?.product._id, data?.product.category._id);
        } catch (error) {
            console.log(error);
        }
    }

    //get similar product
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data?.products)
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Layout>
            {/* <h1>Product Details</h1>
            {JSON.stringify(product, null, 4)} */}
            <div className="row container mt-4">
                <div className="col-md-6">
                    <img src={`/api/v1/product/product-photo/${product._id}`} className="card-img-top" alt={product.name} height="300" width={"350px"} />
                </div>
                <div className="col-md-6 ">
                    <h1 className='text-center'>Product Details</h1>
                    <h5>Name: {product.name}</h5>
                    <h5>Desription: {product.description}</h5>
                    <h5>Price: ${product.price}</h5>
                    {/* <h5>Shipping: {product.shipping}</h5> */}
                    <h5>Category: {product.category?.name}</h5>
                    <button class="btn btn-secondary ms-1">Add to Cart</button>
                </div>
            </div>
            <hr />
            <div className="row container">
                <h4>Similar Product</h4>
                {relatedProducts.length < 1 && (<p className='text-center'> No Similar Products</p>)}
                {/* {JSON.stringify(relatedProducts, null, 4)} */}
                <div className="d-flex flex-wrap">
                    {relatedProducts?.map(p => (

                        <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                            <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                            <div className="card-body">
                                <h5 className="card-title">{p.name}</h5>
                                <p className="card-text">{p.description.substring(0, 30)}....</p>
                                <p className="card-text"> $ {p.price}</p>

                                <button class="btn btn-secondary ms-1">Add to Cart</button>

                                {/* <p className="card-text">{p.price}</p>
                                        <p className="card-text">{p.quantity}</p> */}

                            </div>
                        </div>


                    ))}

                </div>
            </div>
        </Layout>
    )
}

export default ProductDetails