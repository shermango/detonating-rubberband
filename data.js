const elasticsearch = require('elasticsearch');
const cities = require('./cities.json');

let bulk = [];

const client = new elasticsearch.Client({
  hosts: [ 'http://localhost:9200'] // by default elastic search listens on port 9200
});

client.ping({
  requestTimeout: 30000
}, err => {
  if (err) console.error('elastic search is exploded');

  console.log('elastic search is good to go');
});

client.indices.create({
  index: 'elasticsearch-explore'
}, (err, res, status) => {
  if (err) console.error(err);

  console.log('created a new index ', res);
});

// add individual to index if desired
// client.index({
//   index: 'elasticsearch-explore',
//   id: '1',
//   type: 'cities_list',
//   body: {
//     "Key1": "Content for key 1",
//     "Key2": "Content for key 2",
//     "Key3": "Content for key 3",
//   }
// }, (err, res, status) => {
//   if (err) console.error(err);
  
//   console.log(res);
// });

// bulk add to index
cities.forEach(city => {
  // so you gotta push an index first, then the actual document whaaaaa
  bulk.push({
    index: {
      _index: 'elasticsearch-explore',
      _type: 'cities_list'
    }
  })
  bulk.push(city);
});

client.bulk({
  body: bulk
}, (err ,res) => {
  if (err) console.error('bulk operation failed ', err);

  console.log('successfully bulk imported ', cities.length);
});