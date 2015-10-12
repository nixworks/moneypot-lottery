var _ = require('lodash');
var assert = require('assert');
var co = require('co');
var config = require('./config');
var debug = require('debug')('moneypot-lottery:list-transactions');
var request = require('co-request');




function* fetchTransaction(txid) {
  var opts = _.merge(config.CHAIN_OPTIONS, {
    url: 'https://api.chain.com/v2/bitcoin/transactions/' + txid
  });

  return JSON.parse((yield request(opts)).body);
}


// Address of transactions to list
// from is the block (inclusive)
// to is the block (exclusive)
// nextRange is chain specific. Undefined to start at the start
function* listTransactions(address, from, to, nextRange) {
  debug('Listing transactions');

  var opts = _.merge(config.CHAIN_OPTIONS, {
    url: 'https://api.chain.com/v2/bitcoin/addresses/' + address + '/transactions?limit=500',
    headers: nextRange ? {
      'Range': nextRange
    } : undefined
  });

  var data = yield request(opts);

  //console.log('Got data as: ', data);

  //debug('Headers receieved: ', data.headers);
 // debug('Body: ', data.body);


  var transactions = [];

  for (var transaction of JSON.parse(data.body)) {

    var txid = transaction.hash;

    if (transaction.truncated)
      transaction = yield* fetchTransaction(txid);

    assert(!transaction.truncated);

    var spent = 0;

    for (var output of transaction.outputs) {
      if (!Array.isArray(output.addresses)) {
        console.warn('Disregarding: ', output.transation_hash + ':' + output.output_index, ' because no address');
        continue;
      }

      if (!_.includes(output.addresses, address))
        continue;

      if (output.addresses.length !== 1) {
        console.warn('Output: ', output.transaction_hash + ':' + output.output_index, ' sent to address, but not exclusively. Disregarding.');
        continue;
      }

      if (output.value < config.MIN_SEND) {
        console.warn('Disregarding dust ', output.transaction_hash + ':' + output.output_index, ' of ', output.value, ' satoshis');
        continue;
      }

      spent += output.value;
    }

    if (spent > 0) {
      var t = {
        txid: transaction.hash,
        amount: spent
      };
      debug('Adding transaction: ', t);
      transactions.push(t);
    }
  }

  if (!data.headers['next-range']) {
    // We have it all
    return transactions;
  }

  return transactions.concat(
    yield* listTransactions(address, from, to, data.headers['next-range'])
  );
}



module.exports = listTransactions;