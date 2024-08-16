const mongoose = require('mongoose');

const AddCartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 },
    addedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    savelater: { type: Boolean, default: true },
    applicationDate: { type: Date, default: Date.now },
    positionApplied: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected',"Waiting"], default: 'Pending' },
    remarks: { type: String },
    // Add any other relevant fields you may need
});

const AddCart = mongoose.model('AddCart', AddCartSchema);

module.exports = AddCart;
