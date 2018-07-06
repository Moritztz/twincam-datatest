// JavaScript source code
// Compatibility shim
    //navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    //// PeerJS object
    //var peer = new Peer({ key: 'ad925a32-dc13-4494-a699-f439f7329d00', debug: 3});
	
// SendFunction via Skyway
function Unitykiteru(data0, data1, data2, data3) {
	    
	        //e.preventDefault();//絶対入れるな！！
	        // For each active connection, send the message.
	        
	        var result0, result1, result2, result3;
	        result0 = data0;
	        var NEWmsg0 = ('' + result0);//順序!!!!!!??????が重要。stringに変換。HMDkakudo
	        result1 = data1;
	        var NEWmsg1 = ('' + result1);//Joystick x
	        result2 = data2;
	        var NEWmsg2 = ('' + result2);//Joystick y
	        result3 = data3;
	        var NEWmsg3 = ('' + result3);//Quaternion x
	        
	        var NEWmsg = [NEWmsg0, NEWmsg1, NEWmsg2, NEWmsg3];
	        
	        //var NEWmsg = ('INFO from Unity is :' + result);

	        eachActiveConnection(function (c, $c) {
	            if (c.label === 'chat') {
	                c.send(NEWmsg);
	                //$c.find('.messages').append('<div><span class="you">You: </span>' + NEWmsg
                    //+ '</div>');
	                
	            }
	        });
	        //$('#text').val('');
	        //$('#text').focus();
	        $("#resultDiv").text('INFO from Unity is :' + result0 + ',' + result1 + ',' + result2 + ',' + result3);

	        return NEWmsg;
	        //$("#resultDiv").text('INFO from Unity is :' + result1 + result2 + result3 + result4);

	    
}


function eachActiveConnection(fn) {
    var actives = $('.active');
    var checkedIds = {};
    actives.each(function () {
        var peerId = $(this).attr('id');

        if (!checkedIds[peerId]) {
            var conns = peer.connections[peerId];
            for (var i = 0, ii = conns.length; i < ii; i += 1) {
                var conn = conns[i];
                fn(conn, $(this));
            }
        }

        checkedIds[peerId] = 1;
    });
}

    
