const express = require('express');
const app = express();
const session = require('express-session');
const fs = require('fs');


app.use(session(
    {
        secret: 'secret code',
        resave: false,
        saveUnitialized: false,
        cookie: {
            secure: false,   // login 처리시 false
            maxAge: 1000 * 60 * 60 // cookie 유효시간 
    
        }
    }
));

const server = app.listen(3000, ()=> { 
    console.log('Server started. port 3000.');
});

let sql = require('./sql.js');

// 서버 재시작 없이 반영하고 서버에 적용됨 
fs.watchFile(__dirname + '/sql.js', (curr, prev) => {
    console.log('sql 변경시 재시작없이 반영되도록 함.');
    delete require.cache[require.resolve('./sql.js')];
    sql = require('./sql.js');
});

const db = {
    database: "dev",
    connectionLimit: 10,
    host: "172.30.1.30",
    user: "root",
    password: "mariadb"
};

const dbPool = require('mysql').createPool(db);

app.post('/api/login', async (request, res) => {
    request.session['email'] = 'sangjinlucky@gmail.com'; // 향후 카카오톡 인증
    res.send('Ok');
});

app.post('/api/logout', async (request, res) => {
    request.session.destroy();
    res.send('Ok');
});

// 로그인을 해야 하는 호출 서비스
app.post('/apirole/:alias', async (request, res) => {
    if(!request.session.email) {
        return res.status(401).send({
            error:'You need to login.'
        });
    }

    try {
        res.send(await req.db(request.params.alias))
    } catch (err) {
        res.status(500).send({
            error: err
        });
    }
});

//  실행할 functions
const req = {
    async db(alias, param = [], where = '' ) {
        return new Promise((resolve, reject) => dbPool.query(sql[alias].query + where , param, (error, rows) => {
            if (error) {
                if (error.code != 'ER_DUP_ENTRY')
                    console.log(error);
                resolve({
                    error
                });
            } else resolve(rows);
        }));
    }    
};

// 로그인이 필요 없는 일반 조회서비스
app.post('/api/:alias', async (request, res) => {
    try {
        res.send(await req.db(request.params.alias))
    } catch (err) {
        res.status(500).send({
            error: err
        });
    }
});