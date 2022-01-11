const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose');
const app = express()
const port = 3000

const client = require('twilio')(process.env.ACCOUNT_SID,process.env.AUTH_TOKEN)

app.get('/', (req, res)=>{
    res.status(200).send("Hello World")
})

//BodyParser to enable req.body
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// Login Endpoint
app.post('/auth', (req,res) => {
    console.log(req.body);
    const { mobilenumber,channel } = req.body;
    
    try {
        if(
            typeof mobilenumber === 'number' &&
            typeof channel === 'string' ){ console.log("Intial Check done") }
            client
              .verify
              .services(process.env.SERVICE_ID)
              .verifications
              .create({
                  to : `+${mobilenumber}`,
                  channel : channel
              })
              .then((data,err) => {
                console.log(data);
                if(err){
                    console.error(err);
                }else{
                    res.send(200).send(data);
                }
              })
    } catch (error) {
        console.error(error);
    }

})

// Verify Endpoint
app.post('/verify', (req, res) => {
    const { mobilenumber , code } = req.body;
    console.log(req.body);
    try {
        if (mobilenumber && (code).length === 6) {
            console.log("Intial Check done")
        }
        client
            .verify
            .services(process.env.SERVICE_ID)
            .verificationChecks
            .create({
                to: `+${mobilenumber}`,
                code: code
            })
            .then(data => {
                res.status(200).send("User Verfied")
            })
    } catch (error) {
        res.status(400).send({
            message: "Wrong phone number or code"
        })
    }
})

// listen to the server at 3000 port
app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})