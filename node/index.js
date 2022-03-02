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


function returnList(people) {
    return people.map(p => `<li>${p.name}</li>`);
}

app.get('/', async (req, res) => {
    const [, selectRows] = await Promise.all([insertPeople('Tiago'), selectPeople()]);
    
    const htmlToReturn = `
        <h1>Full Cycle</h1>
        <ul>
            ${returnList(selectRows)}
        </ul>
    `;

    // const htmlToReturn = `
    //     <h1>Full Cycle</h1>
    // `;    

    res.send(htmlToReturn);
})

app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
})