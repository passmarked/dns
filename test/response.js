const assert      = require('assert');
const _           = require('underscore');
const fs          = require('fs');
const passmarked  = require('passmarked');
const testFunc    = require('../lib/client');

describe('response', function() {
    
  it('Should not return a error if the SOA of the host can be returned', function(done) {
  
    // handle the payload
    var payload = passmarked.createPayload({

      url: 'http://example.com'

    }, { log: { entries: [] } }, '')

    testFunc(payload, function(err) {

      // check if there is a err
      if(err) assert.fail(err);

      // get the rules
      var rules = payload.getRules();

      // get the rule
      var rule = _.find(rules || [], function(item) {

        return item.key == 'response';

      });

      // fail if we got a error
      if(rule) assert.fail();

      // done
      done()

    });
  
  });

});
