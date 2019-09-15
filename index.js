const mysql = require('mysql')
const express = require('express')
var app = express()
const bodyParser = require('body-parser')
var cors = require("cors");
port = 3001

app.use(bodyParser.json())
app.use(cors())

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'assalamualaikum',
    database: 'jc10_finalproject',
    port: 3307
})

db.connect((err)=>{
    if(!err)
    console.log('Database connection succeded.');
    else 
    console.log('Database connection failed \n Error' + JSON.stringify(err, undefined, 2))
    
})

app.listen(port, ()=>console.log('Express server is running in port ' + port))

app.get('/users',(req,res)=>{
    db.query('select * from users', (err, rows)=>{
        if(!err)
        res.send(rows)
        else
        console.log(err);
    })
})
app.get('/getuser',(req,res)=>{
    let username = 'admin'
    let password = 'admin'
    db.query(`select * from users where username = ? and password = ?` ,[username, password], (err, rows)=>{
        if(!err)
        res.send(rows)
        else
        console.log(err);
    })
})


