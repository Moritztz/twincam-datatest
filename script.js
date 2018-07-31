let peer = null;
let existingConn = null;
//let conn = null;
//let connectedPeers = null;

function GetPeerId(id) {
    //ボタンをすべて消す　PeerIDがサーバーに残ってしまい初期化ができない
    $('#peerid-ui').hide();

    peer = new Peer(id, {
        // Set API key for cloud server (you don't need this if you're running your
        // own.
        key: '9373b614-604f-4fd5-b96a-919b20a7c24e',
        // Set highest debug level (log everything!).
        debug: 3,
    });

    // Show this peer's ID.
    peer.on('open', id => {
        $('#my-id').text(id);
    });

    //着信処理
    peer.on('connection', Connect);

    //エラー
    peer.on('error', err => {
        alert(err);
        setupMakeConnUI();
    });

}

//ID選択
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

// Connect to a peer
$('#connect').on('submit', e => {
    e.preventDefault();
    //接続
    const conn = peer.connect($('their-id').val());
    Connect(conn);
});

//切断
$('#close').on('click', () => {
    existingConn.close();
});

//送信
$('#send').on('submit', e => {
    e.preventDefault();

    DataSend($('#message').val());

    //テキストボックスをクリア
    $('#message').val('');
    //テキストボックスを選択
    $('#message').focus();
});

//Unityからのデータ送信
function DataSend(msg) {
    existingConn.send(msg);
    $("#resultSend").text(msg);
}

//接続イベントの管理
function Connect(conn) {
    if (existingConn) {
        existingConn.close();
    }
    setupEndConnUI();

    //接続相手を保持
    existingConn = conn;

    //接続が完了した場合のイベント
    conn.on('open', () => {
        $('#connected-id').val(conn.id);
    });

    //受信
    conn.on('data', DataRecieve);

    //相手が切断したとき
    conn.on('close', () => {
        $('#resuluRecieve').text(conn.id + 'has left the chat');
        setupMakeConnUI();
    });
}

//dataを受け取った場合の処理
function DataRecieve(data) {
    $('#resultRecieve').text(data);
}

//UI操作
function setupMakeConnUI() {
    $('#connect').show();
    $('#connected-ui').hide();
}

function setupEndConnUI() {
    $('#connect').hide();
    $('#connected-ui').show();

    $('#resuluRecieve').text('...');
}