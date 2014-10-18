'use strict';

module.exports = {
    title: 'My Mining Operations',
    webinterface: {
        port: 8080
    },
    modules: [
        {
            id: 'market1',
            module: 'markets/bitcoincharts'
        },
        {
            id: 'technical1',
            module: 'technical/blockchainInfo'
        }
    ]
};