/***************************
 * Templates               *
 *                         *
 * Kenny Lin               *
 * HackPrinceton Fall 2013 *
 * November 10, 2013       *
 ***************************/

/**
 * Display a personalized welcome message if the user is logged in.
 * Otherwise prompt the user to log in.
 */
Template.welcome.message = function () {
    if (Meteor.user())
        var message = 'Welcome back, ' +
            Meteor.user().profile.name + '!';
    else
        var message = 'Welcome! Please log in to show your username ' +
            'and access additional features.';
    return message;
}

/**
 * Return all messages to be displayed.
 */
Template.messages.messages = function () {
    return Messages.find({}, {sort: { time: -1 }});
}

/**
 * Handle upvotes. Can only upvote if: the user is logged in, the
 * question was not asked by the user, and the user has not already
 * upvoted the question.
 */
Template.messages.events = {
    'click .upvote' : function () {
        var message = Messages.find(this._id).fetch()[0];
        if (Meteor.user()) {
            if (message.askedBy == Meteor.userId())
                alert("You cannot upvote your own question.");
            else if (message.upvotedBy.indexOf(Meteor.userId()) != -1)
                alert("You cannot upvote a question more than once.");
            else
                Messages.update(this._id, {
                    $inc: { upvotes: 1 },
                    $push: { upvotedBy: Meteor.userId() }
                });
        }
        else
            alert("You must be logged in to use this feature.");
    }
}

/**
 * Show vote count if number of upvotes is greater than zero.
 */
Template.upvotes.upvotes = function () {
    if (Messages.find(this._id).fetch()[0].upvotes == 0)
        return;
    else return '+' + Messages.find(this._id).fetch()[0].upvotes;
}

/**
 * Insert new questions into the "Messages" collection.
 */
Template.input.events = {
    'keydown input#message, click input#submit' : function (event) {
        if (event.type == "click" || (event.type == "keydown" &&
            event.which == 13)) { // <Enter> key pressed
            if (Meteor.user())
                var name = Meteor.user().profile.name;
            else
                var name = 'Anonymous';
            var message = document.getElementById('message');

            if (message.value != '') {
                Messages.insert({
                    name: name,
                    message: message.value,
                    upvotes: 0,
                    askedBy: Meteor.userId(),
                    upvotedBy: [],
                    time: Date.now(),
                });

                document.getElementById('message').value = '';
                message.value = '';
            }
        }
    }
}
