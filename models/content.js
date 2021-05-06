const db = require('../database');
const jwt = require('jsonwebtoken');

const secret = "TuG4sS046715";


async function AddContent(api_key, nama_konten, status_konten, link_konten, kategori_konten) {
    
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

    if (user.tipe_user != "Creator") {
        return({
            "status" : 403,
            "response" : {
                "error" : "User tidak dapat mengakses halaman ini"
            }
        });
    }


    let kategori = "Tidak Berkategori"
    if (kategori_konten == "0") {
        kategori = "Edukasi";
    }
    else if (kategori_konten == "1") {
        kategori = "Entertainment";
    }
    else if (kategori_konten == "2") {
        kategori = "Olahraga";
    }
    else {
        return({
            "status" : 404,
            "response" : {
                "error" : "Kategori tidak tercatat"
            }
        });
    }
    

    let status = "Tidak Berstatus";
    if (status_konten == "0") {
        status = "Free";
    }
    else if (status_konten == "1") {
        status = "Premium";
    }
    else {
        return({
            "status" : 404,
            "response" : {
                "error" : "Status tidak tercatat"
            }
        });
    }



    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        SELECT *
        FROM content
    `)
    conn.release();


    let ctr = 0;
    let contents = query;
    for (const iterator of contents) {
        if (status.substring(0, 1) == (iterator.id).substring(0, 1)) {
            let str_id = iterator.id;
            str_id = str_id.substring(1);

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

    let id = status.substring(0, 1) + padded + ctr.toString();

    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        INSERT INTO content
        VALUES (
            '${id}',
            '${nama_konten}',
            '${status}',
            '${link_konten}',
            '${kategori}'
        )
    `);

    conn.release();

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
            "success" : "Konten berhasil ditambahkan",
            "kode_konten" : id,
            "nama_konten" : nama_konten,
            "status" : status,
            "link" : link_konten,
            "kategori" : kategori
        }
    })



}

async function GetContent(api_key, kategori_konten, nama_konten) {
    

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
    if (kategori_konten == "0") {
        kategori = "Edukasi";
        console.log(kategori + " " + nama_konten);
    }
    else if (kategori_konten == "1") {
        kategori = "Entertainment";
    }
    else if (kategori_konten == "2") {
        kategori = "Olahraga";
    }
    else if (kategori_konten == "") {
        kategori = "";
    }
    else {
        return({
            "status" : 404,
            "response" : {
                "error" : "Kategori tidak tercatat"
            }
        });
    }

    if (user.api_hit < 1) {
        return({
            "status" : 400,
            "response" : {
                "error" : "Api hit tidak mencukupi"
            }
        });
    }
    else {
        user.api_hit = user.api_hit - 1;
    }

    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        UPDATE user
        SET api_hit = ${user.api_hit}
        WHERE api_key = '${api_key}'
    `)
    conn.release();



    // conn = await db.getConn();
    // query = await db.executeQuery(conn, `
    //     SELECT *
    //     FROM content
    //     WHERE UPPER(kategori) = UPPER('${kategori}')
    //     AND UPPER(nama) = UPPER('%${nama_konten}%')
    // `)
    // conn.release();

    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        SELECT *
        FROM content
    `)
    conn.release();

    let tampilan = [];

    let contents = query;
    for (const iterator of contents) {

        if (iterator.kategori == kategori || kategori == "") {
            if (((iterator.nama).toUpperCase()).includes(nama_konten.toUpperCase()) || 
            nama_konten == "") {
                let isi_tampilan = {};
                isi_tampilan.kode_konten = iterator.id;
                isi_tampilan.nama_konten = iterator.nama;
                isi_tampilan.kategori = iterator.kategori;

                tampilan.push(isi_tampilan);
            }
        }
        
    }


    return({
        "status" : 200,
        "response" : {
            "success" : "Data konten berdasar query",
            "data" : tampilan
        }
    })



}


async function GetContentWithID(api_key, id_konten) {
    

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


    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        SELECT *
        FROM content
        WHERE id = '${id_konten}'
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

    let content = query[0];
    

    if (content.status == "Free") {
        if (user.api_hit < 1) {
            return({
                "status" : 400,
                "response" : {
                    "error" : "Api hit tidak mencukupi"
                }
            });
        }
        else {
            user.api_hit = user.api_hit - 1;
        }
    }
    else if (content.status == "Premium") {
        if (user.api_hit < 2) {
            return({
                "status" : 400,
                "response" : {
                    "error" : "Api hit tidak mencukupi"
                }
            });
        }
        else {
            user.api_hit = user.api_hit - 2;
        }
    }

    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        UPDATE user
        SET api_hit = ${user.api_hit}
        WHERE api_key = '${api_key}'
    `)
    conn.release();

    return({
        "status" : 200,
        "response" : {
            "success" : "Data konten berdasar id",
            "kode_konten" : content.id,
            "nama_kontent" : content.nama,
            "status" : content.status,
            "link" : content.link,
            "kategori" : content.kategori
        }
    })



}



module.exports = {
    "AddContent" : AddContent,
    "GetContent" : GetContent,
    "GetContentWithID" : GetContentWithID
};



