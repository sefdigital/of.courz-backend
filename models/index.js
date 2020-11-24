import mongoose from "mongoose";

const db = mongoose.connection;

db.on('connecting', () => console.log('connecting to MongoDB...'));
db.on('connected', () => console.log('MongoDB connected!'));
db.once('open', () => console.log('MongoDB connection opened!'));
db.on('reconnected', () => console.log('MongoDB reconnected!'));

db.on('error', () => {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected!');
    connect()
});

export async function connect() {
    await mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
}