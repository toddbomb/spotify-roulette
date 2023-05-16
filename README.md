# Spotify Roulette
"like photo roulette but for spotify liked songs"

This is a proof-of-concept of a game idea that I had. I wanted to make a real-time, multiplayer web game where users would log in using Spotify, and then try to guess which one of their friends had liked a randomly chosen song.

Demo video here:

https://github.com/toddbomb/spotify-roulette/assets/41025592/cc0a9ad8-058c-4cbd-9bcf-f16737d6015a



## To run: 
This is still in development and has not yet been deployed, so getting this to run will be a bit finnicky. You will need to have two terminal windows open to run the client and server simulaneously.

### Backend:
If you are reading this and you are not from DALI lab, you will need to create a new application on the Spotify Developer website. Link here: [Spotify Developer Dashboard.](https://developer.spotify.com/dashboard)
1. Navigate to server folder and create a .env file. 
2. Write down the client ID and secret in the following format:

        CLIENT_ID = "Your ID here"
        CLIENT_SECRET = "Your secret here"
        
3. In a terminal window while the current directory is `server` run the following commands:
        
        npm install
        node app.js

### Frontend:
1. Navigate to the client folder.
2. In a terminal window while the current directory is `client` run the following commands:
        
        npm install
        npm run dev
        
The frontend and backend need to run on the same machine. To get multiple users logged in, you can click the "Login with Spotify" button multiple times, just sign in with a different account each time. 
        
     

