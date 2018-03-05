const assert      = require('assert');
const _           = require('underscore');
const fs          = require('fs');
const passmarked  = require('passmarked');
const testFunc    = require('../lib/client');

describe('nameservers', function() {
    
  it('Should not return a error if the server returned more than 2 records', function(done) {
  
    // handle the payload
    var payload = passmarked.createPayload({

      url: 'http://passmarked.com',
      testNSNames:  [ '1', '2', '3' ]

    }, { log: { entries: [] } }, '')

    testFunc(payload, function(err) {

      // check if there is a err
      if(err) assert.fail(err);

      // get the rules
      var rules = payload.getRules();

      // get the rule
      var rule = _.find(rules || [], function(item) {

        return item.key == 'nameservers';

      });

      // fail if we got a error
      if(rule) assert.fail();

      // done
      done()

    });
  
  });
    
  it('Should not return a error if the server returned is equal to 2 records', function(done) {
  
    // handle the payload
    var payload = passmarked.createPayload({

      url: 'http://passmarked.com',
      testNSNames:  [ '1', '2' ]

    }, { log: { entries: [] } }, '')

    testFunc(payload, function(err) {

      // check if there is a err
      if(err) assert.fail(err);

      // get the rules
      var rules = payload.getRules();

      // get the rule
      var rule = _.find(rules || [], function(item) {

        return item.key == 'nameservers';

      });

      // fail if we got a error
      if(rule) assert.fail();

      // done
      done()

    });
  
  });

  it('Should return a error if the server returned less than 2 records', function(done) {
  
    // handle the payload
    var payload = passmarked.createPayload({

      url: 'http://example.com',
      testNSNames:  [ '1' ]

    }, { log: { entries: [] } }, '')

    testFunc(payload, function(err) {

      // check if there is a err
      if(err) assert.fail(err);

      // get the rules
      var rules = payload.getRules();

      // get the rule
      var rule = _.find(rules || [], function(item) {

        return item.key == 'nameservers';

      });

      // fail if we got a error
      if(!rule) assert.fail();

      // done
      done()

    });
  
  });

});
