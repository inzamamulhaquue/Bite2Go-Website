const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();
const mongoose = require('mongoose');

// Add item to cart
router.post('/add', async (req, res) => {
    try {
        const { userId, productId, price } = req.body;

        if (!userId || !productId || !price) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid productId format" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalAmount: 0 });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ productId: new mongoose.Types.ObjectId(productId), quantity: 1, price });
        }

        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        console.log("Updated Cart:", cart);
        await cart.save();

        res.status(200).json({ success: true, message: "Product added to cart", cart });
    } catch (error) {
        console.error("Cart Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get user cart
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update cart item quantity
router.put('/update', async (req, res) => {
    try {
        const { userId, productId, action } = req.body;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, error: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(i => i.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }

        // Increase or Decrease Quantity
        if (action === 'increase') {
            if (cart.items[itemIndex].quantity >= 10) {
                return res.status(400).json({ success: false, error: 'Maximum limit reached (10 items)' });
            }
            cart.items[itemIndex].quantity += 1;
        } else if (action === 'decrease') {
            cart.items[itemIndex].quantity -= 1;

            // Remove item if quantity reaches 0
            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            }
        }

        // Recalculate totalAmount
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        // If cart becomes empty, delete the cart
        if (cart.items.length === 0) {
            await Cart.deleteOne({ userId });
            return res.status(200).json({ success: true, emptyCart: true });
        }

        await cart.save();
        res.status(200).json({ success: true, updatedCart: cart });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});




// Checkout: Save address
router.post('/checkout', async (req, res) => {
    try {
        const { userId, address } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        cart.address = address;
        await cart.save();

        res.status(200).json({ message: 'Address saved. Proceed to payment.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// dlete cart 
router.delete('/remove', async (req, res) => {
    try {
        const { userId, productId  } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'cart not found' });
        }

        // Filter out the item to remove
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        // Update the totalAmount
        cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        // If the cart is empty after removing the item, delete the cart itself
        if (cart.items.length === 0) {
            await Cart.deleteOne({ userId });
            return res.status(200).json({ message: 'Cart is empty. Redirecting...', emptyCart: true });
        }
        await cart.save();
        res.status(200).json({ message: 'Item removed successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});



module.exports = router;






// const express = require('express');
// const Cart = require('../models/Cart');
// const router = express.Router();
// const mongoose = require('mongoose');

// // Add item to cart
// router.post('/add', async (req, res) => {
//     try {
//         const { userId, productId, price } = req.body;

//         if (!userId || !productId || !price) {
//             return res.status(400).json({ error: "Missing required fields" });
//         }

//         // Validate ObjectId format
//         if (!mongoose.Types.ObjectId.isValid(productId)) {
//             return res.status(400).json({ error: "Invalid productId format" });
//         }

//         let cart = await Cart.findOne({ userId });

//         if (!cart) {
//             cart = new Cart({ userId, items: [], totalAmount: 0 });
//         }

//         const existingItem = cart.items.find(item => item.productId.toString() === productId);
//         if (existingItem) {
//             existingItem.quantity += 1;
//         } else {
//             cart.items.push({ productId: new mongoose.Types.ObjectId(productId), quantity: 1, price });
//         }

//         cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
//         console.log("Updated Cart:", cart);
//         await cart.save();

//         res.status(200).json({ success: true, message: "Product added to cart", cart });
//     } catch (error) {
//         console.error("Cart Error:", error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Get user cart
// router.get('/:userId', async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
//         res.status(200).json(cart);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Update cart item quantity
// router.put('/update', async (req, res) => {
//     try {
//         const { userId, productId, action } = req.body;
//         let cart = await Cart.findOne({ userId });

//         if (!cart) return res.status(404).json({ error: 'Cart not found' });

//         const item = cart.items.find(i => i.productId.toString() === productId);
//         if (!item) return res.status(404).json({ error: 'Item not found' });

//         item.quantity = action === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
//         cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
//         await cart.save();

//         res.status(200).json(cart);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Checkout: Save address
// router.post('/checkout', async (req, res) => {
//     try {
//         const { userId, address } = req.body;
//         const cart = await Cart.findOne({ userId });

//         if (!cart) return res.status(404).json({ error: 'Cart not found' });

//         cart.address = address;
//         await cart.save();

//         res.status(200).json({ message: 'Address saved. Proceed to payment.' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // dlete cart 
// router.delete('/remove', async (req, res) => {
//     try {
//         const { userId, productId  } = req.body;

//         let cart = await Cart.findOne({ userId });

//         if (!cart) {
//             return res.status(404).json({ message: 'cart not found' });
//         }

//         // Filter out the item to remove
//         cart.items = cart.items.filter(item => item.productId.toString() !== productId);

//         // Update the totalAmount
//         cart.totalAmount = cart.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

//         // If the cart is empty after removing the item, delete the cart itself
//         if (cart.items.length === 0) {
//             await Cart.deleteOne({ userId });
//             return res.status(200).json({ message: 'Cart is empty. Redirecting...', emptyCart: true });
//         }
//         await cart.save();
//         res.status(200).json({ message: 'Item removed successfully', cart });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error });
//     }
// });



// module.exports = router;
