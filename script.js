/* eslint-disable require-jsdoc */
//$(function() {
// Connect to SkyWay, have server assign an ID instead of providing one
// Showing off some of the configs available with SkyWay:).
let peer = null;
let connectedPeers = null;

function getpeerid(id) {
    //ボタンをすべて消す　PeerIDがサーバーに残ってしまい初期化ができない
    $('#peerid-ui').hide();

    peer = new Peer(id, {
        // Set API key for cloud server (you don't need this if you're running your
        // own.
        key: '9373b614-604f-4fd5-b96a-919b20a7c24e',
        // Set highest debug level (log everything!).
        debug: 3,
        // Set a logging function:
        //logFunction: args => {
        //    const copy = [...args].join(' ');
        //    $('.log').append(copy + '<br>');
        //},
    });
    connectedPeers = {};

    // Show this peer's ID.
    peer.on('open', id => {
        $('#my-id').text(id);
    });
    // Await connections from others
    peer.on('connection', c => {
        // Show connection when it is completely ready
        c.on('open', () => connect(c));
    });
    peer.on('error', err => {
        alert(err);
        //$('#peerid-ui').show();
        setupMakeCallUI()
    });

    //$('#callto-id').focus();
}


$('#twincam').on('click', () => {
    getpeerid("twincam");
    $('#their-id').val("user");
});

$('#user').on('click', () => {
    getpeerid("user");
    $('#their-id').val("twincam");
});

$('#sender').on('click', () => {
    getpeerid("sender");
    $('#their-id').val("reciever");
});

$('#reciever').on('click', () => {
    getpeerid("reciever");
    $('#their-id').val("sender");
});
//// Prepare file drop box.
//const box = $('#box');
//box.on('dragenter', doNothing);
//box.on('dragover', doNothing);
//box.on('drop', e => {
//  e.originalEvent.preventDefault();
//  const [file] = e.originalEvent.dataTransfer.files;
//  eachActiveConnection((c, $c) => {
//    if (c.label === 'file') {
//      c.send(file);
//      $c.find('.messages').append('<div><span class="file">You sent a file.</span></div>');
//    }
//  });
//});
//function doNothing(e) {
//  e.preventDefault();
//  e.stopPropagation();
//}


// Connect to a peer
$('#connect').on('submit', e => {
    e.preventDefault();
    const requestedPeer = $('#their-id').val();
    if (!connectedPeers[requestedPeer]) {
        // Create 2 connections, one labelled chat and another labelled file.
        //const c = peer.connect(requestedPeer, {
        //    label: 'chat',
        //    metadata: { message: 'hi i want to chat with you!' },
        //});
        const c = peer.connect(requestedPeer);

        c.on('open', () => {
            connect(c);
            connectedPeers[requestedPeer] = 1;
        });

        c.on('error', err => console.log(err));

        //const f = peer.connect(requestedPeer, {label: 'file', reliable: true});

        //f.on('open', () => {
        //  connect(f);
        //});

        //f.on('error', err => console.log(err));
    }
});

// Close a connection.
$('#disconnect').on('click', () => {
    eachActiveConnection(c => {
        c.close();
    });
});


//送るところ///////////////////////////////////////////////////////////////////
// Send a chat message to all active connections.
$('#send').on('submit', e => {
    e.preventDefault();
    // For each active connection, send the message.
    const msg = $('#text').val();
    eachActiveConnection((c, $c) => {
        //if (c.label === 'chat') {
            c.send(msg);
            //$c.find('.messages').append('<div><span class="you">You: </span>' + msg
            //  + '</div>');
            $("#resultSend").text(msg);
        //}
    });
    $('#text').val('');
    $('#text').focus();
});

