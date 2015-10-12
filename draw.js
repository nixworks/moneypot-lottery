var _ = require('lodash');
var assert = require('assert');
var debug = require('debug')('moneypot-lottery:blockhash');
var blocknToBigNum = require('./blockn-to-bignum');
var listTransactions = require('./list-transactions');


function* draw(address, from, to) {
  debug('drawing started..');
  var transactions = yield listTransactions(address, from, to);

  transactions = _.sortBy(transactions, 'txid');

  var totalSum = 0;
  for (var t of transactions) {
    totalSum += t.amount;
  }

  debug('Total of %s draw', totalSum);

  var bign = yield blocknToBigNum(from);

  var offset = bign.mod(totalSum).toNumber();

  debug('Winner is the %s th satoshi', offset);

  var winningTransaction;

  var sum = 0;
  for (var t of transactions) {
    sum += t.amount;

    if (sum > offset) {
      winningTransaction = t.txid;
      break;
    }
  }

  assert(winningTransaction);

  return {
    transactions: transactions,
    winner: winningTransaction,
    total: totalSum,
    hash: bign,
    offset: offset
  };


}

module.exports = draw;