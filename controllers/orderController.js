import Order from '../models/order.js';
import sendEmail from '../utils/sendEmail.js';
// @desc    Create a new order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  const { customerName, email, products, totalPrice, status } = req.body;

  // Safely extract user ID regardless of whether auth middleware uses _id or id
  const user = req.user ? (req.user._id || req.user.id) : undefined;

  try {
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    if (!email) {
      return res.status(400).json({ message: "Customer email is required" });
    }

    const newOrder = new Order({
      user,
      customerName,
      email,
      products,
      totalPrice,
      status: status || 'Pending'
    });

    const savedOrder = await newOrder.save();

    // Prepare confirmation email HTML
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #4f46e5;">Thank you for your purchase! ⚡</h2>
        <p>Hi ${customerName || 'Customer'},</p>
        <p>We received your order <strong>#${savedOrder._id.toString().slice(-6)}</strong>!</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <p style="margin: 0; font-weight: bold;">Order Total: $${Number(totalPrice).toFixed(2)}</p>
          <p style="margin: 5px 0 0 0; font-size: 14px; color: #64748b;">Status: ${savedOrder.status}</p>
        </div>
        <p>We are processing your items and will update you on their status soon.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #64748b;">ShopVibe E-Commerce Store</p>
      </div>
    `;

    // Send email non-blockingly (without await) so the UI responds immediately
    sendEmail({
      to: email,
      subject: `Order Confirmation #${savedOrder._id.toString().slice(-6)} - ShopVibe`,
      html: emailHtml,
    }).catch((err) => console.error('Email sending error:', err));

    // Return successful response to the frontend
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin view)
// @route   GET /api/orders
const getOrders = async (req, res) => {
    try {
        // .populate('products.product') populates nested product details if structured as references
        const orders = await Order.find().populate('products.product', 'name price image');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id).populate('products.product', 'name price image');
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order (e.g., status updates)
// @route   PUT /api/orders/:id
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { customerName, email, products, totalPrice, status } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id, 
            { customerName, email, products, totalPrice, status }, 
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getOrders, getOrderById, updateOrder, deleteOrder };