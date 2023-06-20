import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        //requires and unique ko cmt out kr bas
        type: String,
        // required: true,
        // unique: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
});

export default mongoose.model('Category', categorySchema)