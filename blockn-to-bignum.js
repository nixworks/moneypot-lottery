var _ = require('lodash');
var bignum = require('bignum');
var config = require('./config');
var debug = require('debug')('moneypot-lottery:blockhash');
var request = require('co-request');


function* blocknToBigNum(n) {
  var opts = _.merge(config.CHAIN_OPTIONS, {
    url: 'https://api.chain.com/v2/bitcoin/blocks/' + n
  });

  var block = JSON.parse((yield request(opts)).body);


  debug('Block has %s %s confirmations', block.hash, block.confirmations);


  var buff = new Buffer(block.hash, 'hex');
  return bignum.fromBuffer(buff);
}

module.exports = blocknToBigNum;

