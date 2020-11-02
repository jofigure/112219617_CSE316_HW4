const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://joanna:qwerty1@cluster0.w03kq.mongodb.net/ClassesDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

MongoClient.connect(uri, function (err, db) {
  if (err) throw err;
  var dbo = db.db("ClassesDB");
//var query = { Sctn: "Machine Learning" };
  // dbo.collection("class").find(query).toArray(function (err, result) {
  //   if (err) throw err;
  //   console.log(result);
  //   db.close();
  // });
});

const express = require('express');
const app = express();
const path = require('path');
var bodyParser = require('body-parser');
//const { connect } = require('http2');
//var urlencodedParser = bodyParser.urlencoded({ extended: false });
const PORT = 3000;
app.use(express.static(path.join(__dirname, "ClassFindHW4")));
app.use(bodyParser()); 

var courseScript = new 



app.get('/', (req, res) => {
  res.sendFile('ClassFindHW4.html',{root: __dirname});
  //console.log(req.body.searchText);
}); //cd C:\Users\joann\112219617_CSE316_HW4
app.post('/', (req,res) => {
 var name = req.body.searchText;
 if(name == null || name == ""){

  MongoClient.connect(uri, function (err, db) {
    if (err) throw err;
    var dbo = db.db("ClassesDB");
   dbo.collection("class").find().toArray(function (err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
  console.log("name is suppose to b empty");}
});


app.listen(PORT, function(err){  if (err) console.log(err); 
console.log("Server listening on PORT", PORT);
});
