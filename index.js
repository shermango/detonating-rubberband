const elasticsearch = require('elasticsearch');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const client = new elasticsearch.Client({
  hosts: ['http://localhost:9200']
});
const app = express();
const PORT = process.env.PORT || 3001;

// ping elastic
client.ping({
  requestTimeout: 30000
}, err => {
  if (err) console.error(err);

  console.log('elastic search is up and running');
})

// config app
app.use(bodyParser.json());
app.use(cors())

// routes
app.get('/', (req, res) => {
  res.sendFile('template.html', {
     root: path.join( __dirname, 'views' )
   });
});

// elastic server search endpoint
app.get('/search', (req, res) => {
  let body = {
    size: 200,
    from: 0, 
    query: {
      match: {
          name: req.query['q']
      }
    }
  }

  // do the actual elastic searching
  client.search({index:'elasticsearch-explore', body, type:'cities_list'})
  .then(results => {
    res.send(results.hits.hits);
  })
  .catch(err=>{
    console.error(err)
    res.send([]);
  });
});

// listen
app.listen(PORT, () => {
  console.log(`server listening on PORT ${PORT}`)
});
