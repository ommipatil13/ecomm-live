import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
// import { useAuth } from '../context/Auth';
import axios from 'axios';
// import { Button } from 'antd';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';

const HomePage = () => {

    const [cart, setCart] = useCart()

    // const [auth, setAuth] = useAuth()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [checked, setChecked] = useState([])
    const [radio, setRadio] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()


    //get all categories
    const getAllCategories = async () => {
        try {
            const { data } = await axios.get('/api/v1/category/get-category')
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        getAllCategories();
        getTotal();
    }, [])

    //get all products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            // const { data } = await axios.get('/api/v1/product/get-product');
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
            setLoading(false);
            setProducts(data.products);
        } catch (error) {
            setLoading(false)
            console.log(error);

        }
    }

    //get total count
    const getTotal = async () => {
        try {
            const { data } = await axios.get("/api/v1/product/product-count")
            setTotal(data?.total)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        //jab load more ka button click hoga toh hi condition apply hogi
        if (page === 1) return
        loadMore()

    }, [page])
    //load more
    const loadMore = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`/api/v1/product/product-list/${page}`)
            setLoading(false)
            setProducts([...products, ...data?.products])
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    //filter by category
    const handleFilter = (value, id) => {
        // let becoz changes some variables
        let all = [...checked]
        if (value) {
            all.push(id)
        } else {
            all = all.filter(c => c !== id)
        }
        setChecked(all)
    }

    useEffect(() => {
        if (!checked.length || !radio.length) getAllProducts();

    }, [checked.length, radio.length]);

    useEffect(() => {
        if (checked.length || radio.length) filterProduct()
    }, [checked, radio])

    // get filter product
    const filterProduct = async () => {
        try {
            const { data } = await axios.post('/api/v1/product/product-filters', { checked, radio })
            setProducts(data?.products)
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Layout title={"Shop Now Best Offers and Deals"}>
            {/* <h1 className='text-center'>HomePage E-comm</h1>
            <pre > {JSON.stringify(auth, null, 4)} </pre> */}
            <div className="row mt-3 ms-4 ">
                <div className="col-md-2">
                    {/* category filter */}
                    <h4 className='text-center mt-5'> Filter by Category </h4>
                    {/* ms-1 */}
                    <div className="d-flex flex-column ">
                        {categories?.map(c => (
                            <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>

                    {/* price filter */}
                    <h4 className='text-center mt-4'> Filter by Price </h4>
                    {/* ms-1 */}
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={e => setRadio(e.target.value)}>
                            {Prices?.map(p => (
                                <div key={p._id}>

                                    <Radio value={p.array}> {p.name} </Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>

                    <div className="d-flex flex-column mt-3">
                        <button className='btn btn-outline-danger' onClick={() => window.location.reload()}> Reset Filters</button>
                    </div>

                </div>
                <div className="col-md-9">
                    {/* {JSON.stringify(radio, null, 4)} */}
                    <h1 className='text-center'>Best Shopping Deals Hurry Up!</h1>
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

                                    <button class="btn btn-secondary ms-1"
                                        onClick={() => {
                                            setCart([...cart, p]);
                                            localStorage.setItem('cart', JSON.stringify([...cart, p]))
                                            toast.success("item addes to cart");
                                        }}>
                                        Add to Cart
                                    </button>

                                    {/* <p className="card-text">{p.price}</p>
                                        <p className="card-text">{p.quantity}</p> */}

                                </div>
                            </div>


                        ))}

                    </div>
                    <div className='m-2 p-3'>
                        {products && products.length < total && (
                            <button className='btn btn-outline-warning' onClick={(e) => { e.preventDefault(); setPage(page + 1); }}>
                                {loading ? "Loading ...." : "Load More"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </Layout>
    )
}

export default HomePage