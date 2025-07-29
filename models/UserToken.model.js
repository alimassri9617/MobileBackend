// models/UserToken.js
import mongoose from 'mongoose';

const userTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
});

export default mongoose.model('UserToken', userTokenSchema);
