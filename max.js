const DATAK = require('./index_K.json');

const _ = require('lodash');

const data = _.sortBy(DATAK, ['accuracy']);

console.log(JSON.stringify(data, {}, 2));
