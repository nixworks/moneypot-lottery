var _ = require('lodash');
var assert = require('assert');
var co = require('co');
var listTransactions = require('./list-transactions');



co(function*() {

  var arguments = process.argv.slice(2);

  if (arguments.length !== 3) {
    console.error('Expected three arguments. address from to. Got: ', arguments);
    return;
  }

  var address = arguments[0];

  var from = parseInt(arguments[1]);
  assert(Number.isFinite(from));

  var to = parseInt(arguments[2]);
  assert(Number.isFinite(to));

  assert(to < from);

  var transactions = yield listTransactions(address, from, to);

  for (var transaction of transactions) {
    console.log(transaction.txid, transaction.amount);
  }




}).then(_.noop, function(err) {
  console.error('Got error: ', err, err.stack);
});