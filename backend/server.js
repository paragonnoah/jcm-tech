const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const request = require('request');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure 'uploads/' directory exists
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}_${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

const pool = new Pool({
  user: process.env.DB_USER || (console.warn('DB_USER not set, using default "postgres"') && 'postgres'),
  host: process.env.DB_HOST || (console.warn('DB_HOST not set, using default "localhost"') && 'localhost'),
  database: process.env.DB_NAME || (console.warn('DB_NAME not set, using default "jcm_p2p"') && 'jcm_p2p'),
  password: process.env.DB_PASSWORD || (console.warn('DB_PASSWORD not set, using empty string') && ''),
  port: process.env.DB_PORT || (console.warn('DB_PORT not set, using default 5432') && 5432),
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err.stack);
});

pool.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.stack);
    // Log and continue instead of exiting
  } else {
    console.log('Connected to PostgreSQL with user:', process.env.DB_USER);
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });
  jwt.verify(token, process.env.JWT_SECRET || (console.warn('JWT_SECRET not set, using default insecure key') && 'your_jwt_secret_key'), (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const getMpesaAccessToken = () => {
  return new Promise((resolve, reject) => {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    request.post({
      url: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      headers: { Authorization: `Basic ${auth}` },
    }, (error, response, body) => {
      if (error) reject(error);
      else resolve(JSON.parse(body).access_token);
    });
  });
};

const generateTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace(/[-:T]/g, '').slice(0, 14);
};

const stkPush = (accessToken, phone, amount, description) => {
  return new Promise((resolve, reject) => {
    const timestamp = generateTimestamp();
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${timestamp}${process.env.MPESA_PASSKEY}`).toString('base64');
    request.post({
      url: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      headers: { Authorization: `Bearer ${accessToken}` },
      json: {
        BusinessShortCode: process.env.MPESA_SHORTCODE || '174379',
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: `254${phone.slice(1)}`,
        PartyB: process.env.MPESA_SHORTCODE || '174379',
        PhoneNumber: `254${phone.slice(1)}`,
        CallBackURL: process.env.MPESA_CALLBACK_URL || 'https://your-callback-url.com',
        AccountReference: 'JCM-P2P',
        TransactionDesc: description,
      },
    }, (error, response, body) => {
      if (error) reject(error);
      else resolve(body);
    });
  });
};

const b2cWithdrawal = (accessToken, phone, amount, description) => {
  return new Promise((resolve, reject) => {
    request.post({
      url: 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
      headers: { Authorization: `Bearer ${accessToken}` },
      json: {
        InitiatorName: process.env.MPESA_INITIATOR_NAME || 'testapi',
        SecurityCredential: Buffer.from(process.env.MPESA_SECURITY_CREDENTIAL || 'your_security_credential').toString('base64'),
        CommandID: 'BusinessPayment',
        Amount: amount,
        PartyA: process.env.MPESA_SHORTCODE || '174379',
        PartyB: `254${phone.slice(1)}`,
        Remarks: description,
        QueueTimeOutURL: process.env.MPESA_TIMEOUT_URL || 'https://your-timeout-url.com',
        ResultURL: process.env.MPESA_RESULT_URL || 'https://your-result-url.com',
        Occasion: 'Withdrawal',
      },
    }, (error, response, body) => {
      if (error) reject(error);
      else resolve(body);
    });
  });
};

// API Endpoints
app.post('/api/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    // Check for existing phone
    const checkResult = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }
    const result = await pool.query(
      'INSERT INTO users (name, email, password, phone, joined_date) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING id',
      [name, email, password, phone]
    );
    await pool.query('INSERT INTO wallets (user_id, balance) VALUES ($1, 0.00)', [result.rows[0].id]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ message: 'Registration failed', error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, joinedDate: user.joined_date, phone: user.phone } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT u.id, u.name, u.email, u.phone, u.joined_date, u.profile_picture AS profilePicture FROM users u WHERE u.id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    const userData = result.rows[0];
    // Ensure profilePicture is included even if null
    res.json({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      joinedDate: userData.joined_date,
      profilePicture: userData.profilepicture || null, // Handle null case
    });
  } catch (err) {
    console.error('Profile fetch error:', err.stack);
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

app.put('/api/profile/phone', authenticateToken, async (req, res) => {
  const { phone } = req.body;
  try {
    await pool.query('UPDATE users SET phone = $1 WHERE id = $2', [phone, req.user.id]);
    res.json({ message: 'Phone updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating phone', error: err.message });
  }
});

app.post('/api/profile/picture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const filename = req.file.filename;
  try {
    await pool.query('UPDATE users SET profile_picture = $1 WHERE id = $2', [filename, req.user.id]);
    res.json({ message: 'Profile picture uploaded', filename });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading picture', error: err.message });
  }
});

app.get('/api/wallet', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT w.balance, u.id, u.name, u.email, u.joined_date, u.phone, t.type, t.amount, t.method, t.date FROM wallets w JOIN users u ON w.user_id = u.id LEFT JOIN transactions t ON w.id = t.wallet_id WHERE w.user_id = $1 ORDER BY t.date DESC LIMIT 5',
      [req.user.id]
    );
    const wallet = result.rows.length > 0 ? {
      balance: result.rows[0].balance,
      user: { id: result.rows[0].id, name: result.rows[0].name, email: result.rows[0].email, joinedDate: result.rows[0].joined_date, phone: result.rows[0].phone },
      transactions: result.rows.map(row => ({ type: row.type, amount: row.amount, method: row.method, date: row.date })),
    } : { balance: 0, user: null, transactions: [] };
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching wallet', error: err.message });
  }
});

app.post('/api/wallet/transaction', authenticateToken, async (req, res) => {
  const { type, amount } = req.body;
  try {
    const walletResult = await pool.query('SELECT w.*, u.phone FROM wallets w JOIN users u ON w.user_id = u.id WHERE w.user_id = $1', [req.user.id]);
    const wallet = walletResult.rows[0];
    if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

    if (type === 'Withdrawal' && wallet.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
    if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    let newBalance = type === 'Withdrawal' ? wallet.balance - amount : wallet.balance + amount;

    const accessToken = await getMpesaAccessToken();
    const phoneNumber = wallet.phone;
    const transactionDesc = `${type} of ${amount} KSH`;

    if (type === 'Deposit') {
      const stkResponse = await stkPush(accessToken, phoneNumber, amount, transactionDesc);
      if (stkResponse.ResponseCode === '0') {
        await pool.query('UPDATE wallets SET balance = $1 WHERE user_id = $2', [newBalance, req.user.id]);
        await pool.query('INSERT INTO transactions (wallet_id, type, amount, method, date) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)', [wallet.id, type, amount, 'M-Pesa']);
        res.json({ message: `M-Pesa ${type} initiated. Check phone for confirmation.`, balance: newBalance });
      } else {
        res.status(400).json({ message: 'M-Pesa transaction failed: ' + stkResponse.ResponseDescription });
      }
    } else if (type === 'Withdrawal') {
      const b2cResponse = await b2cWithdrawal(accessToken, phoneNumber, amount, transactionDesc);
      if (b2cResponse.ResponseCode === '0') {
        await pool.query('UPDATE wallets SET balance = $1 WHERE user_id = $2', [newBalance, req.user.id]);
        await pool.query('INSERT INTO transactions (wallet_id, type, amount, method, date) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)', [wallet.id, type, amount, 'M-Pesa']);
        res.json({ message: `M-Pesa ${type} successful.`, balance: newBalance });
      } else {
        res.status(400).json({ message: 'M-Pesa transaction failed: ' + b2cResponse.ResponseDescription });
      }
    }
  } catch (err) {
    res.status(500).json({ message: 'Error processing transaction', error: err.message });
  }
});

app.get('/api/markets', authenticateToken, async (req, res) => {
  try {
    await pool.query('ALTER TABLE markets ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE');
    await pool.query('ALTER TABLE markets ADD COLUMN IF NOT EXISTS total_stake DECIMAL(10,2) DEFAULT 0.00');
    await pool.query('ALTER TABLE markets ADD COLUMN IF NOT EXISTS outcome_options JSONB');
    await pool.query('ALTER TABLE markets ALTER COLUMN odds_yes DROP NOT NULL');
    await pool.query('ALTER TABLE markets ALTER COLUMN odds_no DROP NOT NULL');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bets (
        id SERIAL PRIMARY KEY,
        market_id INTEGER REFERENCES markets(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        outcome TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (amount > 0)
      )
    `);
    const result = await pool.query(
      `SELECT m.id, m.question, m.category, m.subcategory, m.total_stake, m.outcome_options, m.progress,
              COALESCE(json_agg(json_build_object('id', b.id, 'user_id', b.user_id, 'outcome', b.outcome, 'amount', b.amount, 'timestamp', b.timestamp)) FILTER (WHERE b.id IS NOT NULL), '[]') AS bets
       FROM markets m
       LEFT JOIN bets b ON m.id = b.market_id
       WHERE m.user_id = $1 OR m.is_public = true
       GROUP BY m.id, m.question, m.category, m.subcategory, m.total_stake, m.outcome_options, m.progress`,
      [req.user.id]
    );
    res.json(result.rows.map(m => ({
      ...m,
      outcome_options: m.outcome_options ? (Array.isArray(m.outcome_options) ? m.outcome_options : JSON.parse(m.outcome_options)) : [],
      bets: m.bets ? (Array.isArray(m.bets) ? m.bets : JSON.parse(m.bets)) : [],
    })));
  } catch (err) {
    console.error('Error fetching markets:', err.stack);
    res.status(500).json({ message: 'Error fetching markets', error: err.message });
  }
});

