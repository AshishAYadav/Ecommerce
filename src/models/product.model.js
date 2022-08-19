const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (value.length > 200) {
          throw new Error('Exceeded maximum product title length 200 chars');
        }
      },
    },
    description: {
      type: String,
      required: true,
      validate(value) {
        if (value.length > 1000) {
          throw new Error('Exceeded maximum product description length 1000 chars');
        }
      },
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (value.length > 100) {
          throw new Error('Exceeded maximum SKU length 100');
        }
      },
    },
    quantity: {
      type: Number,
      required: true,
      trim: true,
      min: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Available quantity must be 0 or greater');
        }
      },
    },
    category: {
      type: String,
      default: 'uncategorised',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} sku - The product's SKU
 * @param {ObjectId} [excludeProductId] - The id of the product to be excluded
 * @returns {Promise<boolean>}
 */
productSchema.statics.isSKUTaken = async function (sku, excludeProductId) {
  const product = await this.findOne({ sku, _id: { $ne: excludeProductId } });
  return !!product;
};

productSchema.pre('save', async function (next) {
  next();
});

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
