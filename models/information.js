const db = require('../database');
const jwt = require('jsonwebtoken');


async function AddPlace(api_key, nama_tempat, kota, deskripsi_tempat, kategori_tempat) {

    let conn = await db.getConn();
    let query = await db.executeQuery(conn, `
        SELECT *
        FROM user
        WHERE api_key = '${api_key}'
    `)
    conn.release();

    if (query.length < 1) {
        return({
            "status" : 404,
            "response" : {
                "error" : "Api key tidak terdaftar"
            }
        });
    }

    let user = query[0];



    let kategori = "Tidak Berkategori"
    if (kategori_tempat == "0") {
        kategori = "Ruang Terbuka";
    }
    else if (kategori_tempat == "1") {
        kategori = "Taman Bermain";
    }
    else if (kategori_tempat == "2") {
        kategori = "Bangunan Bersejarah";
    }
    else {
        return({
            "status" : 404,
            "response" : {
                "error" : "Kategori tidak tercatat"
            }
        });
    }


    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        INSERT INTO tempat
        VALUES (
            null,
            '${nama_tempat}',
            '${kota}',
            '${deskripsi_tempat}',
            '${kategori}',
            '${user.api_key}',
            '${user.email}'
        )
    `);

    conn.release();

    let conn = await db.getConn();
    let query = await db.executeQuery(conn, `
        SELECT *
        FROM tempat
    `)
    conn.release();


    let tempat = null;

    let idx = 0;
    while (query[idx] != null) {
        tempat = query[idx];

        idx++;
    }


    if (user.api_hit < 5) {
        user.api_hit = 0;
    }
    else {
        user.api_hit = user.api_hit - 5;
    }

    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        UPDATE user
        SET api_hit = ${user.api_hit}
        WHERE api_key = '${api_key}'
    `)
    conn.release();



    return({
        "status" : 201,
        "response" : {
            "success" : "Tempat berhasil ditambahkan",
            "kode" : tempat.id,
            "nama_tempat" : nama_tempat,
            "kota" : kota,
            "deskripsi" : deskripsi_tempat,
            "kategori" : kategori_tempat
        }
    })

}






module.exports = {
    "AddPlace" : AddPlace
};


