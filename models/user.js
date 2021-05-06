const db = require('../database');
const jwt = require('jsonwebtoken');

const secret = "TuG4sS046715";


async function RegisterUser(nama_user, email_user, tanggal_lahir, tipe_user) {
    
    let conn = await db.getConn();
    let query = await db.executeQuery(conn, `
        SELECT *
        FROM user
    `)
    conn.release();

    let users = query;
    for (const iterator of users) {
        if (email_user == iterator.email) {
            return({
                "status" : 400,
                "response" : {
                    "error" : "Email telah terdaftar"
                }
            });
        }
    }

    if (GetAge(tanggal_lahir) < 13) {
        return({
            "status" : 400,
            "response" : {
                "error" : "Umur tidak mencukupi"
            }
        });
    }


    let api_key = "";

    let duplicate = false;
    do {
        duplicate = false;

        api_key = MakeAPIKey(16);

        for (const iterator of users) {
            if (api_key == iterator.api_key) {
                duplicate = true;
            }    
        }
        
    } while (duplicate);

    let tipe = "";
    if (tipe_user == "C") {
        tipe = "Creator";
    }
    else if (tipe_user == "R") {
        tipe = "Regular";
    }
    else {
        return({
            "status" : 400,
            "response" : {
                "error" : "Tipe user tidak ada"
            }
        });
    }


    let tanggal = tanggal_lahir.split("-");

    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        INSERT INTO user
        VALUES (
            '${email_user}',
            '${nama_user}',
            '${tanggal[2]+"-"+tanggal[1]+"-"+tanggal[0]}',
            0,
            0,
            '${api_key}',
            '${tipe}'
        )
    `);

    conn.release();


    return({
        "status" : 201,
        "response" : {
            "success" : "User berhasil ditambahkan",
            "email" : email_user,
            "nama_user" : nama_user,
            "tanggal_lahir" : tanggal_lahir,
            "saldo" : 0,
            "api_hit" : 0,
            "api_key" : api_key,
            "tipe_user" : tipe_user
        }
    })


}

async function TopUp(api_key, tambahan_saldo) {

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

    if (isNaN(tambahan_saldo)) {
        return({
            "status" : 400,
            "response" : {
                "error" : "Saldo harus berupa angka"
            }
        });
    }

    if (tambahan_saldo < 0) {
        return({
            "status" : 400,
            "response" : {
                "error" : "Saldo harus lebih besar dari 0"
            }
        });
    }


    let new_saldo = parseInt(user.saldo, 10) + parseInt(tambahan_saldo, 10);


    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        UPDATE user
        SET saldo = ${new_saldo}
        WHERE api_key = '${api_key}'
    `)
    conn.release();

    return({
        "status" : 200,
        "response" : {
            "success" : "Saldo berhasil ditambahkan",
            "email" : user.email,
            "saldo_awal" : user.saldo,
            "saldo_akhir" : new_saldo
        }
    })


}

async function RechargeAPI(api_key) {


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
    let new_hit = user.api_hit + 10;
    let new_saldo = user.saldo - 10000;

    if (new_saldo < 0) {
        return({
            "status" : 400,
            "response" : {
                "error" : "Saldo tidak mencukupi"
            }
        });
    }


    conn = await db.getConn();
    query = await db.executeQuery(conn, `
        UPDATE user
        SET saldo = ${new_saldo}, api_hit = ${new_hit}
        WHERE api_key = '${api_key}'
    `)
    conn.release();

    return({
        "status" : 200,
        "response" : {
            "success" : "Penggunaan API berhasil ditambah",
            "email" : user.email,
            "api_hit_awal" : user.api_hit,
            "api_hit_akhir" : new_hit
        }
    })

}







module.exports = {
    "RegisterUser" : RegisterUser,
    "TopUp" : TopUp,
    "RechargeAPI" : RechargeAPI
};



function GetAge(date) {

    let arrDate = date.split("-");
    let formattedDate = arrDate[1] + "/" + arrDate[0] + "/" + arrDate[2];
    let diff = Date.now() - new Date(formattedDate);
    return Math.floor(diff/(365.25*24*3600*1000));

}

function MakeAPIKey(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}
