const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const fullToken = req.headers.authorization;
  if (!fullToken) return res.status(401).json("UnAuthorized Access");

  const token = fullToken.split(" ")[1];
  jwt.verify(token, process.env.SPECIAL_KEY, (err, user) => {
    if (err) return res.status(403).json("Forbidden Access");

    req.user = user;
    next();
  });
};

const verifyRole = async (req, res, next) => {
  console.log(req.user);
  console.log("ROLE:", req.user.role);
  
  if (!req.user) return res.status(401).json("User needs to be Authenticated");
  if (req.user.role !== "admin") return res.status(403).json("Forbidden Access, User must be an Admin");
  next()
}

module.exports = {verifyToken, verifyRole};