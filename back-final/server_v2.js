var express = require('express');
var bodyParser=require('body-parser');
var app = express();
var port=process.env.PORT || 3000;
var uri="/api_peru/v3/";
var usersFile=require("./users.json");
var baseMLabUrl="https://api.mlab.com/api/1/databases/bdapi_peru/collections/";
var fs = require('fs');
var requestJSON = require('request-json');
var apikeyMLab="apiKey=8UTZVy2FCsLnVPizP9tX4tl3HEHWiQvM";
var queryString='f={"_id":0}&';
var newID=0;
var cors = require('cors');
var dateformat = require('dateformat');
var hoy = new Date();
var ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.use(bodyParser.json());
app.listen(8080, ip);
app.use(cors());
console.log("Escuchando por:"+ ip );

module.exports = app;

//Method GET with params MLab users
app.get(uri + "users",
  function (req, res) {
    console.log("GET/api_peru/v3/user");
    var httpClient = requestJSON.createClient(baseMLabUrl);
    console.log("cliente http mlab creado")
    httpClient.get('user?' + queryString + apikeyMLab,
      function(error, respuestaMLab, body){
        console.log(apikeyMLab);
        console.log('error '+ error);
        console.log('respuestaMLab '+respuestaMLab);
        //console.log('body '+body);
        //var respuesta = body;
        var respuesta = {};
        respuesta = !error ? body : {"msg":"error al recuperar usuarios de mlab"};
        res.send(respuesta);
        newID=body.length;
        console.log("newID:"+ newID);
      });
});

//Method GET with params MLab users with ID
app.get(uri + "users/:userID",
  function (req, res) {
    console.log("GET/api_peru/v3/users/:userID");
    console.log("request.params.id: "+req.params.userID);
    var userID=req.params.userID;
    var queryStringUserID='q={"userID":' + userID + '}&';
    var httpClient = requestJSON.createClient(baseMLabUrl);
    httpClient.get('user?' + queryString + queryStringUserID + apikeyMLab,
      function(error, respuestaMLab, body){
        console.log('error '+ error);
        console.log('respuestaMLab '+respuestaMLab);
        var respuesta = {};
        respuesta = !error ? body[0]   : {"msg":"usuario con ese ID no encontrado"};
        res.send(respuesta);
      });
});

//POST of user -  Insertar un nuevo usuario
app.post(uri + "users",
 function(req, res) {
  console.log("POST/api_peru/v3/users");
  var  clienteMlab = requestJSON.createClient(baseMLabUrl);
  clienteMlab.get('user?'+ apikeyMLab ,
  function(error, respuestaMLab , body) {
      newID= parseInt(body.length)+1;
      console.log("newID:" + newID);
      var newUser = {
        "userID":newID,         
        "first_name" : req.body.first_name,
        "last_name" : req.body.last_name,
        "email" : req.body.email,
        "gender": req.body.gender,
		    "ip_address": req.body.ip_address,
        "password" : req.body.password
      };
      clienteMlab.post(baseMLabUrl + "user?" + apikeyMLab, newUser ,
       function(error, respuestaMLab, body) {
        res.send(body);
     });
  });
});

//PUT of user - Actualizacion de usuarios
app.put(uri + 'users/:userID',
function(req, res) {
console.log("PUT/api_peru/v3/users:id");
var  clienteMlab = requestJSON.createClient(baseMLabUrl);
var userID=req.params.userID
var queryStringUserID='q={"userID":' + userID + '}&';
 clienteMlab.get('user?' +  queryStringUserID + apikeyMLab ,
 function(error, respuestaMLab , body) {
   console.log("userID:" + userID);
   var respuesta = body[0];
    if(respuesta != undefined){    
     var cambio = '{"$set":' + JSON.stringify(req.body) + '}';
     clienteMlab.put(baseMLabUrl + 'user?q={"userID": ' + userID + '}&' + apikeyMLab, JSON.parse(cambio),
      function(error, respuestaMLab, body) {
        console.log("body:"+ body);
       res.send(body);
     });
    }else{
      res.send({"msg":"Usuario con ese ID no encontrado"});
    }
 });
});

