const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3002;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/bankdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  balance: { type: Number, required: true, default: 0 }
});

const Account = mongoose.model('Account', accountSchema);

app.post('/transfer', async (req, res) => {
  const { fromUser, toUser, amount } = req.body;
  
  if (!fromUser || !toUser || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid request data' });
  }
  
  try {
    const sender = await Account.findOne({ username: fromUser });
    const receiver = await Account.findOne({ username: toUser });
    
    if (!sender) {
      return res.status(404).json({ message: 'Sender account not found' });
    }
    
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver account not found' });
    }
    
    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    sender.balance -= amount;
    receiver.balance += amount;
    
    await sender.save();
    await receiver.save();
    
    res.json({
      message: `Transferred ${amount} from ${fromUser} to ${toUser}`,
      senderBalance: sender.balance,
      receiverBalance: receiver.balance
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/accounts', async (req, res) => {
  try {
    const accounts = await Account.find({});
    res.json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching accounts' });
  }
});

app.get('/seed', async (req, res) => {
  try {
    await Account.deleteMany({});
    
    const accounts = [
      { username: 'Alice', balance: 1000 },
      { username: 'Bob', balance: 500 },
      { username: 'Charlie', balance: 200 }
    ];
    
    await Account.insertMany(accounts);
    
    res.json({ 
      message: 'Sample accounts created',
      accounts: accounts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating accounts' });
  }
});

app.listen(PORT, () => {
  console.log(`Account Transfer API running on http://localhost:${PORT}`);
});
