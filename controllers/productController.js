import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from 'fs';
import braintree from "braintree";

import dotenv from "dotenv";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// var gateway = new braintree.BraintreeGateway({
//     environment: braintree.Environment.Sandbox,
//     merchantId: "68ymf93gh7zpw53q",
//     publicKey: "mw898dg92tw92mxs",
//     privateKey: "0f19e003a16043b96b0007a6df296087",
// });

export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "name is req" })

            case !description:
                return res.status(500).send({ error: "description is req" })

            case !price:
                return res.status(500).send({ error: "price is req" })

            case !category:
                return res.status(500).send({ error: "category is req" })

            case !quantity:
                return res.status(500).send({ error: "quantity is req" })

            case photo && photo.size > 1000000: //not greater 1mb
                return res.status(500).send({ error: "photo is req and should be less then 1mb" })
        }

        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save();
        res.status(201).send({
            success: true,
            message: "product created",
            products
        })

    }

    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "product creating error",
        })
    }
}

//get product contoller

export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: "get all product",
            products,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in get product",
            error: error.message,
        })
    }
}

//get single product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select("-photo").populate("category")
        res.status(200).send({
            success: true,
            message: "get single product",
            product,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error in get single product",
        })
    }
}

//get photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType) //yeh aayega photo k database se
            return res.status(200).send(product.photo.data);
        }

    }

    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in photo product",
            error,
        })
    }
}

//delete product
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: true,
            message: "product deleted",

        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in product delete",
            error,
        })
    }
}

//update product
export const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "name is req" })

            case !description:
                return res.status(500).send({ error: "description is req" })

            case !price:
                return res.status(500).send({ error: "price is req" })

            case !category:
                return res.status(500).send({ error: "category is req" })

            case !quantity:
                return res.status(500).send({ error: "quantity is req" })

            case photo && photo.size > 1000000: //not greater 1mb
                return res.status(500).send({ error: "photo is req and should be less then 1mb" })
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid,
            { ...req.fields, slug: slugify(name) }, { new: true }) //name dalna h nhi bas slug update hota h yeh dekh lena ek baar
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }

        await products.save();
        res.status(201).send({
            success: true,
            message: "product updated",
            products
        })

    }

    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error in update product",
        })
    }
}

//filter product
export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {}
        if (checked.length > 0) args.category = checked
        //we can check more in category and only one in price radio and gte mongodb cmd greater than equal
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in product filter",
            error,
        })
    }
}

//product count load more vala pagination
export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total,
        })
    } catch (error) {
        console.log(error);
        ree.status(400).send({
            success: false,
            message: "error in product count",
            error,
        })
    }
}

//product per page list on page
export const productListController = async (req, res) => {
    try {
        const perPage = 3
        const page = req.params.page ? req.params.page : 1
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "error in per page ctrl"
        })
    }
}

//search product
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }).select('-photo')
        res.json(results)
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in search",
            error,
        })
    }
}

//similar product
export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            //ne mot inculded
            _id: { $ne: pid },

        }).select("-photo").limit(3).populate('category');
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in related product",
            error,
        })
    }
}

//product category controller
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productModel.find({ category }).populate("category")
        res.status(200).send({
            success: true,
            category,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "error in product category",
        })
    }
}

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

//payment
export const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((i) => { total += i.price });
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,

            }
        },
            //idhar comma , nhi dala isliye error aaya
            function (error, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,

                    }).save()
                    res.json({ ok: true })
                }
                else {
                    res.status(500).send(error)
                }
            }
        )


    } catch (error) {
        console.log(error);
    }
}