//DELETE user with id - Eliminar Usuarios
app.delete(uri + "users/:userID",
  function(req, res){
    console.log("DELETE/api_peru/v3/users:id");
    console.log("request.params.id: "+req.params.userID);
    var userID=req.params.userID;
    var queryStringID='q={"userID":' + userID + '}&';
    console.log(baseMLabUrl + 'user?' + queryStringID + apikeyMLab);
    var httpClient = requestJSON.createClient(baseMLabUrl);
    httpClient.get('user?' +  queryStringID + apikeyMLab,
      function(error, respuestaMLab, body){               
        var respuesta = body[0];
        if(respuesta != undefined){        
        console.log("body delete:"+ respuesta);       
        httpClient.delete(baseMLabUrl + "user/"+ respuesta._id.$oid +'?'+ apikeyMLab,
          function(error, respuestaMLab,body){
            res.send(body);
        });
      }else{
        res.send({"msg":"Usuario con ese ID no encontrado"});
      }
      });
  });

//Method GET with params MLab account
app.get(uri + "account",
  function (req, res) {
    console.log("GET/api_peru/v3/account");
    var httpClient = requestJSON.createClient(baseMLabUrl);
    console.log("cliente http mlab creado")
    httpClient.get('account?' + queryString + apikeyMLab,
      function(error, respuestaMLab, body){
        console.log('error '+ error);
        console.log('respuestaMLab '+respuestaMLab);
        //console.log('body '+body);
        //var respuesta = body;
        var respuesta = {};
        respuesta = !error ? body : {"msg":"error al recuperar cuentas de mlab"};
        res.send(respuesta);
      });
});


//Method GET with params MLab users and accounts with ID
app.get(uri + "users/:id/account",
function (req, res) {
  console.log("GET/api_peru/v3/users/:id/account");
  console.log("request.params.id: "+req.params.id);
  var id=req.params.id;
  var queryStringID='q={"userId":' + id + '}&';
  var httpClient = requestJSON.createClient(baseMLabUrl);
  httpClient.get('account?' + queryString + queryStringID + apikeyMLab,
    function(error, respuestaMLab, body){
      console.log('error '+ error);
      console.log('respuestaMLab '+respuestaMLab);
      console.log('body '+body);
      //var respuesta = body;
      var respuesta = {};
      respuesta = !error ? body   : {"msg":"usuario con ese ID no encontrado"};
      res.send(respuesta);
    });
});

//Method GET with params MLab users and movements with ID
app.get(uri + "users/account/:ida/movement",
function (req, res) {
  console.log("GET/api_peru/v3/users/account/:id/movement");
  var ida=req.params.ida;
  var queryStringIDA='q={"idCuenta":' + ida + '}&';
  var httpClient = requestJSON.createClient(baseMLabUrl);
  httpClient.get('account?' + queryString +  queryStringIDA + apikeyMLab,
  function(error, respuestaMLab, body){
    console.log(baseMLabUrl +'account?'+ queryString+queryStringIDA+apikeyMLab);
    var respuesta = body[0];
    if(respuesta!=undefined){
        console.log(JSON.stringify(body))
        var respuesta = {
          "idCuenta":body[0].idCuenta,
          "saldo":body[0].saldoDisponible,
          "movimientos":body[0].movimientos
        };
        respuesta = !error ? respuesta : {"msg":"Error recuperando movimientos"};
        res.send(respuesta);
     
    }else{
        console.log("Cuenta no existe");
        res.send({"msg": "Cuenta no existe"});
    }
  }); 
});

//Method GET with params MLab account with ID
app.get(uri + "account/:id",
  function (req, res) {
    console.log("GET/api_peru/v3/account/:id");
    console.log("request.params.id: "+req.params.id);
    var id=req.params.id;
    var queryStringID='q={"nroCuenta":"' + id + '"}&';
    var httpClient = requestJSON.createClient(baseMLabUrl);
    httpClient.get('account?' + queryString + queryStringID + apikeyMLab,
      function(error, respuestaMLab, body){
        console.log('error '+ error);
        console.log('respuestaMLab '+respuestaMLab);
        console.log('body '+body);
        //var respuesta = body;
        var respuesta = {};
        respuesta = !error ? body[0]   : {"msg":"usuario con ese ID no encontrado"};
        res.send(respuesta);
      });
});


