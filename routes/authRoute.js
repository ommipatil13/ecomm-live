import express from "express";
import { registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrderController, getAllOrderController, orderStatusController } from "../controllers/authController.js";
import { requireSignIn, isAdmin } from './../middlewares/authMiddleware.js';

//router object
const router = express.Router()

//routing 
//rigister method post 
router.post('/register', registerController);

//login method post
router.post('/login', loginController);

//forgot password
router.post('/forgot-password', forgotPasswordController)

//test routes
router.get('/test', requireSignIn, isAdmin, testController);

//protected routes user
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
})

//admin
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

//update profile
router.put('/profile', requireSignIn, updateProfileController)

//orders
router.get('/orders', requireSignIn, getOrderController)

//all orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrderController)

//order status update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)

// router.put(
//     "/order-status/:orderId",
//     requireSignIn,
//     isAdmin,
//     orderStatusController
// );





export default router;