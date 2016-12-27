import { Template } from "meteor/templating";
import { Random } from "meteor/random";
import { FlowRouter } from "meteor/kadira:flow-router";
import { own_player } from "/imports/components/own_player/own_player";
import { Rooms } from "/imports/model/rooms";

import "./room_page.html";

FlowRouter.route("/rooms/:id", {
    action: function(params) {
        BlazeLayout.render('main_layout', {
            contentTemplate: 'room_page',
            contentData: {
                roomId: params.id
            } 
        });
    }
});

Template.room_page.onCreated(function() {
    var roomId = this.data.roomId;
    var self = this;
    this.participantId = Random.id();
    this.stream = new ReactiveVar();
    this.subscribe('room',roomId);
    var participant = {
        id: this.participantId,
        name: 'Goofy', //TODO: should use something else
        iceCandidates: []
    };
    this.peerConnection = new webkitRTCPeerConnection(
        {
            "iceServers": [
                {
                    "url":"stun:stun.l.google.com:19302"
                }
            ]
        });
    window.pc = this.peerConnection;
    this.peerConnection.onicecandidate = function(e) {
        if (e.candidate == null) {
            // If onicecandidate returns a null candidate, the ICE gathering has terminated
            // see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidate#Value
            Meteor.call('rooms.addParticipant',roomId, participant);
        } else {
            participant.iceCandidates.push(JSON.stringify(e.candidate));
        }
    };
    this.autorun(function() {
        var stream = self.stream.get();
        console.log(stream);
        if (stream) {
            window.stream = stream;
            self.peerConnection.addStream(stream); 
            self.peerConnection.createOffer(function(offer) {
                console.log(offer);
                self.peerConnection.setLocalDescription(
                    offer,
                    function() {console.log("setLocalDescSuccess")},
                    function(err) {console.error(err)}
                );
            },function(){});
        }
    });
});

Template.room_page.onRendered(function() {
});

Template.room_page.onDestroyed(function() {
    Meteor.call('rooms.removeParticipant', roomId, participantId);
});

Template.room_page.helpers({
    localPlayerData: function() {
        var template = Template.instance();
        return {
            streamCallback: function(stream) {
                template.stream.set(stream);
            }
        }
    },
    getParticipants: function() {
        var template = Template.instance();
        var otherParts = [];
        var room = Rooms.findOne({_id: this.roomId});
        if (room && room.participants) {
            Object.keys(room.participants).forEach(function (id) {
                var part = room.participants[id];
                if (part.id != template.participantId) {
                    otherParts.push(part);
                }
                var msg = JSON.parse(part.candidates[0]);
                var desc = new RTCSessionDescription(msg.sdp);
                template.peerConnection.setRemoteDescription(desc)d$.then();
            });
        }
        return otherParts;
    }
});

Template.room_page.events({
});