//Method GET with params MLab movement with ID
app.get(uri + "movement/:id",
  function (req, res) {
    console.log("GET/api_peru/v3/movement/:id");
    console.log("request.params.id: "+req.params.id);
    var id=req.params.id;
    var queryStringID='q={"idCuenta":' + id + '}&';
    var httpClient = requestJSON.createClient(baseMLabUrl);
    httpClient.get('account?' + queryString + queryStringID + apikeyMLab,
      function(error, respuestaMLab, body){
        console.log('error '+ error);
        console.log('respuestaMLab '+respuestaMLab);
        console.log('body '+body);
        //var respuesta = body;
        var respuesta = {};
        respuesta = !error ? body[0]   : {"msg":"Cuenta con ese ID no encontrado"};
        res.send(respuesta);
      });
});

//Method POST login
app.post(uri + "login",
  function (req, res){
    console.log("POST /api_peru/v3/login");
    var email= req.body.email;
    var pass= req.body.password;
    var queryStringEmail='q={"email":"' + email + '"}&';
    var queryStringpass='q={"password":' + pass + '}&';
    var  clienteMlab = requestJSON.createClient(baseMLabUrl);
    clienteMlab.get('user?'+ queryStringEmail+apikeyMLab ,
    function(error, respuestaMLab , body) {
      console.log("entro al body:" + body );
      var respuesta = body[0];
      console.log(respuesta);
      if(respuesta!=undefined){
          if (respuesta.password == pass) {
            console.log("Login Correcto");
            var session={"logged":true};
            var login = '{"$set":' + JSON.stringify(session) + '}';
            console.log(baseMLabUrl+'?q={"userID": ' + respuesta.userID + '}&' + apikeyMLab);
            clienteMlab.put('user?q={"userID": ' + respuesta.userID + '}&' + apikeyMLab, JSON.parse(login),
             function(errorP, respuestaMLabP, bodyP) {
              res.send(body[0]);
            });
          }
          else {
            res.send({"msg":"contraseña incorrecta"});
          }
      }else{
        console.log("Email Incorrecto");
        res.send({"msg": "email Incorrecto"});
      }
    });
});


//Method POST logout
app.post(uri + "logout",
  function (req, res){
    console.log("POST /api_peru/v3/logout");
    var email= req.body.email;
    var queryStringEmail='q={"email":"' + email + '"}&';
    var  clienteMlab = requestJSON.createClient(baseMLabUrl);
    clienteMlab.get('user?'+ queryStringEmail+apikeyMLab ,
    function(error, respuestaMLab , body) {
      console.log("entro al post de logout");
      var respuesta = body[0];
      console.log(respuesta);
      if(respuesta!=undefined){
            console.log("logout Correcto");
            var session={"logged":true};
            var logout = '{"$unset":' + JSON.stringify(session) + '}';
            console.log(logout);
            console.log(baseMLabUrl+'user?q={"userID": ' + parseInt(respuesta.userID) + '}&' + apikeyMLab);
            clienteMlab.put('user?q={"userID": ' + respuesta.userID + '}&' + apikeyMLab, JSON.parse(logout),
            console.log(respuesta.userID),
             function(errorP, respuestaMLabP, bodyP) {
              res.send(body[0]);
              //res.send({"msg": "logout Exitoso"});
            });
      }else{
        console.log("Error en logout");
        res.send({"msg": "Error en logout"});
      }
    });
});

