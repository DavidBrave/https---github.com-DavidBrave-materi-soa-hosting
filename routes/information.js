const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser')

const db = require('../database');
const information = require('../models/information');

const router = express.Router();



router.post('/', async (req,res)=>{

    let nama = req.body.nama_tempat;
    let kota = req.body.kota;
    let deskripsi = req.body.deskripsi;
    let kategori = req.body.kategori;

    const token = req.header("x-auth-token");
    let result = await information.AddPlace(
        token, nama, kota, deskripsi, kategori
    );


    res.status(result.status).json(result.response);
});






module.exports = router;