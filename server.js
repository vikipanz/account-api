require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define a schema and model
const ItemSchema = new mongoose.Schema({
  lrNo: String,
  lrDate: Date 
});
const Item = mongoose.model('Item', ItemSchema);

// API Routes
app.post('/items', async (req, res) => {
    console.log(req.body);
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
