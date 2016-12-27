import { Meteor } from "meteor/meteor";

import { Mongo } from "meteor/mongo";

export const Rooms = new Mongo.Collection('rooms');

if (Meteor.isServer) {
    Meteor.publish('rooms', function roomsPublication() {
        console.log("Subscription request")
        return Rooms.find();
    });
    Meteor.publish('room', function roomPublication(roomId) {
        console.log("Subscription request")
        return Rooms.find({_id: roomId});
    });

    Meteor.methods({
        'rooms.add': function(roomId) {
            Rooms.insert(_id: roomId);
        },
        'rooms.delete': function(roomId) {
        },
        'rooms.addParticipant': function(roomId, participant) {
            var room = Rooms.findOne({_id: roomId});
            if (room) {
                if (!room.participants) {
                    room.participants = {};
                }
                room.participants[participant.id] = participant;
                Rooms.update({_id: roomId}, room);
            }
        },
        'rooms.removeParticipant': function(roomId, participantId) {
            var room = Rooms.findOne({_id: roomId});
            if (room && room.paritipants) {
                delete room.participants[participantId];
            }
            Rooms.update({_id: roomId}, room);
        }
    });
}

function monitorRoom(room) {
    var roomTimeout = setTimeout(function() {
    }, 3000);
}
