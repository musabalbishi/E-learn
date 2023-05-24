const jwt = require("jsonwebtoken");

const verifyStudent = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;

    next();
  } catch (error) {
    res.status(401).send("invalid token");
  }
};

module.exports = { verifyStudent };
