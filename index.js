var _ = require('lodash');
var co = require('co');
var draw = require('./draw');



co(function*() {

  var r = yield draw('14o7zMMUJkG6De24r3JkJ6USgChq7iWF86', 297263, 297263-1000);

  console.log('Result of draw: ', r);


}).then(_.noop, function(err) {
  console.error('Got error: ', err, err.stack);
});