const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser')

const db = require('../database');
const kegiatan = require('../models/kegiatan');

const router = express.Router();



router.get('', async (req,res)=>{

    const token = req.header("x-auth-token");
    let kode = req.query.kode_kegiatan;

    let result = await kegiatan.GetKegiatan(
        token, kode
    );

    res.status(result.status).json(result);

    //res.status(200).json(" ");
});

router.post('', async (req,res)=>{

    const token = req.header("x-auth-token");
    let kode = req.body.kode_organisasi;
    let nama = req.body.nama_kegiatan;
    let ketua = req.body.ketua_kegiatan;

    let result = await kegiatan.AddKegiatan(
        token, kode, nama, ketua
    );

    res.status(result.status).json(result);
});


router.post('/peserta', async (req,res)=>{

    const token = req.header("x-auth-token");
    let kode = req.body.kode_kegiatan;
    let pesertas = req.body.daftar_peserta;

    let result = await kegiatan.AddPeserta(
        token, kode, pesertas
    );

    res.status(result.status).json(result);
});


router.put('/peserta', async (req,res)=>{

    const token = req.header("x-auth-token");
    let kode = req.body.kode_kegiatan;
    let nrp = req.body.nrp;
    let poin = req.body.poin;

    let result = await kegiatan.UbahPoin(
        token, kode, nrp, poin
    );

    res.status(result.status).json(result);
});





module.exports = router;