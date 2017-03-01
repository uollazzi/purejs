'use strict';

const axios = require('axios').default;
const MongoClient = require('mongodb').MongoClient;
const program = require('commander');

program.version('0.0.1')
    .option('-c, --count [count]', 'Number of user to retrieve.')
    .parse(process.argv);


// count argument
let count = !isNaN(program.count) ? program.count : 1;

console.log(program);

for (let i = 0; i < count; i++) {
    getPerson();
}

/**
* Gets Random User Json from https://randomuser.me/api/ and saves to MongoDB
*/
function getPerson() {
    axios.get('https://randomuser.me/api/')
        .then((response) => {            
            MongoClient.connect('mongodb://localhost/purejs', (err, db) => {
                if (err) {
                    console.error("Connection error", err);
                } else {
                    // insert many
                    db.collection('people').insertMany(response.data['results'], (err, r) => {
                        if (err) {
                            console.error("Insert many", err);
                        } else {
                            console.log(r.insertedIds);
                        }
                    });
                }
                db.close();
            });
        })
        .catch((error) => {
            console.error(error);
        });
}