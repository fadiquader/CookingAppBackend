import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ||'fadi_qua';

export function decodeSub(req, res, next) {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, JWT_SECRET);
    decoded.id = decoded.sub;
    delete decoded.sub;
    req.user = decoded;
    next();
  } catch (e) {
    req.user = null;
    next();
  }
}