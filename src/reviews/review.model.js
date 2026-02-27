'use strict';

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      default: null
    },
    menuId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      default: null
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'rating is required']
    },
    comment: {
      type: String,
      default: null
    },
    userName: {
      type: String,
      default: 'Anónimo'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

reviewSchema.index({ restaurantId: 1 })
reviewSchema.index({ menuId: 1 })

reviewSchema.pre('validate', function (next) {
  if (!this.restaurantId && !this.menuId) {
    return next(new Error('Debe especificar restaurantId o menuId'))
  }
  next()
})

export default mongoose.model('Review', reviewSchema)