app.post('/api/create-market', authenticateToken, async (req, res) => {
  const { question, category, subcategory, totalStake, outcomeOptions } = req.body;
  if (!question || totalStake <= 0 || !outcomeOptions || outcomeOptions.length < 2) {
    return res.status(400).json({ message: 'Invalid input: Question, stake (> 0), and at least 2 outcomes are required' });
  }
  try {
    await pool.query('ALTER TABLE markets ADD COLUMN IF NOT EXISTS total_stake DECIMAL(10,2) DEFAULT 0.00');
    await pool.query('ALTER TABLE markets ADD COLUMN IF NOT EXISTS outcome_options JSONB');
    await pool.query('ALTER TABLE markets ALTER COLUMN odds_yes DROP NOT NULL');
    await pool.query('ALTER TABLE markets ALTER COLUMN odds_no DROP NOT NULL');
    const result = await pool.query(
      'INSERT INTO markets (user_id, question, category, subcategory, total_stake, outcome_options, progress, is_public, odds_yes, odds_no) VALUES ($1, $2, $3, $4, $5, $6, 0, false, NULL, NULL) RETURNING *',
      [req.user.id, question, category, subcategory || null, totalStake, JSON.stringify(outcomeOptions)]
    );
    res.status(201).json({ message: 'Market created successfully', market: result.rows[0] });
  } catch (err) {
    console.error('Error creating market:', err);
    res.status(500).json({ message: 'Error creating market', error: err.message });
  }
});

