export const requireLogin = (req, res, next) => {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'You need to be logged in' });
  }
  req.user = req.session.user;
  next();
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (req.session.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
