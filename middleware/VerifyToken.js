import JWT from "jsonwebtoken";

function VerifyToken(req, res, next) {
  const authToken = req.headers.authorization;

  if (authToken) {
    const token = authToken.split("  ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is missing after Bearer" });
    }

    try {
      const decodedPayload = JWT.verify(token, process.env.JWT_SECRET);
      req.user = decodedPayload;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token is invalid" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "You are not logged in to access this token" });
  }
}

function VerifyTokenAdmin(req, res, next) {
  VerifyToken(req, res, () => {
    if (req.user.role === "Admin") {
      next();
    } else {
      return res.status(403).json({ message: "not allow, only Admin" });
    }
  });
}

function VerifyTokenHotelOwner(req, res, next) {
  VerifyToken(req, res, () => {
    if (req.user.role === "Hotel Owner") {
      next();
    } else {
      return res.status(403).json({ message: "not allow, Hotel Owner" });
    }
  });
}

export { VerifyToken, VerifyTokenAdmin, VerifyTokenHotelOwner };
