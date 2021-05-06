const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser')

const db = require('../database');
const organisasi = require('../models/organisasi');

const router = express.Router();



router.post('', async (req,res)=>{

    const token = req.header("x-auth-token");
    let nama = req.body.nama_organisasi;
    let ketua = req.body.ketua_organisasi;

    let result = await organisasi.AddOrganisasi(
        token, nama, ketua
    );

    res.status(result.status).json(result);
});




module.exports = router;



