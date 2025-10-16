// 1) headerLogger: affiche request.headers pour chaque requête
export function headerLogger(req, res, next) {
  console.log('\n--- headerLogger: request.headers ---');
  console.log(req.headers);
  console.log('--- end headers ---\n');
  next();
}

// 2) firewall: whitelist d'URL non restreintes. Si URL restreinte,
const whitelist = [
  '/',
  '/hello',
  '/public',
  '/authenticate',
  '/register',
];

export function firewall(req, res, next) {
  const requestedPath = req.path || req.url;

  const allowed = whitelist.some((w) => {
    // exact match
    if (requestedPath === w) return true;
    // allow prefix matches for directories like /public
    if (requestedPath.startsWith(w + '/')) return true;
    return false;
  });

  if (allowed) return next();

  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (auth === undefined) {
    return res.status(403).json({ error: 'forbidden' });
  }
  if (String(auth) !== '42') {
    return res.status(403).json({ error: 'forbidden' });
  }

  next();
}
