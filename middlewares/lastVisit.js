export const lastVisit = (req, res, next) => {
    // Checking if 'lastVisit' cookie exists
    if (req.cookies.lastVisit) {
      res.locals.lastVisit = new Date(req.cookies.lastVisit).toLocaleString();
    }
  
    // Setting a new 'lastVisit' cookie with current timestamp and 1-day expiry
    res.cookie('lastVisit', new Date().toISOString(), {
      maxAge: 1 * 24 * 60 * 1000, // 1 day
    });
  
    next(); // Proceed to the next middleware
  };
  