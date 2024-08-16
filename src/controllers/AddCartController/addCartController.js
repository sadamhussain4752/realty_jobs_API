// controllers/AddCartController.js
const AddCart = require('../../models/AddCart/AddCartModel');
const Product = require('../../models/ProductModel/NewModelProduct');
const User = require('../../models/UserModel/User');

const LANGID = {
    1: "IND",
    2: "JPN",
    3: "KOR",
    4: "AUS",
  };

// Create a new item in the cart
exports.createCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity  } = req.body;
    const existingCartItem = await AddCart.findOne({ userId, productId });


    // Ensure that the quantity is a number
    const parsedQuantity = parseInt(quantity, 10);

    if (!isNaN(parsedQuantity) && existingCartItem) {
      // If it exists, update the quantity
      existingCartItem.quantity += parsedQuantity;
      await existingCartItem.save();
      res.status(200).json({ success: true, cartItem: existingCartItem });
    } else if (!isNaN(parsedQuantity)) {
      // If it doesn't exist, create a new cart item
      const newCartItem = await AddCart.create({
        userId,
        productId,
        quantity: parsedQuantity,
      });
      res.status(200).json({ success: true, cartItem: newCartItem });
    } else {
      // Handle the case where quantity is not a valid number
      res.status(400).json({ success: false, error: 'Invalid quantity' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Get all add cart for a specific user
exports.getAddcart = async (req, res) => {
    // try {
    //   const userId = req.params.id;
  
    //   // Fetch all add cart items for the user
    //   const AddCarts = await AddCart.find({ userId });
  
    //   // Create an array to store promises for fetching product details
    //   const productPromises = AddCarts.map(async (item) => {
    //     // Fetch product details for each add cart item
    //     const product = await Product.findById(item.productId);
    //     return { ...item._doc, product }; // Combine add cart item and product details
    //   });
  
    //   // Wait for all promises to resolve
    //   const AddCartsWithProducts = await Promise.all(productPromises);
  
    //   res.status(200).json({ success: true, AddCarts: AddCartsWithProducts });
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ success: false, error: "Server error" });
    // }
    try {
      const userId = req.params.id;
    
      // Fetch all add cart items
      const addCarts = await AddCart.find();
    
      // Create an array to store promises for fetching product and user details
      const productPromises = addCarts.map(async (item) => {
        // Fetch product details for each add cart item
        const product = await Product.findById(item.productId); // Assuming you have a field productId in AddCart schema
        if (product && product.company_id === userId) {
          const user = await User.findById(item.userId); // Assuming you have a field userId in AddCart schema
    
          if (user) {
            return { ...item._doc, product, user }; // Combine add cart item, product, and user details
          }
        }
        return null;
      });
    
      // Wait for all promises to resolve
      let addCartsWithProducts = await Promise.all(productPromises);
    
      // Filter out any null values
      addCartsWithProducts = addCartsWithProducts.filter(item => item !== null);
    
      res.status(200).json({ success: true, addCarts: addCartsWithProducts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Server error" });
    }
    
    
    
  };


  // Get all add cart for a specific user
exports.getAddCompanycart = async (req, res) => {
  try {
  
    const userId = req.params.id;

    // Fetch all add cart items for the user
    const AddCarts = await AddCart.find();

    // Create an array to store promises for fetching product details
    const productPromises = AddCarts.map(async (item) => {
      // Fetch product details for each add cart item
      const product = await Product.findById({ company_id : userId});
      return { ...item._doc, product }; // Combine add cart item and product details
    });

    // Wait for all promises to resolve
    const AddCartsWithProducts = await Promise.all(productPromises);

    res.status(200).json({ success: true, AddCarts: AddCartsWithProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

  // Get all add cart for a specific user
exports.getCartItem = async (req, res) => {
  try {
    const {  productIds  } = req.body;

    // Fetch all add cart items for the user
    const AddCarts = productIds;

    // Create an array to store promises for fetching product details
    const productPromises = AddCarts.map(async (item) => {
      // Fetch product details for each add cart item
      const product = await Product.findById(item.productId);
      return { ...item, product }; // Combine add cart item and product details
    });

    // Wait for all promises to resolve
    const AddCartsWithProducts = await Promise.all(productPromises);

    res.status(200).json({ success: true, AddCarts: AddCartsWithProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
  
  
  

// Update quantity of an item in the cart
exports.updateCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const { quantity,savelater } = req.body;

    const existingCartItem = await AddCart.findByIdAndUpdate(
      cartItemId,
      { quantity,savelater },
      { new: true }
    );

    if (!existingCartItem) {
      return res
        .status(404)
        .json({ success: false, message: 'Cart item not found' });
    }

    res.status(200).json({ success: true, cartItem: existingCartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Delete an item from the cart
exports.deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    const existingCartItem = await AddCart.findById(cartItemId);

    if (!existingCartItem) {
      return res
        .status(404)
        .json({ success: false, message: 'Cart item not found' });
    }

    // Remove the Coupon from the database
    await AddCart.deleteOne({ _id: existingCartItem });

    res.status(200).json({ success: true, message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
