const url       = require('url');
const async     = require('async');
const _         = require('underscore');
const utils     = require('../util');

/**
* A check to see whether there are at least 2 DNS servers configured
**/
module.exports = exports = function(payload, options, fn) {

  // get the url
  var data = payload.getData();

  // check if we got a url
  if(!data.url) return fn(null);

  // get the url
  var uri = url.parse(data.url);

  // get the records
  var records = [];

  // check both ipv4 and ipv6
  async.parallel([

    function(cb) {

      // use our name server given
      utils.resolve({

        type:     'A',
        server:   options.address,
        address:  uri.hostname

      }, function(err, recordsFromHost) {

        // add to the list
        records = records.concat(recordsFromHost || []);

        // done
        cb(err);
        
      });

    },
    function(cb) {

      // use our name server given
      utils.resolve({

        type:     'AAAA',
        server:   options.address,
        address:  uri.hostname

      }, function(err, recordsFromHost) {

        // add to the list
        records = records.concat(recordsFromHost || []);

        // done
        cb(err);
        
      });

    }

  ], function(err) {

    // skip if we got a error
    if(err) {

      // done
      payload.error('count', 'Problem went wrong while queriying the records', err);

      // done
      return fn();

    }

    // override if test is given
    // if(data.testCountAddresses) records = data.testCountAddresses || [];

    // add the counter
    if(records.length < 2) {

      // add the rule
      payload.addRule({

          message:      'Configure at least 2 A records configured',
          type:         'error',
          key:          'count'

      }, {

        display:        'text',
        message:        'Found only $ as configured records from DNS server - $',
        identifiers:    [ _.pluck(records, 'address').join(', '), options.address ]
      
      });

    }

    // done
    fn(null);

  });

};
