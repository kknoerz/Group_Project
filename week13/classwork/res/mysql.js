var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var PORT = 3000; //avoid ports between 1-1234, use 3000, and 8080

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));


app.listen(PORT, function(){
   console.log('app is listening on port ' + PORT);
})

var connection = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  database  : 'reservation'
});


app.get('/tables', function(req, res){


  connection.query('select * from customers', function(err, total){
    if(err) throw err;
    // console.log('this is total id',total[0].id);

    res.json(total);

    connection.query('select * from reservations', function(err, res){
      if(err) throw err;
      // console.log(res)

      if (res.length < 5){
        connection.query('delete from reservations', function(err, delRes){
          if(err) throw err;
          // console.log(delRes);
        });

        for(i=0; i<5; i++){
          connection.query('insert into reservations (customer_id) value('+total[i].id+')', function(err, res){
            if (err) throw err;
            // console.log('this is 1-5 in res',res);

          });
        }
      }

      connection.query('delete from waitings', function(err, delWait){
        if(err) throw err;
        // console.log(delWait);
      });

      for(i=5; i<total.length; i++){
        connection.query('insert into waitings (customer_id) value('+total[i].id+')', function(err, wait){
          if (err) throw err;
          // console.log('this is cus 6+ in waitings', wait);

        });
      }
    });
  });

});

app.get('/reservations', function(req, res){
  connection.query('select * from reservations', function(err, reserv){
    if(err) throw err;
    // console.log(res)

    res.json(reserv);
  });

});

app.get('/waitings', function(req, res){
  connection.query('select * from waitings', function(err, wait){
    if(err) throw err;
    // console.log(res)

    res.json(wait);
  });

});
