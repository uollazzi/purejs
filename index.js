#!/usr/bin/env node
'use strict';

const axios = require('axios').default;
const MongoClient = require('mongodb').MongoClient;
const argv = require('yargs').argv;

// count argument
let count = !isNaN(argv.c) ? argv.c : 1;

console.log(argv);

for (let i = 0; i < count; i++) {
    getPerson();
}

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