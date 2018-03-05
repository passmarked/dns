const dns         = require('native-dns');
const url         = require('url');
const _           = require('underscore');
const utils       = require('./util');
const async       = require('async');

// import rules to check for each individual DNS server
const rules = require('./rules');

// expose our main function
module.exports = exports = function(payload, fn) { 

  // get hostname from payload data
  var data = payload.getData();

  // sanity check
  if(!data.url) return;

  // load the url
  var uri = new url.parse(data.url);

  // get the hostname
  var hostname = uri.hostname;

  // check if marked
  payload.isMentioned({

    key:      'dns',
    rule:     'client',
    subject:  uri.hostname

  }, (err, mentioned) => {

    // check if not already mentioned
    if(mentioned === true) {

      // debug
      payload.debug('client', 'Already mentioned in the session, so skipping');

      // done
      return setImmediate(fn, null);

    }

    // get the nameservers
    utils.resolve({

      address:     hostname,
      type:       'NS',
      payload:    payload

    }, (err, nsNames) => {

      // handle the error
      if (err) {

        // show the error
        payload.error('client', 'Something went wrong while checking the name server', err);

        // done
        return setImmediate(fn, null);

      }

      // get the names


      // get/set the records 
      var ipRecords = [];

      // build up the options
      var optionItems = [];

      // handle if there any not at least 2 ns names
      if((data.testNSNames || nsNames || []).length < 2) {

        // add the rule
        payload.addRule({

            message:      'Configure at least 2 DNS Nameservers',
            type:         'error',
            key:          'nameservers'

        }, {

          display:        'text',
          message:        'Only found $ configured, namely $',
          identifiers:    [ nsNames.length, nsNames.join(', ') ]
        
        });

      }

      // loop and run each
      async.eachLimit(nsNames || [], 2, function(nsName, cb) {

        // resolve the DNS
        utils.resolve({

          address:     nsName,
          type:       'A',
          payload:    payload

        }, function(err, nsIPs) {

          // check for the error
          if(err) {

            // output the error
            payload.error('client', 'Something went wrong while trying to resolve: ' + nsName);

            // done
            return cb(null);

          }

          // flatten list
          nsIPs = _.flatten(nsIPs);

          // add the items
          for(var i = 0; i < (nsIPs || []).length; i++) {

            // add the list
            optionItems.push({

              server:       nsName,
              address:      nsIPs[i]

            });

            // add to the list
            if(ipRecords.indexOf(nsIPs[i]) !== -1) {

              // add
              payload.addRule({

                  message:      'Duplicate name servers addresses',
                  type:         'error',
                  key:          'unique'

              }, {

                display:        'text',
                message:        'Name server ip $ returned more than once from DNS server - $ ($)',
                identifiers:    [ nsIPs[i], nsName, nsIPs[i] ]
              
              });

            }

            // add to the list
            ipRecords.push(nsIPs[i]);

          }

          // done
          cb(null);

        });

      }, function() {

        // loop through all the options
        async.each(data.testOptions || optionItems || [], function(options, cb) {

          // run all the rules for this server
          async.eachLimit(rules, 2, function(checkFunc, cbb) {

            // run it
            checkFunc(payload, options, function() {

              // finish
              setImmediate(cbb, null);

            });

          }, () => {

            // done
            setImmediate(cb, null);

          });

        }, function() {

          // mark as mentioned
          payload.mention({

            key:      'dns',
            rule:     'client',
            subject:  uri.hostname

          }, () => {

            // call our callback
            setImmediate(fn, null);

          });

        });

      });

    });

  });

};