var Logger = require('../').Logger,
    assert = require('assert'),
    fs = require('fs'),
    path = require('path');

var TEST_DIR = path.dirname(__filename);
var LOG_PATH = path.join(TEST_DIR, './tmpdir/test.log');

var log = new Logger(LOG_PATH);

module.exports = {
  'test: Logger.createLog()': function() {
    assert.ok(log instanceof Logger);
    assert.equal(LOG_PATH, log.path);
    assert.ok(log.stream instanceof fs.WriteStream);
  },

  'test: mylog.write': function() {
    var test_id = 0;

    log.format = function(level, message) {
      if (level.length < 5) level += ' ';
      return level + ' [' + (new Date(0)).toUTCString() + '] ' + message + '\n';
    };

    log.stream.write = function(msg) {
      switch (test_id) {
        case 0:
          assert.equal('INFO  [Thu, 01 Jan 1970 00:00:00 GMT]  hello\n', msg);
          break;
        case 1:
          assert.equal('INFO  [Thu, 01 Jan 1970 00:00:00 GMT]  hello\n', msg);
          break;
        case 2:
          assert.equal('DEBUG [Thu, 01 Jan 1970 00:00:00 GMT]  hello\n', msg);
          break;
        case 3:
          assert.equal('WARN  [Thu, 01 Jan 1970 00:00:00 GMT]  hello\n', msg);
          break;
        case 4:
          assert.equal('ERROR [Thu, 01 Jan 1970 00:00:00 GMT]  hello\n', msg);
          break;
        case 5:
          assert.equal('FATAL [Thu, 01 Jan 1970 00:00:00 GMT]  hello\n', msg);
          break;
        case 5:
          assert.equal(
              'FATAL [Thu, 01 Jan 1970 00:00:00 GMT]  hello {"a":"b"}\n', msg
          );
          break;
      }

      fs.WriteStream.prototype.write.call(log.stream, msg);
    }

    log.log('hello');
    test_id++;
    log.info('hello');
    test_id++;
    log.debug('hello');
    test_id++;
    log.warn('hello');
    test_id++;
    log.error('hello');
    test_id++;
    log.fatal('hello');
    test_id++;
    log.log('hello', {a: 'b'});
  },
  after: function() {
    fs.unlinkSync(LOG_PATH);
  }
};
