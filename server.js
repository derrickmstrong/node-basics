// Bring in required node packages
const express = require('express'),
  app = express(),
  port = process.env.PORT || 8000;

// Middlewares - Note: Keep Middleware above your routes
// Express json
app.use(express.json());
// Simple Auth middleware to validate user logged in or out (use with private route)
let isAuth = (req, res, next) => {
  if (!user.loggedIn)
    res.status(400).json({
      success: false,
      message: 'This route require login',
    });
  next();
};

// Fake user in database
let user = {
  name: 'Derrick Strong',
  username: 'ds@test.com',
  age: 41,
  about: 'Dopeness',
  password: '1234567',
  loggedIn: false,
};

// Routes for the user
/*
 *  Desc: Home/Index
 *  Method: GET
 *  Route: /
 *  Access: public
 */
app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

/*
 *  Desc: User Dashboard
 *  Method: GET
 *  Route: /dashboard
 *  Access: private
 */
app.get('/dashboard', isAuth, (req, res) => {
  res.status(200).send('Welcome to the Dashboard');
});

/*
 *  Desc: Login
 *  Method: POST
 *  Route: /login
 *  Access: public
 */
app.post('/login', (req, res) => {
  // Receive incoming body request
  // Destructor the incoming request body
  let { username, password } = req.body;

  // Check for the username and password in the (fake) database
  // Check for username in DB
  if (username !== user.username) {
    return res.status(400).json({
      success: false,
      message: 'No user with that username exists',
    });
  }
  // Check for password in DB
  if (password !== user.password) {
    return res.status(400).json({
      success: false,
      message: 'No user with that password exists',
    });
  }

  // Set user as logged in
  // If username and password is valid
  user.loggedIn = true;
  res.status(200).json({
    success: true,
    data: user,
  });
});

/*
 *  Desc: Logout
 *  Method: GET
 *  Route: /logout
 *  Access: private
 */
app.get('/logout', isAuth, (req, res) => {
  user.loggedIn = false;
  res.status(200).json({
    success: true,
    message: 'User is logged out',
  });
});

// Create server and listen to the port
app.listen(port, (err) => {
  err
    ? console.log(`Something went wrong. ${err}`)
    : console.log(`Server started on http://localhost:${port}`);
});
