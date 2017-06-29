const path = require('path');
const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use( '/node_modules', express.static(path.join(__dirname, 'node_modules')) );
app.use( express.static(path.join(__dirname, 'public')) );


// Un nouvel utilisateur (représenté ici par la variable 'socket') vient de se connecter
io.on('connection', socket => {

    // On initialise par défaut un utilisateur vide
    const currentUser = {
        id     : null,
        pseudo : null
    };

    socket.on('setPseudo', pseudo => {

        currentUser.id     = socket.id;
        currentUser.pseudo = pseudo;

        socket.broadcast.emit('newUser', currentUser);
    });

    socket.on('newpost', (postmessage, postdate) => {
        socket.broadcast.emit('newpost', {
            pseudo : currentUser.pseudo,
            text   : postmessage,
            date : postdate
        });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('userDisconnected', currentUser);

    });

});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Le serveur écoute sur le port ${port}`));
