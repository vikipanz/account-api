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

const UserSchema = new mongoose.Schema({
    userName: String,
    password: String 
  });
const User = mongoose.model('User', UserSchema);

const LRSchema = new mongoose.Schema({
    lrNum: {
        type: String,
        unique: true,  
        required: true
    },
    lrDate: Date,
    party: String,
    vehicalNo: String,
    from: String,
    to: String,
    ownBy: String,
    materialName: String,
    loadnetWt: String,
    unloadnetWt: String,
    rate: String,
    lrCheckedDate: Date,
    reportingDate: Date,
    unloadDate: Date,
    shortage: String,
    shortagePercent: String,
    transportName: String,
    advanceAmount: String,
    advanceRemark: String,
    dieselAmount: String,
    shortagePermissible: String,
    detention: String,
    loadDate: Date,
    dieselLtr: String,
    remark: String,
    others: String,
    serviceBill: String,
    fastTag: String,
    secondRemark: String
});

const LR = mongoose.model('LR', LRSchema);




// API Routes
app.post('/items', async (req, res) => {
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

app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.get('/users/:userName', async (req, res) => {
    const userName = req.params.userName;
    try {
      const users = await User.find();
      const user = users.filter(res=>res.userName===userName);
      if(!user) {
        res.status(404).json({error : 'User Not Found'});
      }
      else{
        res.status(200).json(user);
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.post('/lrRecord', async (req, res) => {
    const lrNumber = req.body.lrNum;
    try {
    const lrRecordId = await LR.findOne({ lrNum: lrNumber });
      if (!lrRecordId) {
        const lrRecord = new LR(req.body);
        await lrRecord.save();
        res.status(200).json(lrRecord);
      }
      else{
        return res.status(404).json({ error: 'Already Record Exists With Same LR' });
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
app.get('/lrRecord', async (req, res) => {
    try {
      const lrRecord = await LR.find();
      res.status(200).json(lrRecord);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

app.put('/lrRecord/:lrNum', async (req, res) => {
    const lrNumber = req.params.lrNum;
    try {
      const lrRecord = await LR.findOne({ lrNum: lrNumber });
      if (!lrRecord) {
        return res.status(404).json({ error: 'Record not Found' });
      }
      Object.assign(lrRecord, req.body);
      await lrRecord.save();
      res.status(200).json(lrRecord);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.delete('/lrRecord/:lrNum', async (req, res) => {
    const lrNumber = req.params.lrNum;
    try {
        const deletedRecord = await LR.findOneAndDelete({ lrNum: lrNumber });
        if (!deletedRecord) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json({ message: 'Record deleted successfully', deletedRecord });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
