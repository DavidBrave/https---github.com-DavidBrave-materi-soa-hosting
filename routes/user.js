const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser')

const db = require('../database');
const user = require('../models/user');

const router = express.Router();



router.post('/', async (req,res)=>{

    let nama = req.body.nama_user;
    let email = req.body.email;
    let tanggal = req.body.tanggal_lahir;
    let tipe = req.body.tipe_user;

    let result = await user.RegisterUser(
        nama, email, tanggal, tipe
    );


    res.status(result.status).json(result.response);
});


router.post('/topup', async (req,res)=>{

    const token = req.header("x-auth-token");
    let saldo = req.body.saldo;


    let result = await user.TopUp(
        token, saldo
    );


    res.status(result.status).json(result.response);
});


router.post('/recharge', async (req,res)=>{

    const token = req.header("x-auth-token");

    let result = await user.RechargeAPI(
        token
    );



    res.status(result.status).json(result.response);
});




module.exports = router;