const path = require('path');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use( '/node_modules', express.static(path.join(__dirname, 'node_modules')) );
app.use( express.static(path.join(__dirname, 'public')) );

let usersList = [];
let postsList = [];

// Un nouvel utilisateur vient de se connecter
io.on('connection', socket => {

    // On initialise par défaut un utilisateur et un post vide
    const currentUser = {
        id     : null,
        pseudo : null
    };

    const newPost = {
        pseudo : null,
        text : null,
        date: null
    };

    socket.on('setPseudo', pseudo => {

        currentUser.id     = socket.id;
        currentUser.pseudo = pseudo;
        usersList.push(currentUser);
        socket.emit('usersList', usersList);

        socket.broadcast.emit('newUser', currentUser);
    });


    socket.on('newpost', (postText, postDate) => {
        newPost.pseudo = currentUser.pseudo;
        newPost.text = postText;
        newPost.date = postDate;
        postsList.push(newPost);
        socket.emit('newpost', newPost);

    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnected', currentUser);
        usersList = usersList.filter(user => user !== currentUser);
    });

});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Le serveur écoute sur le port ${port}`));