function unityDataSend(unityData) {

    //e.preventDefault();//絶対入れるな！！
    // For each active connection, send the message.

    //var result0, result1, result2, result3;
    //result0 = data0;
    //var NEWmsg0 = ('' + result0);//順序!!!!!!??????が重要。stringに変換。HMDkakudo
    //result1 = data1;
    //var NEWmsg1 = ('' + result1);//Joystick x
    //result2 = data2;
    //var NEWmsg2 = ('' + result2);//Joystick y
    //result3 = data3;
    //var NEWmsg3 = ('' + result3);//Quaternion x

    //var NEWmsg = [NEWmsg0, NEWmsg1, NEWmsg2, NEWmsg3];

    //var NEWmsg = ('INFO from Unity is :' + result);
    eachActiveConnection(function (c, $c) {
        //if (c.label === 'chat') {
            c.send(unityData);
            $("#resultSend").text(unityData);
            //$c.find('.messages').append('<div><span class="you">You: </span>' + NEWmsg
            //+ '</div>');
        //}
    });
    //$('#text').val('');
    //$('#text').focus();
    //$("#resultDiv").text('INFO from Unity is :' + result0 + ',' + result1 + ',' + result2 + ',' + result3);

    //return NEWmsg;
    //$("#resultDiv").text('INFO from Unity is :' + result1 + result2 + result3 + result4);
}

/////////////////////////////////////////////////////////////////////


//// Show browser version
//$('#browsers').text(navigator.userAgent);


// Make sure things clean up properly.
window.onunload = window.onbeforeunload = function (e) {
    if (!!peer && !peer.destroyed) {
        peer.destroy();
    }
};

// Handle a connection object.
function connect(c) {
    setupEndCallUI(c);
    // Handle a chat connection.
    ////if (c.label === 'chat') {
    //    const chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.remoteId);
    //    const header = $('<h1></h1>').html('Chat with <strong>' + c.remoteId + '</strong>');
    //    const messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
    //    chatbox.append(header);
    //    chatbox.append(messages);
    //    // Select connection handler.
    //    chatbox.on('click', () => {
    //        chatbox.toggleClass('active');
    //    });

    //    $('.filler').hide();
    //    $('#connections').append(chatbox);

        //c.on('data', data => {
        //    unityDataRecieve(data);


        //    //受け取るところ！



        //    //messages.append('<div><span class="peer">' + c.remoteId + '</span>: ' + data +
        //    //  '</div>');
        //});

    c.on('data', function (data) {
        $("#resultRecieve").text(data);
    });

    c.on('close', () => {
        $("#resultRecieve").text(c.remoteId + ' has left the chat.');
            //console.log(c.remoteId + ' has left the chat.');
            //chatbox.remove();
            //if ($('.connection').length === 0) {
            //    $('.filler').show();
            //}
        setupMakeCallUI();
        delete connectedPeers[c.remoteId];
    });
        //} else if (c.label === 'file') {
        //  c.on('data', function(data) {
        //    // If we're getting a file, create a URL for it.
        //    let dataBlob;
        //    if (data.constructor === ArrayBuffer) {
        //      dataBlob = new Blob([new Uint8Array(data)]);
        //    } else {
        //      dataBlob = data;
        //    }
        //    const filename = dataBlob.name || 'file';
        //    const url = URL.createObjectURL(dataBlob);
        //    $('#' + c.remoteId).find('.messages').append('<div><span class="file">' +
        //      c.remoteId + ' has sent you a <a target="_blank" href="' + url + '" download="' + filename + '">file</a>.</span></div>');
        //  });
    //}
    connectedPeers[c.remoteId] = 1;
}

//function unityDataRecieve(data) {
//    //String;
//    //var recieveData = resultR;
//    //return recieveData;
//    //return recieveData;
//    $("#resultRecieve").text(data);
//}

// Goes through each active peer and calls FN on its connections.
function eachActiveConnection(fn) {
    const actives = $('.active');
    const checkedIds = {};
    actives.each((_, el) => {
        const peerId = $(el).attr('id');
        if (!checkedIds[peerId]) {
            const conns = peer.connections[peerId];
            for (let i = 0, ii = conns.length; i < ii; i += 1) {
                const conn = conns[i];
                fn(conn, $(el));
            }
        }
        checkedIds[peerId] = 1;
    });
}

function setupMakeCallUI() {
    $('#connect').show();
    $('#disconnect-ui').hide();
}

function setupEndCallUI(c) {
    $('#connect').hide();
    $('#disconnect-ui').show();
    $('#their-id').text(c.remoteId);
}

//});

