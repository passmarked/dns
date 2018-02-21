const assert      = require('assert');
const _           = require('underscore');
const fs          = require('fs');
const passmarked  = require('passmarked');
const testFunc    = require('../lib/client');

describe('public', function() {
    
  it('Should not return a error if the name servers are public', function(done) {
  
    // handle the payload
    var payload = passmarked.createPayload({

      url: 'http://passmarked.com'

    }, { log: { entries: [] } }, '')

    testFunc(payload, function(err) {

      // check if there is a err
      if(err) assert.fail(err);

      // get the rules
      var rules = payload.getRules();

      // get the rule
      var rule = _.find(rules || [], function(item) {

        return item.key == 'public';

      });

      // fail if we got a error
      if(rule) assert.fail();

      // done
      done()

    });
  
  });

  it('Should return a error if the server is not public - 127.0.0.1', function(done) {
  
    // handle the payload
    var payload = passmarked.createPayload({

      url: 'http://example.com',
      testOptions:  [

        {

          address:  '127.0.0.1',
          server:   'localhost'

        }

      ]

    }, { log: { entries: [] } }, '')

    testFunc(payload, function(err) {

      // check if there is a err
      if(err) assert.fail(err);

      // get the rules
      var rules = payload.getRules();

      // get the rule
      var rule = _.find(rules || [], function(item) {

        return item.key == 'public';

      });

      // fail if we got a error
      if(!rule) assert.fail();

      // done
      done()

    });
  
  });
  
});
