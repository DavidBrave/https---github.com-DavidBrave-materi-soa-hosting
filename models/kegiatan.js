const db = require('../database');
const jwt = require('jsonwebtoken');

const secret = "TuG4sS046715";

async function AddKegiatan(jwt_key, kode_organisasi, nama_kegiatan, ketua_kegiatan) {
    
    let user = null;
    try{

        user = jwt.verify(jwt_key, secret);

    }catch(err){

        return({
            "status" : 401,
            "error" : "Unauthorized"
        });

    }

    let conn = await db.getConn();
    let query = await db.executeQuery(conn, `
        SELECT *
        FROM user
        WHERE nrp = '${ketua_kegiatan}'
    `)
    conn.release();

    if (query.length < 1) {
        return({
            "status" : 404,
            "error" : "User tidak ditemukan",
            "nrp" : ketua_organisasi
        });
    }

    let ketua = query[0];


    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        SELECT *
        FROM organisasi
        WHERE kode = '${kode_organisasi}'
    `)
    conn.release();

    if (query.length < 1) {
        return({
            "status" : 404,
            "error" : "Organisasi tidak ditemukan",
            "kode" : kode_organisasi
        });
    }

    let organisasi = query[0];

    if (organisasi.ketua != ketua.nrp) {
        return({
            "status" : 403,
            "error" : "Bukan ketua organisasi",
            "nrp" : ketua_kegiatan,
            "kode" : kode_organisasi
        });
    }

    if (user.nrp != ketua.nrp) {
        return({
            "status" : 403,
            "error" : "Bukan ketua organisasi",
            "nrp" : ketua_kegiatan,
            "kode" : kode_organisasi
        });
    }

    let kode = "K" + kode_organisasi.substring(1, 3);


    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        SELECT *
        FROM kegiatan
    `)
    conn.release();

    

    let ctr = 0;
    let kegiatans = query;
    for (const iterator of kegiatans) {
        //console.log(singkatan_org + " == " + (iterator.kode).substring(0, 2));
        if (kode == (iterator.kode).substring(0, 3)) {
            
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

    kode = kode + padded + ctr;



    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        INSERT INTO kegiatan
        VALUES (
            '${kode}',
            '${nama_kegiatan}',
            '${ketua_kegiatan}',
            '${organisasi.kode}',
            ''
        )
    `);

    conn.release();



    return({
        "status" : 201,
        "success" : "Kegiatan berhasil ditambahkan",
        "kode_kegiatan" : kode,
        "nama_kegiatan" : nama_kegiatan,
        "ketua_kegiatan" : ketua_kegiatan,
        "kode_organisasi" : organisasi.kode
    })



}

async function AddPeserta(jwt_key, kode_kegiatan, list_peserta) {
    

    let user = null;
    try{

        user = jwt.verify(jwt_key, secret);

    }catch(err){

        return({
            "status" : 401,
            "error" : "Unauthorized"
        });

    }

    let conn = await db.getConn();
    let query = await db.executeQuery(conn, `
        SELECT *
        FROM kegiatan
        WHERE kode = '${kode_kegiatan}'
    `)
    conn.release();

    if (query.length < 1) {
        return({
            "status" : 404,
            "error" : "Kegiatan tidak ditemukan",
            "kode" : kode_kegiatan
        });
    }

    let kegiatan = query[0];
    if (kegiatan.ketua != user.nrp) {
        return({
            "status" : 401,
            "error" : "Unauthorized"
        });
    }



    let pesertas = [];

    console.log("list peserta : ");
    console.log(list_peserta);
    for (const iterator_string of list_peserta) {
        let iterator = JSON.parse(iterator_string);
        console.log("iterator : " + iterator);
        conn = await db.getConn();
        query = await db.executeQuery(conn, `
            SELECT *
            FROM user
            WHERE nrp = '${iterator.nrp}'
        `)
        conn.release();

        console.log("query : " + query);

        if (query.length > 0) {
            conn = await db.getConn();
            query = await db.executeQuery(conn, `
                INSERT INTO peserta_kegiatan
                VALUES (
                    null,
                    '${kode_kegiatan}',
                    '${iterator.nrp}',
                    '${iterator.poin}'
                )
            `);
            conn.release();

            pesertas.push(iterator);

        }
    }


    return({
        "status" : 201,
        "success" : "Peserta berhasil ditambahkan",
        "kode_kegiatan" : kode_kegiatan,
        "peserta" : pesertas
    })


}

async function UbahPoin(jwt_key, kode_kegiatan, nrp_peserta, poin_peserta) {

    let user = null;
    try{

        user = jwt.verify(jwt_key, secret);

    }catch(err){

        return({
            "status" : 401,
            "error" : "Unauthorized"
        });

    }

    let conn = await db.getConn();
    let query = await db.executeQuery(conn, `
        SELECT *
        FROM kegiatan
        WHERE kode = '${kode_kegiatan}'
    `)
    conn.release();

    if (query.length < 1) {
        return({
            "status" : 404,
            "error" : "Kegiatan tidak ditemukan",
            "kode" : kode_kegiatan
        });
    }

    let kegiatan = query[0];
    if (kegiatan.ketua != user.nrp) {
        return({
            "status" : 401,
            "error" : "Unauthorized"
        });
    }


    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        SELECT *
        FROM peserta_kegiatan
        WHERE nrp_peserta = '${nrp_peserta}'
    `)
    conn.release();

    if (query.length < 1) {
        return({
            "status" : 404,
            "error" : "Peserta tidak ditemukan",
            "kode" : nrp_peserta
        });
    }


    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        UPDATE peserta_kegiatan
        SET poin_peserta = ${poin_peserta}
        WHERE nrp_peserta = '${nrp_peserta}'
    `)
    conn.release();


    let peserta = {};
    peserta.nrp = nrp_peserta;
    peserta.poin = poin_peserta;
    return({
        "status" : 200,
        "success" : "Berhasil mengubah poin",
        "kode_kegiatan" : kode_kegiatan,
        "peserta" : peserta
    });


}

async function GetKegiatan(jwt_key, kode_kegiatan) {
    
    let user = null;
    try{

        user = jwt.verify(jwt_key, secret);

    }catch(err){

        return({
            "status" : 401,
            "error" : "Unauthorized"
        });

    }



    let conn = await db.getConn();
    let query = await db.executeQuery(conn, `
        SELECT *
        FROM kegiatan
    `)
    conn.release();

    let kegiatans = query;


    if (kode_kegiatan == null || kode_kegiatan == "") {
        
        if (user.nrp == "admin") {
            conn = await db.getConn();
            query = await db.executeQuery(conn, `
                SELECT *
                FROM peserta_kegiatan
            `)
            conn.release();

            let pesertas = query;

            let tampilan = [];
            for (const iterator of kegiatans) {
                let isi_tampilan = {};
                
                isi_tampilan.kode_kegiatan = iterator.kode;

                let peserta_kegiatan = [];
                for (const iterator2 of pesertas) {
                    if (iterator.kode == iterator2.kode_kegiatan) {
                        let isi_peserta = {};
                        isi_peserta.nrp = iterator2.nrp_peserta;
                        isi_peserta.poin = iterator2.poin_peserta;
                        peserta_kegiatan.push(isi_peserta);
                    }
                }

                isi_tampilan.peserta = peserta_kegiatan;

                tampilan.push(isi_tampilan);

            }


            return({
                "status" : 200,
                "success" : "Data kegiatan berhasil ditampilkan",
                "data" : tampilan
            });

        }
        else {
            conn = await db.getConn();
            query = await db.executeQuery(conn, `
                SELECT *
                FROM user
                WHERE nrp = '${user.nrp}'
            `)
            conn.release();

            if (query.length < 1) {
                return({
                    "status" : 404,
                    "error" : "User tidak ditemukan",
                    "nrp" : user.nrp
                });
            }



            conn = await db.getConn();
            query = await db.executeQuery(conn, `
                SELECT *
                FROM peserta_kegiatan
                WHERE nrp_peserta = '${user.nrp}'
            `)
            conn.release();

            let kegiatan_diikuti = query;


            let tampilan = [];
            for (const iterator of kegiatan_diikuti) {

                conn = await db.getConn();
                query = await db.executeQuery(conn, `
                    SELECT *
                    FROM kegiatan
                    WHERE kode = '${iterator.kode_kegiatan}'
                `)
                conn.release();

                let kegiatan = query[0];

                let isi_tampilan = {};
                isi_tampilan.kode_kegiatan = kegiatan.kode;

                let peserta = {};
                peserta.nrp = iterator.nrp_peserta;
                peserta.poin = iterator.poin_peserta;
                isi_tampilan.peserta = peserta;


                tampilan.push(isi_tampilan);
            }

            return({
                "status" : 200,
                "success" : "Data kegiatan berhasil ditampilkan",
                "data" : tampilan
            });


        }


    }
    else {
        conn = await db.getConn();
        query = await db.executeQuery(conn, `
            SELECT *
            FROM kegiatan
            WHERE kode = '${kode_kegiatan}'
        `)
        conn.release();

        if (query.length < 1) {
            return({
                "status" : 404,
                "error" : "Kegiatan tidak ditemukan",
                "kode" : kode_kegiatan
            });
        }

        let kegiatans = query;

        if (user.nrp == "admin") {
            conn = await db.getConn();
            query = await db.executeQuery(conn, `
                SELECT *
                FROM peserta_kegiatan
            `)
            conn.release();

            let pesertas = query;

            let tampilan = [];
            for (const iterator of kegiatans) {
                let isi_tampilan = {};
                
                isi_tampilan.kode_kegiatan = iterator.kode;

                let peserta_kegiatan = [];
                for (const iterator2 of pesertas) {
                    if (iterator.kode == iterator2.kode_kegiatan) {
                        let isi_peserta = {};
                        isi_peserta.nrp = iterator2.nrp_peserta;
                        isi_peserta.poin = iterator2.poin_peserta;
                        peserta_kegiatan.push(isi_peserta);
                    }
                }

                isi_tampilan.peserta = peserta_kegiatan;

                tampilan.push(isi_tampilan);

            }


            return({
                "status" : 200,
                "success" : "Data kegiatan berhasil ditampilkan",
                "data" : tampilan
            });

        }
        else {

            conn = await db.getConn();
            query = await db.executeQuery(conn, `
                SELECT *
                FROM user
                WHERE nrp = '${user.nrp}'
            `)
            conn.release();

            if (query.length < 1) {
                return({
                    "status" : 404,
                    "error" : "User tidak ditemukan",
                    "nrp" : user.nrp
                });
            }



            conn = await db.getConn();
            query = await db.executeQuery(conn, `
                SELECT *
                FROM peserta_kegiatan
                WHERE nrp_peserta = '${user.nrp}'
                AND kode_kegiatan = '${kode_kegiatan}'
            `)
            conn.release();

            let kegiatan_diikuti = query;


            let tampilan = [];
            for (const iterator of kegiatan_diikuti) {

                conn = await db.getConn();
                query = await db.executeQuery(conn, `
                    SELECT *
                    FROM kegiatan
                    WHERE kode = '${iterator.kode_kegiatan}'
                `)
                conn.release();

                let kegiatan = query[0];

                let isi_tampilan = {};
                isi_tampilan.kode_kegiatan = kegiatan.kode;

                let peserta = {};
                peserta.nrp = iterator.nrp_peserta;
                peserta.poin = iterator.poin_peserta;
                isi_tampilan.peserta = peserta;


                tampilan.push(isi_tampilan);
            }

            return({
                "status" : 200,
                "success" : "Data kegiatan berhasil ditampilkan",
                "data" : tampilan
            });




        }



    }

    



    


    return({
        "status" : 200,
        "success" : "Data kegiatan berhasil ditampilkan"
    });


}


module.exports = {
    "AddKegiatan" : AddKegiatan,
    "AddPeserta" : AddPeserta,
    "UbahPoin" : UbahPoin,
    "GetKegiatan" : GetKegiatan
};