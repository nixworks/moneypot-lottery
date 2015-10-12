exports.MIN_SEND = 1000; // Must send at least 1000 satoshis to count
exports.CHAIN_API_KEY = process.env.CHAIN_API_KEY;

if (!exports.CHAIN_API_KEY)
  throw new Error('Need CHAIN_API_KEY');

exports.CHAIN_API_SECRET = process.env.CHAIN_API_SECRET;

if (!exports.CHAIN_API_SECRET)
  throw new Error('Need CHAIN_API_SECRET');


exports.CHAIN_OPTIONS = {
  auth: {
    user: process.env.CHAIN_API_KEY,
    pass: process.env.CHAIN_API_SECRET
  }
};