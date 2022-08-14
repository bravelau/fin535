const express = require('express');
const { response } = require('express');
const axios = require("axios");

const app = express();

const mcrpcnode = "http://localhost:12031/";
const mcusername = "multichainrpc";
const mcchainname = "chronnet";
const mcpassword = "GTZuScB5khUytNTpjpKzvV8fqbvCHAftmYgKwXUP5Ha7";

app.listen(5001, function() {
    console.log("Listening on port 5001");
})

app.get('/', function (req,res) {
    res.send("Hello Word");
});

app.get('/getAddress', function(req, res) {
    let address = doGetAddress()
    .then((resp)=>{
      res.send(resp);
    })
    .catch((e) => console.error(e));
}) 

app.get('/getTokenBalances/:address', function(req, res) {
    let balance = doGetTokenBalances(req.params.address)
    .then((resp)=>{
      res.send(resp);
    })
    .catch((e)=> console.error(e));
}) 

app.get('/getTokenMetadata/:tokenid', function(req, res) {
    let balance = doGetTokenMetadata(req.params.tokenid)
    .then((resp)=>{
      res.send(resp);
    })
    .catch((e) => console.error(e));
}) 

async function doGetAddress(){
    let resp = await axios
    .post (
        mcrpcnode,
        {
            method: "getaddresses",
            param: [],
        },
        {
            auth :{
                username: mcusername,
                chain_name: mcchainname,
                password: mcpassword,
            },
        }
    );

    return resp.data;
};

async function doGetTokenBalances(address){
    console.log(typeof(address));
    let resp = await axios
    .post (
        mcrpcnode,
        {
            method: "gettokenbalances",
            param: [address],
        },
        {
            auth :{
                username: mcusername,
                chain_name: mcchainname,
                password: mcpassword,
            },
        }
    );

    return resp.data;
};

async function doGetTokenMetadata(tokenId){
    let resp = await axios
    .post (
        mcrpcnode,
        {
            method: "liststreamkeyitems",
            param: ["gallery-token-registry", tokenId],
        },
        {
            auth :{
                username: mcusername,
                chain_name: mcchainname,
                password: mcpassword,
            },
        }
    );

    return resp.data;
};