const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const multer = require('multer')
const path = require('path')
const app = express();
const port = 5000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// buat server nya
// use express stastic folder
app.use(express.static("./public"))
// use of multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images/')
    },
    filename: (req, file, callBack) =>{
        callBack(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});


// read data / get data
app.get('/api/movie-specific/:id', (req, res) => {
    // buat query sql
    const querySql = 'SELECT judul,rating,deskripsi FROM movie where id=?';

    // jalankan query
    koneksi.query(querySql,req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});


// read data / get data
app.get('/api/movie', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM movie';

    // jalankan query
    koneksi.query(querySql,req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});

app.post('/api/movie',upload.single('image'),(req, res) =>{

    if (!req.file){
        console.log("No File Upload");
        const data = {...req.body};
        const querySql = 'INSERT INTO movie (judul, rating, deskripsi, sutradara) VALUES (?,?,?,?)';
        const judul = data.judul;
        const rating = data.rating;
        const deskripsi = data.deskripsi;
        const sutradara = data.sutradara;
        

        koneksi.query(querySql,[judul, rating, deskripsi, sutradara], (err,rows, field)=>{
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err })
        }

        res.status(201).json({ success: true, message: 'Data berhasil ditambahkan'+data});
        });
    }  else {
        console.log(req.file.filename)
        var imgsrc = 'http://localhost:5000/images/' + req.file.filename
        // buat variabel penampung data dan query sql
            const data = {...req.body};
            const querySql = 'INSERT INTO movies (judul, rating, deskripsi, sutradara, foto) VALUES (?,?,?,?,?);';
            const judul = data.judul;
            const rating = data.rating;
            const deskripsi = data.deskripsi;
            const sutradara = data.sutradara;
            const foto = imgsrc

            koneksi.query(querySql,[judul, rating, deskripsi, sutradara, foto], (err,rows, field)=>{
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err })
                }
        
                res.status(201).json({ success: true, message: 'Data berhasil ditambahkan'+data});
                });

}
})

// delete data
app.delete('/api/movies/:id', (req,res)=> {
    // buat query sql untuk mencari data dan hapus
    const querySearch = 'SELECT * FROM movie where id = ?';
    const queryDelete = 'DELETE FROM movie where id = ?';
    koneksi.query(queryDelete,req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});



app.get('/api/movies/filter/:judul', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM movie where judul like \'%' + req.params.judul + '%\';';
    console.log(querySql);
    // jalankan query
    koneksi.query(querySql,req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
