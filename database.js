const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'T6_6715'
});

const getConn = () => {
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) reject(err);
                else resolve(conn)
            });
        });
    } catch (error) {
        console.log(error);
    }
};

const executeQuery = (conn, query) => {
    try {
        return new Promise((resolve, reject) => {
            conn.query(query, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    } catch (error) {
        console.log(error);
    }
};


const executeQueryWithParams = (conn, query, params) => {
    try {
        return new Promise(function (resolve, reject) {
            conn.query(query, params, function (err, result) {
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
};



module.exports= {
    'getConn' : getConn,
    'executeQuery' : executeQuery,
    'executeQueryWithParams' : executeQueryWithParams
};