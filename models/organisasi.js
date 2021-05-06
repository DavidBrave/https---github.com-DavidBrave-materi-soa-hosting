const db = require('../database');
const jwt = require('jsonwebtoken');

const secret = "TuG4sS046715";


async function AddOrganisasi(jwt_key, nama_organisasi, ketua_organisasi) {
    

    let conn = await db.getConn();
    let query = await db.executeQuery(conn, `
        SELECT *
        FROM user
        WHERE nrp = '${ketua_organisasi}'
    `)
    conn.release();

    if (query.length < 1) {
        return({
            "status" : 404,
            "error" : "User tidak ditemukan",
            "nrp" : ketua_organisasi
        });
    }


    let user = null;
    try{

        user = jwt.verify(jwt_key, secret);

    }catch(err){

        return({
            "status" : 401,
            "error" : "Unauthorized"
        });

    }

    if(user.nrp != "admin"){
        return({
            "status" : 403,
            "error" : "You are not allowed to do this action"
        });
    }


    let singkatan_org = "O";
    var array_nama = nama_organisasi.split(" ")
    if(array_nama.length>1){
        singkatan_org += (array_nama[0][0]).toUpperCase();
        singkatan_org += (array_nama[1][0]).toUpperCase();
    }else{
        singkatan_org += (arrNama[0][0]).toUpperCase();
        singkatan_org += (arrNama[0][1]).toUpperCase();
    }


    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        SELECT *
        FROM organisasi
    `)
    conn.release();

    

    let ctr = 0;
    let organisasis = query;
    for (const iterator of organisasis) {
        //console.log(singkatan_org + " == " + (iterator.kode).substring(0, 2));
        if (singkatan_org == (iterator.kode).substring(0, 3)) {
            
            let str_id = iterator.kode;
            //console.log(str_id);
            str_id = str_id.substring(3, 7);
            //console.log(str_id);

            if (ctr < Number.parseInt(str_id)) {
                ctr = Number.parseInt(str_id);
            }
        }
    }
    ctr++;

    let padded = "";
    if (ctr < 10) {
        padded = "000";
    }
    if (ctr >= 10 && ctr < 100) {
        padded = "00";
    }
    if (ctr >= 100 && ctr < 1000) {
        padded = "0";
    }

    let kode_organisasi = singkatan_org + padded + ctr;


    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        INSERT INTO organisasi
        VALUES (
            '${kode_organisasi}',
            '${nama_organisasi}',
            '${ketua_organisasi}'
        )
    `);

    conn.release();


    return({
        "status" : 201,
        "success" : "Organisasi berhasil ditambahkan",
        "kode_organisasi" : kode_organisasi,
        "nama_organisasi" : nama_organisasi,
        "ketua_organisasi" : ketua_organisasi
    })

}






module.exports = {
    "AddOrganisasi" : AddOrganisasi
};