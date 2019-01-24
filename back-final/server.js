var express = require('express');
var bodyParser=require('body-parser');
var app = express();
var port=process.env.PORT || 3000;
var uri="/api_peru/V1/";
var usersFile=require("./users.json");

app.use(bodyParser.json());
app.listen(port);
console.log("Escuchando por:"+ port );


//Method GET with params
app.get(uri + "users/:id",
  function (req, res) {
    console.log("GET/api_peru/v1/users/:id");
    console.log("request.params.id: "+req.params.id);
    //console.log(req.headers);
    var pos = req.params.id;
    //res.send(req.params);
    //res.send({"msg": "get  paramas Peticion Correcta"});
    res.send(usersFile[pos-1]);
});

//Method GET with Query
app.get(uri + "users",
  function(req, res){
    console.log("GET with query");
    console.log(req.query.id);
    var pos = req.query.id;
    //res.send({"msg" : "Query with Response"});
    res.send(usersFile[pos-1]);
});


//Method POST
app.post(uri + "users",
  function (req, res){
    console.log(req.body);
    console.log(req.body.first_name);
    //res.send(201,{"msg": "post Peticion Correcta"});
    //res.sendfile("users.json");
    //res.sendFile('users.json',{root : __dirname});
    var jsonID={};
    var newId = usersFile.length + 1;
    jsonID= req.body;
    jsonID.id =newId;
    usersFile.push(req.body);
    res.send(201,{"msg":"Usuario creado Correactamente", jsonID});
});

//Method POST
/*app.post(uri + 'users',
 function(req, res) {
   var newID = usersFile.length + 1;
   var newUser = {
     "id" : newID,
     "first_name" : req.body.first_name,
     "last_name" : req.body.last_name,
     "email" : req.body.email,
     "country" : req.body.country
   };
   usersFile.push(newUser);
   console.log(usersFile);
   res.send({"msg" : "Usuario creado correctamente: ", newUser});
 });*/

//Method PUT
/*app.put(uri + 'users/:id',
  function(req, res){
    console.log("PUT /api_peru/v2/users/:id");
    var idBuscar = req.params.id;
    var updateUser = req.body;
    for(i = 0; i < usersFile.length; i++) {
      console.log(usersFile[i].id);
      if(usersFile[i].id == idBuscar) {
        res.send({"msg" : "Usuario actualizado correctamente.", updateUser});
      }
    }
    res.send({"msg" : "Usuario no encontrado.", updateUser});
  });*/

  //Method PUT
  app.put(uri + 'users/:id',
    function(req, res){
      console.log("PUT /api_peru/v2/users/:id");
      var idBuscar = req.params.id;
      var updateUser = req.body;
      var encontrado = false;
      for(i = 0; (i < usersFile.length) && !encontrado; i++) {
        console.log(usersFile[i].id);
        if(usersFile[i].id == idBuscar) {
          encontrado = true;
          usersFile[i]=updateUser;
          res.send({"msg" : "Usuario actualizado correctamente.", updateUser});
        }
      }
      if(!encontrado) {
        res.send({"msg" : "Usuario no encontrado.", updateUser});
      }
    });

//Metodo DELETE
app.delete(uri + 'users/:id',
  function (req, res) {
    console.log("DELETE /api_peru/v2/users/:id");
    console.log(req.params.id);
    var idBuscar = req.params.id;
    var deleteUser = req.body;
    for(i = 0; i < usersFile.length; i++) {
      console.log(usersFile[i].id);
      if(usersFile[i].id == idBuscar) {
        usersFile.splice(i,1);
        res.send({"msg" : "Usuario Eliminado correctamente."});
      }
    }
    res.send({"msg": "Usuario no encontrado"});
});
