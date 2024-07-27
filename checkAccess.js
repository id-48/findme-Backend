const config = require("./config");
const jwt = require('jsonwebtoken');
const User = require('../findme-Backend/server/user/user.model');

async function verifyToken(req, res, next) {
  const token = req.headers['token'];
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

  await jwt.verify(token, config.JWT_SECRET, async function(err, decoded) {

    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    req.userId = decoded.id;

    var user = await User.findOne({ _id: req.userId });

    if (!user) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    } 
    req.user = user;
    next();
  });
}

module.exports = verifyToken;

