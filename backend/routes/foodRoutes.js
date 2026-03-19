const express = require('express');
const router = express.Router();
const {
    addFood,
    updateFood,
    deleteFood,
    getAllFoods,
    getFoodDetails,
    getChefMenu,
    getSellerFoods
} = require('../controllers/foodController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/add', isAuthenticated, authorizeRoles('seller'), addFood);
router.get('/my-products', isAuthenticated, authorizeRoles('seller'), getSellerFoods);
router.put('/:id', isAuthenticated, authorizeRoles('seller'), updateFood);
router.delete('/:id', isAuthenticated, authorizeRoles('seller'), deleteFood);
router.get('/', getAllFoods);
router.get('/:id', getFoodDetails);

module.exports = router;
