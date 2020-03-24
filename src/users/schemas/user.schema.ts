import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../interfaces/user.interface';

export const UserSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  auth: {
    phone: {
      valid: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

UserSchema.pre<User>('save', function (next) {

  let user = this;

  if (!user.isModified('password')) {
    next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.checkPassword = function (attempt, callback) {
  const user = this;

  bcrypt.compare(attempt, user.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  })
}