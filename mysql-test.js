var mysql      = require('mysql');
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'nanpos',
   password : 'sonic',
   database : 'nanpos',
   debug: true
 });
 
 connection.connect();
 
 connection.query('SELECT * from Categories', function(err, rows, fields) {
   if (!err)
     console.log('The solution is: ', rows);
   else
     console.log('Error while performing Query.');
 });
 
 connection.end();