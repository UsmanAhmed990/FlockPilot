const Order = require('../models/Order');
const Food = require('../models/Food');
const OrderNotification = require('../models/Notification');
const mongoose = require('mongoose');
const sendEmail = require('../utils/sendEmail');
const { createAdminNotification } = require('./adminNotificationController');
const { createNotification } = require('./notificationController');

// Create New Order
exports.createOrder = async (req, res) => {
    try {
        let {
            items,
            deliveryAddress,
            paymentMethod,
            totalAmount,
            customerName,
            customerEmail,
            customerPhone,
            userId // Frontend can send userId if logged in
        } = req.body;

        if (typeof items === 'string') items = JSON.parse(items);
        if (typeof deliveryAddress === 'string') deliveryAddress = JSON.parse(deliveryAddress);

        let paymentScreenshotUrl = '';
        let paymentStatus = 'Pending';

        if (req.file) {
            paymentScreenshotUrl = '/uploads/payments/' + req.file.filename;
            paymentStatus = 'Pending Online Verification';
        }

        // Identify the seller of the first item
        let sellerId = null;
        if (items && items.length > 0) {
            const foodId = typeof items[0].food === 'object' ? items[0].food._id : items[0].food;
            const food = await Food.findById(foodId);
            if (food) {
                sellerId = food.seller;
                console.log(`Order Creation: Identified Seller ID ${sellerId} from Food ID ${foodId}`);
            } else {
                console.warn(`Order Creation: Food ${foodId} not found, could not identify seller.`);
            }
        }

        const order = await Order.create({
            items,
            deliveryAddress,
            paymentMethod,
            totalAmount,
            customerName,
            customerEmail,
            customerPhone,
            user: userId || null,
            isGuest: !userId,
            paymentStatus,
            paymentScreenshot: paymentScreenshotUrl,
            seller: sellerId
        });

        // Create Notification for the Seller
        if (sellerId) {
            await createNotification(req, sellerId, 'order_created', `New order from ${customerName || 'Customer'}.`);

            // Emit to seller's real-time dashboard
            const io = req.app.get('socketio');
            if (io) {
                io.to(sellerId.toString()).emit('newOrder', order);
            }
        }

        await createAdminNotification(req, 'order', `New Order placed: #${order._id.toString().slice(-6)}`);

        // Send Order Confirmation Email to Buyer (Non-blocking)
        if (customerEmail) {
            sendEmail({
                email: customerEmail,
                subject: `Order Confirmed! #${order._id.toString().slice(-6)} - FlockPilot`,
                html: `
                    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                        <div style="background: #1a1a1a; padding: 30px; text-align: center;">
                            <h1 style="color: #f59e0b; margin: 0; font-size: 24px; font-weight: 800;">Order Confirmed!</h1>
                            <p style="color: #888; margin: 8px 0 0; font-size: 14px;">Thank you for your order, ${customerName}!</p>
                        </div>
                        
                        <div style="padding: 30px; color: #333;">
                            <h3 style="border-bottom: 2px solid #f59e0b; padding-bottom: 10px; margin-top: 0;">Order Summary</h3>
                            <p style="font-size: 14px; color: #666;">Order ID: <b>#${order._id}</b></p>
                            
                            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                                <tr style="background: #f9f9f9;">
                                    <th style="text-align: left; padding: 12px; border-bottom: 1px solid #eee; font-size: 13px;">Item</th>
                                    <th style="text-align: center; padding: 12px; border-bottom: 1px solid #eee; font-size: 13px;">Qty</th>
                                    <th style="text-align: right; padding: 12px; border-bottom: 1px solid #eee; font-size: 13px;">Price</th>
                                </tr>
                                ${items.map(item => `
                                    <tr>
                                        <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px;">${item.name}</td>
                                        <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; text-align: center;">${item.quantity}</td>
                                        <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; text-align: right;">Rs. ${item.price * item.quantity}</td>
                                    </tr>
                                `).join('')}
                                <tr>
                                    <td colspan="2" style="padding: 12px; text-align: right; font-weight: 800; font-size: 16px;">Total Amount:</td>
                                    <td style="padding: 12px; text-align: right; font-weight: 800; font-size: 16px; color: #f59e0b;">Rs. ${totalAmount}</td>
                                </tr>
                            </table>

                            <div style="background: #fff8eb; border-left: 4px solid #f59e0b; padding: 15px; margin-top: 20px;">
                                <h4 style="margin: 0 0 5px 0; color: #d97706;">Delivery Details</h4>
                                <p style="margin: 0; font-size: 14px; color: #555;">
                                    <b>Address:</b> ${deliveryAddress.address}, ${deliveryAddress.city}<br/>
                                    <b>Phone:</b> ${customerPhone}
                                </p>
                            </div>

                            <p style="margin-top: 30px; font-size: 13px; color: #777; text-align: center;">
                                Our delivery boy will delievred your order to your door step...
                            </p>
                        </div>
                        
                        <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 11px; color: #aaa; border-top: 1px solid #eee;">
                            <p style="margin: 0;">This is an automated receipt. No need to reply.</p>
                            <p style="margin: 5px 0 0;">&copy; 2026 FlockPilot Platform</p>
                        </div>
                    </div>
                `
            }).catch(err => console.error('Order Confirmation Email Error:', err));
        }

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get My Orders (Customer)
exports.getMyOrders = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || req.query.userId;
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Chef/Seller Orders
exports.getChefOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ seller: userId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get All Orders
exports.getAdminAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name').sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Verify Payment
exports.verifyPayment = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.paymentStatus = 'BILL PAID ONLINE';
        order.paymentVerifiedAt = Date.now();
        await order.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Reject Payment
exports.rejectPayment = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.paymentStatus = 'PAYMENT REJECTED';
        await order.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
