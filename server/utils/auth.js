const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

const authMiddleware = ({ req }) => {
  // token can be sent via headers
  let token = req.headers.authorization;

  // Extract the token from the Bearer schema
  if (token) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return { user: null };
  }

  try {
    // verify token and get user data out of it
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    return { user: data };
  } catch {
    console.log('Invalid token');
    return { user: null };
  }
};

const signToken = ({ username, email, _id }) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

module.exports = {
  authMiddleware,
  signToken,
};
