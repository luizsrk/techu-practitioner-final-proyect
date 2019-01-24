var mocha=require('mocha');
var chai=require('chai');
var chaiHttp=require('chai-http');
var server=require('../server_v2');


var should=chai.should();

chai.use(chaiHttp);



describe('pruebas peru', () => {

  it('Test BBVA ', (done) => {

   chai.request('http://www.bbva.com')
       .get('/')
       .end((err,res) => {
             console.log("RESPUESTA:"+res)
             res.should.have.status(200)
             done()
       })
  })
  it('mi api funciona con get', (done) => {
       chai.request('http://localhost:3000')
        .get('/api_peru/v3/users')
        .end((err,res) => {
              //console.log("RESPUESTA:"+res)
              console.log(res.body[0]);
              //console.log(res.body);
              //res.should.have.status(200)
              //res.body.length.should.be.gte(1);
              res.body[0].should.have.property('first_name');
              res.body[0].should.have.property('last_name');
              done()
      })
  })
  it('mi api funciona con post', (done) => {
       chai.request('http://localhost:3000')
        .post('/api_peru/v3/users')
        .send('{"id" : 1 , "first_name": "Too0tsie", "last_name": "Nethercott",   "email": "prueba01@hotmail.com", "password": "prueba01"}')
        .end((err,res, body) => {
          console.log(body);
              res.body;
              done()
      })
  })
})
