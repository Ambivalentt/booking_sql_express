const db = require('./server.js');
const express = require('express');
const app = express();
const router = require('../routes/userRoutes.js')
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use('/api', router)

app.use((req, res) => {
    res.status(404).json({ message: 'Page not found' })
})



db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})                                                                            