const jwt = require('jsonwebtoken');

const generarJWT = (id, email, role) => {
  return new Promise((resolve, reject) => {
    const payload = { id, email, role };

    jwt.sign(payload, process.env.SECRET_JWT_SEED, {
      expiresIn: '7h'
    }, (err, token) => {
      if (err) {
        console.log(err);
        reject('No se pudo generar el token');
      }
      resolve(token);
    });
  });
};

module.exports = { generarJWT };