//Method POST transferencia
app.post(uri + "transfer",
  function (req, res){
    console.log("POST /api_peru/v3/transfer");
    var montoTransferencia= parseFloat(req.body.montoTransferencia);
    var cuentaCargo= req.body.cuentaCargo;
    var cuentaDestino= req.body.cuentaDestino;
    var queryStringCuentaCargo='q={"nroCuenta":"' + cuentaCargo + '"}&';
    var queryStringCuentaDestino='q={"nroCuenta":"' + cuentaDestino + '"}&';
    var  clienteMlab = requestJSON.createClient(baseMLabUrl);
    //Obtenemos Cuenta Cargo
    clienteMlab.get('account?'+ queryStringCuentaCargo+apikeyMLab ,
    function(error, respuestaMLab , bodyCuentaCargo) {
      console.log("entro al post de transferencias");
      var respuesta = bodyCuentaCargo[0];         
      if(respuesta!=undefined){
        console.log("Cuenta Cargo "+bodyCuentaCargo[0].nroCuenta);  
        //Obtenemos Cuenta Destino        
        clienteMlab.get('account?'+ queryStringCuentaDestino+apikeyMLab ,
        function(error, respuestaMLab , bodyCuentaDestino) {         
          respuesta = bodyCuentaDestino[0];          
          if(respuesta!=undefined){
            console.log("Cuenta Destino "+bodyCuentaDestino[0].nroCuenta);
            var saldoCuentoCargo = parseFloat(bodyCuentaCargo[0].saldoDisponible);
            var idCuentaCargo = bodyCuentaCargo[0].idCuenta;
            console.log("saldoCuentoCargo "+saldoCuentoCargo);            
            if(montoTransferencia<saldoCuentoCargo){
              console.log(baseMLabUrl+'?q={"idCuenta": ' + idCuentaCargo + '}&' + apikeyMLab);
              var movimientoCuentaCargo=bodyCuentaCargo[0].movimientos;              
              var cantidadMovCuentacargo = parseInt(movimientoCuentaCargo.length);
              var newMovimientoCargo = {
                        "idmov":cantidadMovCuentacargo+1,         
                        "fecha" : dateformat(hoy,'dd/mm/yyyy'),
                        "descripcion" : "Nuevo movimiento Cargo",                        
                        "monto" : montoTransferencia,
                        "itf": 0.5,
                        "tipomov" : 0                      
              };
              movimientoCuentaCargo.push(newMovimientoCargo);
              var updateCuentaCargoJson={"movimientos": movimientoCuentaCargo,"saldoDisponible": (saldoCuentoCargo - montoTransferencia)};
              var updateCuentaCargoSet = '{"$set":' + JSON.stringify(updateCuentaCargoJson) + '}';
               //Actualizamos Saldo y movimiento Cargo 
              clienteMlab.put('account?q={"idCuenta": ' + idCuentaCargo+ '}&' + apikeyMLab, JSON.parse(updateCuentaCargoSet),
               function(errorCargo, respuestaMLabP, bodyCargo) {               
                if(!errorCargo){
                  var saldoCuentoDestino = parseFloat(bodyCuentaDestino[0].saldoDisponible);                  
                  console.log(baseMLabUrl+'?q={"idCuenta": ' + bodyCuentaDestino[0].idCuenta + '}&' + apikeyMLab);
                  var movimientoCuentaDestino=bodyCuentaDestino[0].movimientos;              
                  var cantidadMovCuentaDestino = parseInt(movimientoCuentaDestino.length);
                  var newMovimientoDestino = {
                            "idmov":cantidadMovCuentaDestino+1,         
                            "fecha" : dateformat(hoy,'dd/mm/yyyy'),
                            "descripcion" : "Nuevo movimiento Abono",                            
                            "monto" : montoTransferencia,
                            "itf": "0.5",
                            "tipomov" : 1                      
                  };
                  movimientoCuentaDestino.push(newMovimientoDestino);
                  var updateCuentadestinoJson={"movimientos": movimientoCuentaDestino,"saldoDisponible": (saldoCuentoDestino + montoTransferencia)};
                  var updateCuentaDestinoSet = '{"$set":' + JSON.stringify(updateCuentadestinoJson) + '}';
                  //Actualizamos Saldo y movimientos cuenta Destino 
                  clienteMlab.put('account?q={"idCuenta": ' + bodyCuentaDestino[0].idCuenta + '}&' + apikeyMLab, JSON.parse(updateCuentaDestinoSet),
                   function(errorDestino, respuestaMLabP, bodyDestino) {               
                    if(!errorDestino){                      
                      console.log("Transferencia realizada correctamente");
                      res.send({"estadoTransferencia":"ok","msg": "Transferencia realizada correctamente","saldoDisponibleCuentaCargo":saldoCuentoCargo - montoTransferencia});
    
                    }else{
                      console.log("Error al realizar la transferencia");
                      res.send({"estadoTransferencia":"error","msg": "Error al realizar la transferencia"});
                    }
                  });
                }else{
                  console.log("Error al realizar el cargo");
                  res.send({"estadoTransferencia":"error","msg": "Error al realizar el cargo"});
                }
              });
              
            }else{
              console.log("Saldo insuficiente");
              res.send({"estadoTransferencia":"error","msg": "Saldo insuficiente"});
            }           
               
          }else{
            console.log("No existe la cuenta de destino");
            res.send({"estadoTransferencia":"error","msg": "No existe la cuenta de destino"});
          }
        });
           
      }else{
        console.log("No existe la cuenta de cargo");
        res.send({"estadoTransferencia":"error","msg": "No existe la cuenta de cargo"});
      }
    });
});


