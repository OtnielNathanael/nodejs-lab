const mysql = require('mysql');
const koneksi = mysql.createConnection({
   host: 'Localhost',
   user: 'root',
   password: '',
   database: 'dbmovies',
   multipleStatements: true
});

koneksi.connect((err) => {
   if (err) throw err;
   console.log('MySQL Connected...');
});
module.exports = koneksi;
