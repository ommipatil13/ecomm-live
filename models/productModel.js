import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.ObjectId,
        ref: "Category",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    photo: {
        data: Buffer, //use for save image
        contentType: String, //type file like jpg doc
    },
    shipping: {
        type: Boolean, //we can check order of status
    },

}, { timestamps: true });

export default mongoose.model("Products", productSchema);