'use strict'

const express = require('express');
const session = require('express-session');
const app = express();
const cors = require('cors');

const http = require('http');
const httpServer = http.createServer(app);
const { Server } = require('socket.io')

const axios = require('axios');

const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

require('dotenv').config();

const port = 8888;
const authCallbackPath = '/callback';

app.use(cors({ 
  origin: 'http://localhost:5173' 
  }
));

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173'
  }
});

let users = [];

// Passport session setup
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new SpotifyStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:' + port + authCallbackPath,
}, 
(accessToken, refreshToken, expires_in, profile, done) => {
    users.push({
      username: profile.username,
      accessToken: accessToken,
      refreshToken: refreshToken,
      email: profile.emails[0].value,
    });

    io.emit('usersUpdated', users);

    process.nextTick(function () {
      return done(null, profile);
    });
}));

app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.redirect('http://localhost:5173');
});

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);
  socket.isAuthenticated = false;

  // Send the current users array to the newly connected client
  socket.emit('usersUpdated', users);

  // Update the users array on the backend and notify all clients
  socket.on('updateUsers', (updatedUsers) => {
    users = updatedUsers;
    io.emit('usersUpdated', users);
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });
});


app.get('/login', passport.authenticate('spotify', {
  scope: ['user-read-email', 'user-read-private', 'user-library-read'],
  showDialog: true
}));

let likedSongs = [];

app.get('/callback', passport.authenticate('spotify', {failureRedirect: '/'}), async (req, res) => {
  const songPromises = await Promise.all(users.map(user => fetchLikedSongs(user.accessToken, user.username)));
  likedSongs = songPromises.flat();
  res.redirect('/');
});

app.get('/get-random', (req, res) => {
  if (likedSongs.length > 0) {
    res.json(getRandomSong(likedSongs));
  }
})

app.get('/users', (req, res) => {
  res.json(users);
})

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const getRandomSong = (likedSongs) => {
  // list of all keys (track URLS)
  
  // get random key
  const randomKey = Math.floor(Math.random() * likedSongs.length);
  // return object of 1 song
  return likedSongs[randomKey]
};

const fetchLikedSongs = async (access_token, user_id) => {
  const api_url = 'https://api.spotify.com/v1/me/tracks?market=US&limit=50&offset=0'
  try {
    const response = await axios.get(api_url, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    var songList = [];

    for (var index = 0; index < response.data.items.length; index++) {
      songList.push({
        id: response.data.items[index].track.id,
        user: user_id
      });
    }

    return songList;

  } catch(error) {
    console.log(error);
  };
};