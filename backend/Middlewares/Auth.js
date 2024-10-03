const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403).json({ message: 'Unauthorized, JWT token is required' });
    }
    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(403).json({ message: 'Unauthorized, JWT token wrong or expired' });
    }
};

module.exports = ensureAuthenticated;
