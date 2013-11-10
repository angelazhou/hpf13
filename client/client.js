/**
 * Templates
 */

Template.welcome.message = function () {
    if (Meteor.user())
        var message = 'Welcome back, ' + Meteor.user().profile.name
            + '!';
    else
        var message = 'Welcome! Please login to show your username.';
    return message;
}

Template.messages.messages = function () {
    return Messages.find({}, { sort: {time: -1 }});
}

Template.messages.events = {
    'click .upvote' : function () {
        Messages.update(this._id, {$inc: {votes: 1}});
    }
}

Template.input.events = {
    'keydown input#message' : function (event) {
        if (event.which == 13) { // <Enter> key pressed
            if (Meteor.user())
                var name = Meteor.user().profile.name;
            else
                var name = 'Anonymous';
            var message = document.getElementById('message');

            if (message.value != '') {
                Messages.insert({
                    name: name,
                    message: message.value,
                    votes: 1,
                    time: Date.now(),
                });

                document.getElementById('message').value = '';
                message.value = '';
            }
        }
    }
}
