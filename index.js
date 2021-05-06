const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = require('./routes/user');

const routes = {
    user : require('./routes/user'),
    content : require('./routes/content'),
    organisasi : require('./routes/organisasi'),
    kegiatan : require('./routes/kegiatan')

};


const app = express();

app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs');

app.use('/api/users', routes.user);
app.use('/api/content', routes.content);

app.use('/api/organisasi', routes.organisasi);
app.use('/api/kegiatan', routes.kegiatan);

app.get('/', (req, res) => res.status(200).send('Online!'));
app.listen(3000, () => console.log('Running on port 3000'));














