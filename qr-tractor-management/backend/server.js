const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/tractorDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const tractorSchema = new mongoose.Schema({
  tractorId: String,
  tractorName: String,
  issueDate: String,
  expireDate: String,
  issuedTo: String,
  place: String,
  time: String,
  barcodeValue: String,
});

const Tractor = mongoose.model('Tractor', tractorSchema);

app.post('/api/tractors', async (req, res) => {
  try {
    const { tractorId, tractorName, issueDate, expireDate, issuedTo, place, time } = req.body;
    const barcodeValue = `${tractorId}|${tractorName}|${issueDate}|${expireDate}|${issuedTo}|${place}|${time}`;
    const tractor = new Tractor({ ...req.body, barcodeValue });
    await tractor.save();
    res.status(201).json({ message: 'Tractor saved', barcodeValue });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save tractor', details: err.message });
  }
});

app.get('/api/tractors', async (req, res) => {
  try {
    const tractors = await Tractor.find();
    res.status(200).json(tractors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tractors', details: err.message });
  }
});

app.get('/api/tractors/:tractorId', async (req, res) => {
  try {
    const tractor = await Tractor.findOne({ tractorId: req.params.tractorId });
    if (!tractor) {
      return res.status(404).json({ error: 'Tractor not found' });
    }


    res.status(200).json(tractor);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tractor', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
