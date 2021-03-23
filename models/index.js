import mongoose from "mongoose";
import * as functions from "firebase-functions";

export const db = mongoose.connection;

db.on("connecting", () => console.log("connecting to MongoDB..."));
db.on("connected", () => console.log("MongoDB connected!"));
db.once("open", () => console.log("MongoDB connection opened!"));
db.on("reconnected", () => console.log("MongoDB reconnected!"));

db.on("error", error => {
    console.error("Error in MongoDb connection: " + error);
    mongoose.disconnect();
    connect();
});

db.on("disconnected", () => {
    console.log("MongoDB disconnected!");
    connect();
});

export async function connect() {
    await mongoose.connect(functions.config().database.url, { useNewUrlParser: true, useUnifiedTopology: true, autoReconnect: true });
}