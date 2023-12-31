const MyDb = require('../connect/connect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenVerify = require('../helper/tokenVerify');
const { userColumns } = require('../helper/selectedColumns');
const { upload } = require('../helper/multerStorage');
const router = require('express').Router()
const webp = require('webp-converter')
const sharp = require('sharp')
// Get All Data 
const jwtSecret = process.env.JWT_SECRET;

router.get('/', (req, res) => {

    const sql = `SELECT ${userColumns.join(', ')} FROM users`;
    MyDb.query(sql, (err, results) => {
        if (err) res.send({ error: err })
        res.json(results);
    });
});

// Get Single Data
router.get('/:email', (req, res) => {
    const email = req.params.email;


    const sql = `SELECT ${userColumns.join(', ')} FROM users WHERE email = ?`;
    MyDb.query(sql, [email], (err, result) => {
        if (err) res.send({ error: err });
        if (result.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(result[0]);
        }
    });
});



router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Retrieve user from the database
        const query = 'SELECT * FROM users WHERE email = ?';
        MyDb.query(query, [email], async (err, results) => {
            if (err) {
                console.error('MySQL error:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            // Check if the user exists
            if (results.length === 0) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }

            const user = results[0];

            // Compare the provided password with the hashed password from the database
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {



                const sqlQ = `SELECT ${userColumns.join(', ')} FROM users WHERE email = ?`;

                MyDb.query(sqlQ, [email], (err, result) => {
                    if (err) res.send({ error: err });
                    if (result.length === 0) {
                        res.status(404).json({ error: 'User not found' });
                    } else {
                        const user = result[0]
                        const accessToken = jwt.sign({ user: user }, jwtSecret);

                        // Generate refresh token (store it in the database for later verification)
                        const refreshToken = jwt.sign({ user: user }, jwtSecret);
                        const token = {
                            accessToken,
                            refreshToken
                        }
                        // console.log(token)
                        res.status(200).json(token);
                    }
                });

            } else {
                res.status(401).json({ error: 'Password Not Match' });
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//get Refresh Token

router.post('/refresh', async (req, res) => {
    const refreshToken = req.headers.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({ error: 'Invalid refresh token' });
    }
    const decoded = jwt.verify(refreshToken, jwtSecret);
    if (decoded.email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        MyDb.query(sql, [decoded.email], (err, result) => {
            if (err) res.send({ error: err });
            if (result.length === 0) {
                res.status(403).json({ error: 'Forbidden Access' });
            } else {
                // const token = createToken(decoded.email)
                res.send("token")
            }
        });
    }
})


// post a Data 
router.post('/new', async (req, res) => {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)';
    const sqlU = 'SELECT * FROM users WHERE email = ?';
    MyDb.query(sqlU
        , [email], (err, results) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error', MySQL: err });
            } else if (results.length > 0) {
                res.status(400).json({ error: 'Email already exists' });
            } else {
                // Insert the new user into the database
                MyDb.query(sql, [email, hashedPassword, name], (err, result) => {
                    if (err) {
                        res.send({ error: err })
                    }
                    else {

                        const sqlQ = `SELECT ${userColumns.join(', ')} FROM users WHERE email = ?`;

                        MyDb.query(sqlQ, [email], (err, result) => {
                            if (err) res.send({ error: err });
                            if (result.length === 0) {
                                res.status(404).json({ error: 'User not found' });
                            } else {
                                const user = result[0]
                                const accessToken = jwt.sign({ user: user }, jwtSecret, { expiresIn: '1d' });

                                // Generate refresh token (store it in the database for later verification)
                                const refreshToken = jwt.sign({ user: user }, jwtSecret);
                                const token = {
                                    accessToken,
                                    refreshToken
                                }
                                // console.log(token)
                                res.status(200).json(token);
                            }
                        });
                    }

                });

            }
        });

})


//Update Udata
router.put('/update-one', tokenVerify, async (req, res) => {
    const { data, feild_name, email } = req.body
    const query = `UPDATE users SET ?? = ? WHERE email = ?`;
    MyDb.query(query, [feild_name, data, email], (err, result) => {
        if (err) {
            res.send({ error: err })
        }
        else {
            res.send(result)
        }
    })

})

router.put('/update-img', tokenVerify, upload.single('image'), async (req, res) => {

    const { email, feild_name } = req.headers
    // Convert the uploaded image to WebP format
    const webpBuffer = await sharp(req.file.buffer).webp().toBuffer();

    // Save the WebP image to disk
    const webpImagePath = `uploads/${email}.webp`;
    await sharp(webpBuffer).toFile(webpImagePath);
    const image = `${req.protocol}://${req.get('host')}/images/${email}.webp`;

    const query = `UPDATE users SET ${feild_name} = ? WHERE email = ?`;
    MyDb.query(query, [image, email], (err, result) => {
        if (err) {
            res.status(500).send({ error: err })
        }
        else {
            res.send({ message: "Your image has been updated", photo: image })
        }
    })
})


module.exports = router