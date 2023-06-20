import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.ObjectId,
        //and yaha products
        ref: 'Products',
    },],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        //idhar p users daldena
        ref: 'users',
    },
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancel"],
    },

},
    { timestamps: true }
);

export default mongoose.model('Order', orderSchema);