
// Compatibility shim
//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


var myid = Math.floor(Math.random() * 100).toString;
// PeerJS object
var peer = new Peer(myid,{ key: '9373b614-604f-4fd5-b96a-919b20a7c24e', debug: 3 });
//////////??????????????????????????????????????????????????
//var onn = peer.connect;
var connectedPeers = {};
var resultRd,resultR;
//////////??????????????????????????????????????????????????

peer.on('open', function () {
    $('#my-id').text(peer.id);
});

// Receiving a call
peer.on('call', function (call) {
    // Answer the call automatically (instead of prompting user) for demo purposes
    call.answer(window.localStream);
    step3(call);
});

// !!!!!!!!!!!!!!!!Data connetion!!!!!!!!!!!!!!!!!
peer.on('connection', connect);

peer.on('error', function (err) {
    alert(err.message);
    // Return to step 2 if error occurs
    step2();
});

// Click handlers setup
$(function () {
    
    //////////////!!!!!!!!!!!!!!!!for chat!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Connect to a peer
    $('#connect').click(function () {
        var requestedPeer = $('#callto-id').val();
        if (!connectedPeers[requestedPeer]) {
            // Create 2 connections, one labelled chat and another labelled file.
            var c = peer.connect(requestedPeer, {
                label: 'chat',
                serialization: 'binary',
                metadata: { message: 'hi i want to chat with you!' }
            });
            c.on('open', function () {
                connect(c);
            });
            c.on('error', function (err) { alert(err); });
            var f = peer.connect(requestedPeer, { label: 'file', reliable: true });
            f.on('open', function () {
                connect(f);
            });
            f.on('error', function (err) { alert(err); });
        }
        connectedPeers[requestedPeer] = 1;
    });

    // Close a connection.
    $('#close').click(function () {
        //eachActiveConnection(function (c) {
        //    c.close();
        //});
    });

    // Send a chat message to all active connections.
    $('#send').submit(function (e) {
        e.preventDefault();
        // For each active connection, send the message.
        //var msg = $('#text').val();
        //var msg = ['nannjakorya', 'nannjyakoryaaa'];
        //eachActiveConnection(function (c, $c) {
        //    if (c.label === 'chat') {
        //        c.send(msg);
        //        $c.find('.messages').append('<div><span class="you">You: </span>' + msg
        //          + '</div>');
        //    }
        //});
        //$('#text').val('');
        //$('#text').focus();
    });

    // Goes through each active peer and calls FN on its connections.
    //function eachActiveConnection(fn) {
    //    var actives = $('.active');
    //    var checkedIds = {};
    //    actives.each(function () {
    //        var peerId = $(this).attr('id');

    //        if (!checkedIds[peerId]) {
    //            var conns = peer.connections[peerId];
    //            for (var i = 0, ii = conns.length; i < ii; i += 1) {
    //                var conn = conns[i];
    //                fn(conn, $(this));
    //            }
    //        }

    //        checkedIds[peerId] = 1;
    //    });
    //}

    // Show browser version
    $('#browsers').text(navigator.userAgent);
        
    ///////////////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//////////////////
      
    
    
    //$('#make-call').click(function () {
    //    // Initiate a call!
    //    var call = peer.call($('#callto-id').val(), window.localStream);

    //    step3(call);
    //});

    //$('#end-call').click(function () {
    //    window.existingCall.close();
    //    step2();
    //});

    //// Retry if getUserMedia fails
    //$('#step1-retry').click(function () {
    //    $('#step1-error').hide();
    //    step1();
    //});

    // Get things started
    step1();
});

function step1() {
    // Get audio/video stream
    navigator.getUserMedia({ audio: true, video: true }, function (stream) {
        // Set your video displays
        $('#my-video').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
        step2();
    }, function () { $('#step1-error').show(); });
}

function step2() {
    $('#step1, #step3').hide();
    $('#step2').show();
}

function step3(call) {
    // Hang up on an existing call if present
    if (window.existingCall) {
        window.existingCall.close();
    }

    // Wait for stream on the call, then set peer video display
    call.on('stream', function (stream) {
        $('#their-video').prop('src', URL.createObjectURL(stream));
    });

    // UI stuff
    window.existingCall = call;
    $('#their-id').text(call.peer);
    call.on('close', step2);
    $('#step1, #step2').hide();
    $('#step3').show();
}

//////////////////add for chat!!!!!!!!!!!!!!!!////////////////////////
function connect(c) {
    // Handle a chat connection.
    if (c.label === 'chat') {
        //ここでhtmlへ渡すチャットボックスを生成するのか
        var chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.peer);
        var header = $('<h1></h1>').html('Chat with <strong>' + c.peer + '</strong>');
        var messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
        chatbox.append(header);
        chatbox.append(messages);

        // Select connection handler.
        chatbox.on('click', function() {
            if ($(this).attr('class').indexOf('active') === -1) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
        $('.filler').hide();
        $('#connections').append(chatbox);

        c.on('data', function(data) {

            //var dataS = data;
            //messages.append('<div><span class="peer">' + c.peer + '</span>: ' + dataS + '</div>');
            //resultR = '' + dataS;

            var dataS = data.join(',');//配列データを一つの文字列に連結
            //messages.append('<div><span class="peer">' + c.peer + '</span>: ' + dataS + '</div>');
            resultR = '' + dataS;

            //resultRd = data.join(',');
            //resultR = '' + resultRd;
            //Unitykiteruyo("username","password")
            //resultR = ('INFO to Unity is :' + data);
            
        });
        c.on('close', function() {
            alert(c.peer + ' has left the chat.');
            chatbox.remove();
            if ($('.connection').length === 0) {
                $('.filler').show();
            }
            delete connectedPeers[c.peer];
        });
    }
    connectedPeers[c.peer] = 1;
}

function Unitykiteruyo() {
    //String;
    var recieveData = resultR;
    return recieveData;
    //return recieveData;
    $("#resultRcv").text('INFO to Unity is :' + recieveData);
}

//funcion SendMessage (){
    
//}

//functinon ReceiveMessage(){

//}


//////////////////////koitsumoTUIKA!!!!!!!!!!!!!!!!!!!!!!!!!!!////////////////////////////
// Make sure things clean up properly.

window.onunload = window.onbeforeunload = function (e) {
    if (!!peer && !peer.destroyed) {
        peer.destroy();
    }
};
//////////////////////////////////////////////////////////////////////////////////////////