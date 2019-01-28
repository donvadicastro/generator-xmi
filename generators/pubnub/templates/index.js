import {pubnub} from 'client';

pubnub.addListener({
    message: function(m) {
        // handle message
        const channelName = m.channel; // The channel for which the message belongs
        const channelGroup = m.subscription; // The channel group or wildcard subscription match (if exists)
        const pubTT = m.timetoken; // Publish timetoken
        const msg = m.message; // The Payload
        const publisher = m.publisher; //The Publisher

        console.log('LISTEN CHANNEL: ' + channelName);
    }
});

pubnub.subscribe({
    channels: ['my_channel'],
});

pubnub.publish({
        message: {
            such: 'object'
        },
        channel: 'ch1',
        sendByPost: false, // true to send via post
        storeInHistory: false, //override default storage options
        meta: {
            "cool": "meta"
        } // publish extra meta with the request
    },
    function (status, response) {
        // handle status, response
    }
);