app.post('/api/place-bet', authenticateToken, async (req, res) => {
  const { marketId, outcome, amount } = req.body;
  if (!marketId || !outcome || amount <= 0) {
    return res.status(400).json({ message: 'Invalid input: Market ID, outcome, and amount (> 0) are required' });
  }
  try {
    const marketResult = await pool.query(
      'SELECT outcome_options, total_stake FROM markets WHERE id = $1 AND (user_id = $2 OR is_public = true)',
      [marketId, req.user.id]
    );
    if (marketResult.rows.length === 0) {
      return res.status(404).json({ message: 'Market not found or not accessible' });
    }
    const { outcome_options: outcomeOptions, total_stake: totalStake } = marketResult.rows[0];
    const outcomes = JSON.parse(outcomeOptions);
    if (!outcomes.includes(outcome)) {
      return res.status(400).json({ message: 'Invalid outcome' });
    }

    const walletResult = await pool.query(
      'SELECT balance FROM wallets WHERE user_id = $1',
      [req.user.id]
    );
    const balance = walletResult.rows[0]?.balance || 0;
    if (balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const newBalance = balance - amount;
    await pool.query('UPDATE wallets SET balance = $1 WHERE user_id = $2', [newBalance, req.user.id]);
    await pool.query(
      'INSERT INTO bets (market_id, user_id, outcome, amount) VALUES ($1, $2, $3, $4)',
      [marketId, req.user.id, outcome, amount]
    );
    res.json({ message: 'Bet placed successfully', newBalance });
  } catch (err) {
    console.error('Error placing bet:', err);
    res.status(500).json({ message: 'Error placing bet', error: err.message });
  }
});

app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages WHERE sender_id = $1 ORDER BY timestamp DESC LIMIT 10', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
});

app.post('/api/messages', authenticateToken, async (req, res) => {
  const { text } = req.body;
  try {
    const result = await pool.query('INSERT INTO messages (sender_id, text, timestamp) VALUES ($1, $2, CURRENT_TIMESTAMP) RETURNING *', [req.user.id, text]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('SIGTERM', () => {
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});