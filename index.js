/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Arthur Stolyar <https://github.com/NekR>

  Based on Tobias Koppers @sokra bundle-loader
  https://github.com/webpack/bundle-loader
*/
var loaderUtils = require('loader-utils');
var path = require('path');

module.exports = function() {};
module.exports.pitch = function(remainingRequest) {
  this.cacheable && this.cacheable();

  var query = loaderUtils.parseQuery(this.query);
  var chunkName = '';

  if (query.name) {
    var options = {
      context: query.context || this.options.context,
      regExp: query.regExp
    };

    chunkName = loaderUtils.interpolateName(this, query.name, options);
    chunkName = ', ' + JSON.stringify(chunkName);
  }

  var request = loaderUtils.stringifyRequest(this, '!!' + remainingRequest);
  var callback;

  if (query.noexec) {
    callback = 'callback(function() { return require(' + request + ') })';
  } else {
    callback = 'callback(require(' + request + '))';
  }

  var executor = [
    'function(callback, errback) {',
    '  require.ensure([], function(_, error) {',
    '    if (error) {',
    '      errback();',
    '    } else {',
    '      ' + callback,
    '    }',
    '  }' + chunkName + ');',
    '}'
  ].join('\n');

  var result = [
    'require(' + loaderUtils.stringifyRequest(this, '!' + path.join(__dirname, 'patch.js')) + ');',
    'module.exports = ' + (query.promise ? 'new Promise(' + executor + ')' : executor),
  ];

  return result.join('\n');
}