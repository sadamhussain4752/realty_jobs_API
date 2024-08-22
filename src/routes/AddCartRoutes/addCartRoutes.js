// routes/AddCartRoutes.js
const express = require('express');
const router = express.Router();
const AddCartController = require('../../controllers/AddCartController/addCartController');

// Create a new item in the cart
router.post('/createCartItem', AddCartController.createCartItem);

// Get all based on User item in the cart

router.get('/addcartUser/:id', AddCartController.getAddcart);


router.get('/alladdcart', AddCartController.allgetAddcarts);


// Get all based on User item in the cart

router.post('/getCartItem', AddCartController.getCartItem);


router.get('getAddCompanyById/:id', AddCartController.getAddCompanycart)



// Update quantity of an item in the cart
router.put('/updateCartItem/:id', AddCartController.updateCartItem);

// Delete an item from the cart
router.delete('/deleteCartItem/:id', AddCartController.deleteCartItem);

module.exports = router;
