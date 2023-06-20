import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

const CategoryProduct = () => {
    const params = useParams()
    const navigate = useNavigate()

    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])

    useEffect(() => {
        if (params?.slug) getProductByCat()
    }, [params?.slug])

    const getProductByCat = async () => {
        try {
            const { data } = await axios.get(`/api/v1/product/product-category/${params.slug}`)
            setProducts(data?.products)
            setCategory(data?.category)
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Layout>
            <div className="container mt-3">
                <h3 className='text-center'> Category - {category?.name} </h3>
                <h5 className='text-center'> {products?.length} results found</h5>
                <div className="row">
                    <div className="col-md-9 offset-1">
                        {/* {JSON.stringify(radio, null, 4)} */}
                        {/* <h1 className='text-center'>All Products</h1> */}
                        {/* flex-wrap yeh images yani card yani products ko niche leke jata h abi kaise straight leke ja rha h na */}
                        <div className="d-flex flex-wrap">
                            {products?.map(p => (

                                <div className="card m-2" style={{ width: '18rem' }} key={p._id}>
                                    <img src={`/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                                    <div className="card-body">
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text">{p.description.substring(0, 30)}....</p>
                                        <p className="card-text"> $ {p.price}</p>
                                        <button class="btn btn-primary ms-1"
                                            onClick={() => navigate(`/product/${p.slug}`)}>
                                            More Details</button>
                                        <button class="btn btn-secondary ms-1">Add to Cart</button>

                                        {/* <p className="card-text">{p.price}</p>
                                        <p className="card-text">{p.quantity}</p> */}

                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* <div className='m-2 p-3'>
                            {products && products.length < total && (
                                <button className='btn btn-warning' onClick={(e) => { e.preventDefault(); setPage(page + 1); }}>
                                    {loading ? "Loading ...." : "Load More"}
                                </button>
                            )}
                        </div> */}

                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CategoryProduct