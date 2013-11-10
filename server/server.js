// Can call Meteor.call('removeAllMessages') from console
Meteor.startup(function() {
    return Meteor.methods({
        removeAllMessages: function() {
            return Messages.remove({});
        }
    });
});
