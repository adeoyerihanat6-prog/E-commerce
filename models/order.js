import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // Optional: Link order to the user who placed it
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Set to true if login is strictly required to checkout
  },

  customerName: {
    type: String,
    required: [true, 'Customer name is required']
  },

  email: {
    type: String,
    required: [true, 'Email is required']
  },

  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // References your Product model
        required: true
      },
      productName: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],

  totalPrice: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }

}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;