import { Template } from "meteor/templating";

import "./own_player.html";
import "./own_player.scss";

Template.own_player.onCreated(function() {
    console.log(this.data);
});

Template.own_player.onRendered(function() {
    var self=this;
    navigator.getUserMedia({ "audio": true, "video": true },
        function(stream) {
            console.log(self);
            var videoElement= self.find('video');
            videoElement.src = window.URL.createObjectURL(stream);
            if (self.data.streamCallback) {
                self.data.streamCallback(stream);
            }
        },
    function(err) {
    }
    );
});

Template.own_player.helpers({
});

Template.own_player.events({
});

