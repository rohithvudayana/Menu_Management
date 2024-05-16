import mongoose, { Document, Schema } from "mongoose";

interface ItemModel extends Document {
  name: string;
  image: string;
  description: string;
  price: number;
  taxApplicability: boolean;
  tax: number;
}

const itemSchema = new Schema<ItemModel>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  taxApplicability: { type: Boolean, default: false },
  tax: { type: Number, default: 0 },
});

export const Item = mongoose.model<ItemModel>("Item", itemSchema);
