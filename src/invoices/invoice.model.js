'use strict';

import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'orderId es obligatorio']
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'restaurantId es obligatorio']
    },
    customer: {
      name: String,
      email: String
    },
    items: [
      {
        menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    total: Number,
    issuedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true, versionKey: false }
);

invoiceSchema.index({ orderId: 1 });
invoiceSchema.index({ restaurantId: 1 });

export default mongoose.model('Invoice', invoiceSchema);
