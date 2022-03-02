const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const connection = mysql.createConnection(config);

function insertPeople(person) {
    const insertSql = `INSERT INTO people(name) values('${person}')`;
    return new Promise(function(resolve, reject) {
        connection.query(insertSql, function(err, rows, fields) {
            if (err) {
                return reject(err);
            }
                
            resolve();
        })
    })
}

function selectPeople() {
    const selectSql = 'SELECT * FROM people';
    return new Promise(function(resolve, reject) {
        try {
            connection.query(selectSql, function(err, rows, fields) {
                if (err) {
                    reject(err);
                }

                resolve(rows);
            });

        } catch (err) {
            reject(err);
        }
    })
}

function printNames(names) {
    let listOfNames = ``
    for(let name of names) {
        listOfNames = listOfNames + `<li>${name}</li>`
    }
    return listOfNames
}

app.get('/', async (req, res) => {
    const [, results] = await Promise.all([insertPeople('Tiago2'), selectPeople()]);
    const names = results.map(result => result.name)
    
    const htmlToReturn = `
        <h1>Full Cycle</h1>
        <ul>
            ${printNames(names)}
        </ul>
    `;

    res.send(htmlToReturn);
})

app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
})