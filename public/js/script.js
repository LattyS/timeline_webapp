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

            // Envoi au serveur du pseudo (sous forme de texte)
            timeline.socket.emit('setPseudo', timeline.pseudo);

            // 4) Le serveur nous dit qu'un utilisateur a posté un article
            timeline.socket.on('newpost', function (post) {
                timeline.posts.push(post); // rajout du post à la liste
                $scope.$apply(); // maj de de la vue
            });
        };

        // Envoi des nouveaux messages dans le tchat
        timeline.sendPost = function () {
            if (timeline.postText.trim() === '') return; // Filtre les posts sans texte

            timeline.socket.emit('newpost', timeline.messageText);

            timeline.posts.push({
                pseudo: timeline.pseudo,
                text: timeline.postText,
                date: timeline.postDate
            });

            timeline.postText = '';
        };

        timeline.deletePost = function (item) {

            if (item.pseudo == currentUser) {
                $scope.timeline.posts.splice($scope.timeline.posts.indexOf(item), 1);
            } else {
                console.log("Vous n'êtes pas l'auteur de ce post")
            }

        };

    });