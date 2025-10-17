const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Meal = require('../models/Meal');
const auth = require('../middleware/auth');

const router = express.Router();

// Get orders for buyer
router.get('/buyer', auth, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Demo mode: Return mock orders for buyer
      const mockOrders = [
        {
          id: 'demo_order_1',
          buyer: req.user.id,
          seller: 'demo_seller_1',
          meal: {
            id: 'demo_meal_1',
            name: 'Homemade Pizza',
            price: 12.99
          },
          quantity: 2,
          totalPrice: 25.98,
          status: 'confirmed',
          createdAt: new Date()
        },
        {
          id: 'demo_order_2',
          buyer: req.user.id,
          seller: 'demo_seller_2',
          meal: {
            id: 'demo_meal_2',
            name: 'Chicken Curry',
            price: 15.99
          },
          quantity: 1,
          totalPrice: 15.99,
          status: 'delivered',
          createdAt: new Date(Date.now() - 86400000) // Yesterday
        }
      ];

      return res.json({
        orders: mockOrders,
        demo: true,
        message: 'Demo mode - showing your sample orders'
      });
    }

    const orders = await Order.find({ buyer: req.user.id }).populate('meal seller', 'name price name');
    res.json(orders);
  } catch (err) {
    console.error('Get buyer orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get orders for seller
router.get('/seller', auth, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Demo mode: Return mock orders for seller
      const mockOrders = [
        {
          id: 'demo_order_seller_1',
          buyer: 'demo_buyer_1',
          seller: req.user.id,
          meal: {
            id: 'demo_meal_seller_1',
            name: 'Special Pasta',
            price: 14.99
          },
          quantity: 1,
          totalPrice: 14.99,
          status: 'pending',
          createdAt: new Date()
        },
        {
          id: 'demo_order_seller_2',
          buyer: 'demo_buyer_2',
          seller: req.user.id,
          meal: {
            id: 'demo_meal_seller_2',
            name: 'Grilled Salmon',
            price: 18.99
          },
          quantity: 2,
          totalPrice: 37.98,
          status: 'confirmed',
          createdAt: new Date(Date.now() - 172800000) // 2 days ago
        }
      ];

      return res.json({
        orders: mockOrders,
        demo: true,
        message: 'Demo mode - showing orders for your meals'
      });
    }

    const orders = await Order.find({ seller: req.user.id }).populate('meal buyer', 'name price name');
    res.json(orders);
  } catch (err) {
    console.error('Get seller orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Place order
router.post('/', auth, async (req, res) => {
  const { mealId, quantity } = req.body;

  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Demo mode: Return mock order creation response
      const mockOrder = {
        id: 'demo_order_' + Date.now(),
        buyer: req.user.id,
        seller: 'demo_seller_1',
        meal: {
          id: mealId,
          name: 'Demo Meal',
          price: 15.99
        },
        quantity: quantity || 1,
        totalPrice: 15.99 * (quantity || 1),
        status: 'pending',
        createdAt: new Date()
      };

      return res.json({
        order: mockOrder,
        demo: true,
        message: 'Demo mode - order placed successfully (not saved to database)'
      });
    }

    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    const order = new Order({
      buyer: req.user.id,
      seller: meal.seller,
      meal: mealId,
      quantity,
      totalPrice: meal.price * quantity
    });

    await order.save();
    res.json(order);
  } catch (err) {
    console.error('Place order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (seller only)
router.put('/:id', auth, async (req, res) => {
  const { status } = req.body;

  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Demo mode: Return mock order update response
      const mockUpdatedOrder = {
        id: req.params.id,
        buyer: 'demo_buyer_1',
        seller: req.user.id,
        meal: {
          id: 'demo_meal_1',
          name: 'Demo Meal',
          price: 15.99
        },
        quantity: 1,
        totalPrice: 15.99,
        status: status,
        updatedAt: new Date()
      };

      return res.json({
        order: mockUpdatedOrder,
        demo: true,
        message: `Demo mode - order status updated to ${status} (not saved to database)`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error('Update order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
