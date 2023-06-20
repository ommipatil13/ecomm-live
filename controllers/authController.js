import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';
import { comparePassword, hashPassword } from './../helpers/authHelper.js';
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body

        //validations
        if (!name) {
            return res.send({ message: 'Name is required' })
        }
        if (!email) {
            return res.send({ message: 'Email is required' })
        }
        if (!password) {
            return res.send({ message: 'Password is required' })
        }
        if (!phone) {
            return res.send({ message: 'Phone No is required' })
        }
        if (!address) {
            return res.send({ message: 'Address is required' })
        }
        if (!answer) {
            return res.send({ message: 'Answer is required' })
        }


        //check user by email
        const existingUser = await userModel.findOne({ email });

        //existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already user Register pls login",
            });
        }

        //register user
        const hashedPassword = await hashPassword(password);

        //save
        const user = await new userModel({ name, email, phone, address, password: hashedPassword, answer }).save();

        res.status(201).send({
            success: true,
            message: "user register successfully",
            user
        });

    }

    catch (error) {
        console.log(errpr);
        res.status(500).send({
            success: false,
            message: 'error in registration',
            error
        })
    }
};

//POST Login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body //kaha se aayega body se

        //validation
        if (!email || !password) {
            return res.status(200).send({
                success: false,
                message: "invalid email or password"
            })
        }

        //check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "email not registered "
            })
        }

        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "password not match"
            })
        }

        //token
        const token = await JWT.sign({ _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" });

        res.status(201).send({
            success: true,
            message: "login successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token

        });


    }

    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error
        })
    }
};

//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!email) {
            res.status(400).send({ message: "email is requires" })

        }
        if (!answer) {
            res.status(400).send({ message: "answer is requires" })

        }
        if (!newPassword) {
            res.status(400).send({ message: "new password is requires" })

        }
        //user
        const user = await userModel.findOne({ email, answer })
        //validation
        if (!user) {
            res.status(404).send({
                success: false,
                message: "wrong email or answer"
            })
        }
        const hashed = await hashPassword(newPassword)

        await userModel.findByIdAndUpdate(user.id, { password: hashed })
        res.status(200).send({
            success: true,
            message: "Password reset Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}


//test controller
export const testController = (req, res) => {
    try {
        res.send("protected routes");
    }
    catch (error) {
        console.log(error);
        res.send({ error });
    }
};

//update profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, phone, address, password } = req.body
        const user = await userModel.findById(req.user._id)
        //password
        if (password && password.length < 6) {
            return res.json({ error: "password is req 6 char long" })
        }
        const hashedPassword = password ? await hashedPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            email: email || user.email,
            address: address || user.address,
        }, { new: true })
        res.status(200).send({
            success: true,
            message: "profile updated",
            updatedUser,
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            error,
            message: "error in update profile"
        })
    }
}

//orders
export const getOrderController = async (req, res) => {
    try {
        const orders = await orderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name");
        res.json(orders);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in orders",
            error,
        })
    }
}

//all orders for admin

export const getAllOrderController = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate("products", "-photo").populate("buyer", "name").sort({ createdAt: "-1" })
        res.json(orders);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in all orders",
            error,
        })
    }
}

//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders)

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "error in update order",
            error,
        })
    }
}

//order status
// export const orderStatusController = async (req, res) => {
//     try {
//         const { orderId } = req.params;
//         const { status } = req.body;
//         const orders = await orderModel.findByIdAndUpdate(
//             orderId,
//             { status },
//             { new: true }
//         );
//         res.json(orders);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({
//             success: false,
//             message: "Error While Updateing Order",
//             error,
//         });
//     }
// };