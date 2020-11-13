import mongoose from "mongoose";

export async function connect () {
    await mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
}