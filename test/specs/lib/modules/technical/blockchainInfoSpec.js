'use strict';

var _ = require('lodash'),
    chai = require('chai'),
    expect = chai.expect,
    SandboxedModule = require('sandboxed-module'),

    responses,
    statsAnswer = {
        some: 'stats'
    },
    btcPerBlockAnswer = 25,
    probabilityAnswer = 0.01,
    BlockchainInfo = SandboxedModule.require('../../../../../lib/modules/technical/blockchainInfo', {
        requires: {
            'request': function (options, callback) {
                var response = responses[options.uri],
                    triggerResponse = function (err, response) {
                        setTimeout(function () {
                            callback(err, {
                                body: response
                            });
                        }, 20);
                    };

                expect(options.json).to.be.true;
                if (response) {
                    triggerResponse(null, response);
                } else {
                    triggerResponse(new Error('Test Error'));
                }
            }
        }
    });

describe('modules/technical/blockchainInfo', function () {

    beforeEach(function () {
        responses = {
            'http://blockchain.info/de/stats?format=json': statsAnswer,
            'http://blockexplorer.com/q/bcperblock': btcPerBlockAnswer,
            'http://blockchain.info/de/q/probability': probabilityAnswer
        };
    });

    it('should get data from blockchainInfo correctly', function (done) {
        var app = {},
            blockchainInfo = new BlockchainInfo(app);

        blockchainInfo.on('update:data', function (data) {
            expect(data).to.deep.equal(_.extend({}, statsAnswer, {
                btcPerBlock: btcPerBlockAnswer,
                probability: probabilityAnswer
            }));
            done();
        });
    });

    it('should not throw an error if the stats request fails with an error', function (done) {
        var app = {},
            blockchainInfo;

        responses['http://blockchain.info/de/stats?format=json'] = null;

        blockchainInfo = new BlockchainInfo(app);

        setTimeout(function () {
            expect(blockchainInfo.data).not.to.be.ok;
            done();
        }, 50);
    });

    it('should not throw an error if the bcperblock request fails with an error', function (done) {
        var app = {},
            blockchainInfo;

        responses['http://blockexplorer.com/q/bcperblock'] = null;

        blockchainInfo = new BlockchainInfo(app);

        setTimeout(function () {
            expect(blockchainInfo.data).not.to.be.ok;
            done();
        }, 50);
    });

    it('should not throw an error if the probability request fails with an error', function (done) {
        var app = {},
            blockchainInfo;

        responses['http://blockchain.info/de/q/probability'] = null;

        blockchainInfo = new BlockchainInfo(app);

        setTimeout(function () {
            expect(blockchainInfo.data).not.to.be.ok;
            done();
        }, 50);
    });

    it('should have the title set correctly', function () {
        var app = {},
            blockchainInfo = new BlockchainInfo(app);

        expect(blockchainInfo.title).to.equal('Blockchain.info');
    });

});