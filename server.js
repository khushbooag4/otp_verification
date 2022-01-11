const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');
const app = express()
const port = 3000

const client = require('twilio')(config.accountSID,config.authToken)

app.get('/', (req, res)=>{
    res.status(200).send("Hello World")
})

// Login Endpoint
app.get('/auth', (req,res) => {
     if (req.query.mobilenumber) {
        client
        .verify
        .services(config.serviceID)
        .verifications
        .create({
            to: `+${req.query.mobilenumber}`,
            channel: req.query.channel
        })
        .then( (data,err) => {
            console.log(data);
            if(err){
                console.error(err);
            }else{
                res.send(200).send(data);
            }
        })
     } else {
        res.status(400).send({
            message: "Wrong phone number" })
     }
})

// Verify Endpoint
app.get('/verify', (req, res) => {
    if (req.query.mobilenumber && (req.query.code).length === 6) {
        client
            .verify
            .services(config.serviceID)
            .verificationChecks
            .create({
                to: `+${req.query.mobilenumber}`,
                code: req.query.code
            })
            .then(data => {
                if (data.status === "approved") {
                    res.status(200).send({
                        message: "User is Verified!!",
                        data
                    })
                }
            })
    } else {
        res.status(400).send({
            message: "Wrong phone number or code"
        })
    }
})

// listen to the server at 3000 port
app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})