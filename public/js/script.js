angular
    .module('timelineApp', [])
    .controller('TimelineController', function ($scope) {
        var timeline = this;

        timeline.isDisconnected = true;

        timeline.users = [];
        timeline.posts = [];

        timeline.pseudo = '';
        timeline.postText = '';
        timeline.postDate = new Date();

        // Lorsque l'utilisateur se connecte
        timeline.loginUser = function () {

            timeline.isDisconnected = false;

            // Création et stockage du socket dans 'this', ce qui permet de l'utiliser dans la vue HTML
            timeline.socket = io('ws://localhost:3000');

            // Envoi au serveur
            timeline.socket.emit('setPseudo', timeline.pseudo);

            // 4) Le serveur nous dit qu'un utilisateur a posté un article
            timeline.socket.on('newpost', function (post) {
                timeline.posts.push(post); // rajout du post à la liste
                $scope.$apply(); // maj de de la vue
            });
        };

        // Envoi des posts
        timeline.sendPost = function () {
            if (timeline.postText.trim() === '') return; // Filtre les posts sans texte

            var postContent = {
                pseudo: timeline.pseudo,
                text: timeline.postText,
                date: timeline.postDate
            };

            timeline.socket.emit('newpost', postContent);
            timeline.posts.push(postContent);
            timeline.postText = '';
        };

        //Suppression d'un post
        timeline.deletePost = function (item) {
            timeline.posts.splice(timeline.posts.indexOf(item), 1);
        }

    });