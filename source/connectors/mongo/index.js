import mongoose from 'mongoose';

const { Schema } = mongoose;

const db = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${
  process.env.MONGO_DB
}`;

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const modelSchema = new Schema({
  message: Object,
  modelId: Number,
});

export default mongoose.model('Model', modelSchema);
