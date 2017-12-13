module.exports = (mongoose) => {
    const Schema = mongoose.Schema;
    const passportLocalMongoose = require('passport-local-mongoose');
    const userSchema = new Schema({
      admin: {
        type: Boolean,
        default: true
      }
    });
    userSchema.plugin(passportLocalMongoose);
    return mongoose.model('User', userSchema);
  };