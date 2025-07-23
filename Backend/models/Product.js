const mongoose = require('mongoose');
// ✅ Define product schema
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String },

    // Artisan Info
    artisanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: { type: Boolean, default: false },
});

// ✅ Export model
module.exports = mongoose.model('Product', productSchema);
