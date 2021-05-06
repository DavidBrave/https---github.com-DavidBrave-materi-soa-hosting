const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser')

const db = require('../database');
const content = require('../models/content');

const router = express.Router();



router.post('/', async (req,res)=>{

    let nama = req.body.nama_konten;
    let status = req.body.status;
    let link = req.body.link;
    let kategori = req.body.kategori;

    const token = req.header("x-auth-token");
    let result = await content.AddContent(
        token, nama, status, link, kategori
    );


    res.status(result.status).json(result.response);
});


router.get('/', async (req,res)=>{

    let nama = req.query.nama;
    let kategori = req.query.kategori;

    const token = req.header("x-auth-token");
    let result = await content.GetContent(
        token, kategori, nama
    );


    res.status(result.status).json(result.response);
});


router.get('/:id_konten', async (req,res)=>{

    let id = req.params.id_konten;

    const token = req.header("x-auth-token");
    let result = await content.GetContentWithID(
        token, id
    );


    res.status(result.status).json(result.response);
});





module.exports = router;