var fs = require('fs'),
    path = require('path');

var AP = Array.prototype;



/**
 * Logger
 *
 * @constructor
 * @param {String}      logpath        The file path to create/write to.
**/
function Logger(logpath) {
  this.path = path.normalize(logpath);
  this.stream = fs.createWriteStream(this.path, {
    flags: 'a',
    encoding: 'utf8',
    mode: 0666
  });
}


/**
 * Formats a message for logging
 *
 * @param {string}      level       The messages log level.
 * @param {string}      message     The message to log.
 * @return {string}     The formatted log message.
**/
Logger.prototype.format = function(level, message) {
  if(level.length < 5) level += ' ';
  return level + ' [' + (new Date()).toUTCString() + '] ' + message + '\n';
};


/**
 * Writes a message to the log
 *
 * @param {string}      level       The level of the message being logged.
 * @param {mixed...}    data        What to actually log.
**/
Logger.prototype.write = function(level, data) {
  var args = AP.slice.call(arguments),
      level = args.shift(),
      message = '';

  args.forEach(function(arg) {
    message += ' ';
    if (typeof arg === 'string') {
      message += arg;
    } else {
      message += JSON.stringify(arg);
    }
  });

  this.stream.write(this.format(level, message));
};


/**
 * @see Logger.prototype.write
**/
Logger.prototype.log = function() {
  this.write.apply(this, ['INFO'].concat(AP.slice.call(arguments)));
};


/**
 * @see Logger.prototype.write
**/
Logger.prototype.info = Logger.prototype.log;


/**
 * @see Logger.prototype.write
**/
Logger.prototype.debug = function() {
  this.write.apply(this, ['DEBUG'].concat(AP.slice.call(arguments)));
};


/**
 * @see Logger.prototype.write
**/
Logger.prototype.warn = function() {
  this.write.apply(this, ['WARN'].concat(AP.slice.call(arguments)));
};


/**
 * @see Logger.prototype.write
**/
Logger.prototype.error = function() {
  this.write.apply(this, ['ERROR'].concat(AP.slice.call(arguments)));
};


/**
 * @see Logger.prototype.write
**/
Logger.prototype.fatal = function() {
  this.write.apply(this, ['FATAL'].concat(AP.slice.call(arguments)));
};



/**
 * Publicly export the Logger constructor
 * @constructor
 * @see Logger
**/
exports.Logger = Logger;
