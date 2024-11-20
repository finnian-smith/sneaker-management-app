export const isAuthenticated = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    return res.status(401).json({ message: "Session expired" });
  }
};
