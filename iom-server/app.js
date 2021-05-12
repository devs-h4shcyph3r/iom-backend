const express = require('express');
const home = require('./router/home');
const owner = require('./router/owner');
const signin = require('./router/ownerLogin');



const app = express();

// Route handler middleware
app.use('/home',home);
app.use('/api/register',owner);
app.use('/login',signin);


// get port number from environment variable
const PORT = process.env.PORT || 1111

// start the server
app.listen(PORT,() => {
    console.log(`server started on http://localhost:${PORT}`);
});