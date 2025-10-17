const express = require('express');
const mongoose = require('mongoose');
const Meal = require('../models/Meal');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all meals
router.get('/', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Demo mode: Return mock meals
      const mockMeals = [
        {
          id: 'demo_meal_1',
          name: 'Homemade Pizza',
          description: 'Delicious homemade pizza with fresh toppings',
          price: 12.99,
          image: 'https://via.placeholder.com/300x200?text=Pizza',
          seller: {
            id: 'demo_seller_1',
            name: 'Chef Mario',
            location: 'Downtown Kitchen'
          },
          available: true,
          createdAt: new Date()
        },
        {
          id: 'demo_meal_2',
          name: 'Chicken Curry',
          description: 'Authentic homemade chicken curry with rice',
          price: 15.99,
          image: 'https://via.placeholder.com/300x200?text=Curry',
          seller: {
            id: 'demo_seller_2',
            name: 'Chef Priya',
            location: 'Spice Corner'
          },
          available: true,
          createdAt: new Date()
        },
        {
          id: 'demo_meal_3',
          name: 'Chocolate Cake',
          description: 'Rich chocolate cake made from scratch',
          price: 8.99,
          image: 'https://via.placeholder.com/300x200?text=Cake',
          seller: {
            id: 'demo_seller_3',
            name: 'Baker Sarah',
            location: 'Sweet Delights'
          },
          available: true,
          createdAt: new Date()
        }
      ];

      return res.json({
        meals: mockMeals,
        demo: true,
        message: 'Demo mode - showing sample meals'
      });
    }

    const meals = await Meal.find().populate('seller', 'name location');
    res.json(meals);
  } catch (err) {
    console.error('Get meals error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get meals by seller
router.get('/seller', auth, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Demo mode: Return mock meals for the seller
      const mockMeals = [
        {
          id: 'demo_meal_seller_1',
          name: 'Special Pasta',
          description: 'Handmade pasta with secret sauce',
          price: 14.99,
          image: 'https://via.placeholder.com/300x200?text=Pasta',
          seller: req.user.id,
          available: true,
          createdAt: new Date()
        },
        {
          id: 'demo_meal_seller_2',
          name: 'Grilled Salmon',
          description: 'Fresh grilled salmon with herbs',
          price: 18.99,
          image: 'https://via.placeholder.com/300x200?text=Salmon',
          seller: req.user.id,
          available: true,
          createdAt: new Date()
        }
      ];

      return res.json({
        meals: mockMeals,
        demo: true,
        message: 'Demo mode - showing your sample meals'
      });
    }

    const meals = await Meal.find({ seller: req.user.id });
    res.json(meals);
  } catch (err) {
    console.error('Get seller meals error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add meal (seller only)
router.post('/', auth, async (req, res) => {
  const { name, description, price, image } = req.body;

  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Demo mode: Return mock meal creation response
      const mockMeal = {
        id: 'demo_meal_' + Date.now(),
        name,
        description,
        price,
        image: image || 'https://via.placeholder.com/300x200?text=New+Meal',
        seller: req.user.id,
        available: true,
        createdAt: new Date()
      };

      return res.json({
        meal: mockMeal,
        demo: true,
        message: 'Demo mode - meal created successfully (not saved to database)'
      });
    }

    const meal = new Meal({
      name,
      description,
      price,
      image,
      seller: req.user.id
    });

    await meal.save();
    res.json(meal);
  } catch (err) {
    console.error('Add meal error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update meal
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Demo mode: Return mock update response
      const mockUpdatedMeal = {
        id: req.params.id,
        ...req.body,
        seller: req.user.id,
        available: true,
        updatedAt: new Date()
      };

      return res.json({
        meal: mockUpdatedMeal,
        demo: true,
        message: 'Demo mode - meal updated successfully (not saved to database)'
      });
    }

    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    if (meal.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedMeal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMeal);
  } catch (err) {
    console.error('Update meal error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete meal
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Demo mode: Return mock delete response
      return res.json({
        message: 'Demo mode - meal deleted successfully (not saved to database)',
        demo: true
      });
    }

    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    if (meal.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Meal.findByIdAndRemove(req.params.id);
    res.json({ message: 'Meal removed' });
  } catch (err) {
    console.error('Delete meal error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
