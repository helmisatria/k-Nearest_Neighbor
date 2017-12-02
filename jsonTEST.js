const csv = require('csvtojson');
const fs = require('fs');

const count = 0;

const data = [];

csv({ noheader: true })
  .fromFile('./testset.csv')
  .on('csv', (json) => {
  })
  .on('done', () => {
    console.log('end2');
  })
  .on('end_parsed', (jsonArrObj) => {
    fs.writeFile('TEST_SET.json', JSON.stringify(jsonArrObj), 'utf8', (err, result) => {
      if (err) {
        return console.log(err);
      }
      console.log('success!');
    });
  });
