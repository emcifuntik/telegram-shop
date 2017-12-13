const randomstring = require('randomstring');

function randomCode() {
  return randomstring.generate(4);
}

module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  const productSchema = new Schema({
    telegraphLink:{
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    vendorCode: {
      type: String,
      default: randomCode,
      index: true
    },
    images: {
      type: [String],
      default: null
    },
    description: {
      type: String,
      default: null
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    }],
    unit: {
      type: String,
      enum: [
        'piece',
        'kilogram',
        'gram',
        'ton'
      ],
      required: true
    },
    available: {
      type: Number,
      default: 0
    },
    cost: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    minOrder: {
      type: Number,
      default: -1
    },
    maxOrder: {
      type: Number,
      default: -1
    }
  });
  return mongoose.model('Product', productSchema);
};
