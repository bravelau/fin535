const express = require("express");
const axios = require("axios");
const app = express();
const cors = require('cors');
const port = 5001;

app.use(cors());

// GBA Question 1 - Launching the API service
const server = app.listen(port, function () {
  console.log("REST API service listening on port", port);
});

// Socket.IO is used to make a connection to this Express server
const io = require("socket.io")(server);
io.on("connection", (client) => {
  client.on("npmStop", () => {
    process.exit(0);
  });
});

// Function for making a HTTP POST request with the MultiChain API command and parameters
async function callfunc(api_command, api_param) {
  let result = await axios.post(
    "http://localhost:12031",
    {
      method: api_command,
      params: api_param,
    },
    {
      auth: {
        username: "multichainrpc",
        chain_name: "chronnet",
        password: "GTZuScB5khUytNTpjpKzvV8fqbvCHAftmYgKwXUP5Ha7",
      }
    }
  );
  return result.data;
}

// Displaying a landing page with HTTP GET request
app.get("/", function (req, res) {
  res.send("Service started, please run  <i>node serverstop.js</i>  to stop.");
});

// GBA Question 2 - returning an object with single property 'result', 
//                  returning an object with single property 'error' for error handling
app.get("/getAddress", function (req, res) {
  let firstaddress = callfunc("getaddresses", [])
    .then((resp) => {
      //extract the 1st address of the response to create an object
      const output ={"result": resp.result[0]};
      console.log(output);

      res.send(output);
    })
    .catch((e) => {
      res.send({"error": e});
    });
});

// GBA Question 3 - returning an object with single property 'result', 
//                  returning an object with single property 'error' for error handling
app.get("/getTokenBalances/:address", function (req, res) {
  let tokenbalances = callfunc("gettokenbalances", [req.params.address,])
    .then((resp) => {
      //extract tocken balance from 'address' and asset type as 'GalleryToken'
      const list = resp.result[req.params.address].filter(
        (x) => x["asset"] === "GalleryToken"
      );
      //extract the token id  
      const result = list.map((item, idx)=>{
          return item["token"];
      });

      const output = {"result": new Array(result.length)};
      output["result"] = result;

      console.log(output);

      res.send(output);
    })
    .catch((e) => {
      res.send({"error": e});
    });
});

// GBA Question 4 - returning the 'json' property withint the 'data' property
//                  of the 1st element of the result 
//                  returning an object with single property 'error' for error handling
app.get("/getTokenMetadata/:tokenid", function (req, res) {
  const stream = "gallery-token-registry";
  const tkid = req.params.tokenid;
  let streamkeyitems = callfunc("liststreamkeyitems", [stream, tkid])
    .then((resp) => {
      //extract 'json' property of the 'data' property of the 1st element 
      // of the response to create an object
      const output = {"result": resp.result[0].data.json};

      console.log(output);

      res.send(output);
    })
    .catch((e) => {
      res.send({"error": e});
    });
});
