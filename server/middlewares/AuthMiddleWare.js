const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.json({ message: "User not logged in!" });

  try {
    const validToken = verify(accessToken, "subscribe");
    req.user = validToken ; //it can accessible from all routes that validtoken stores what info

    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ message: err });
  }
};

module.exports = { validateToken };