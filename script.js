let peer = null;
let existingConn = null;

//初期化(cssでもできるはず)
setupMakeConnUI();

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
        $('#resultRecieve').text(err);
        setupMakeConnUI();
    });

}

//ID選択
$('#twincam').on('click', () => {
    GetPeerId("twincam");
    $('#their-id').val("user");
});

$('#user').on('click', () => {
    GetPeerId("user");
    $('#their-id').val("twincam");
});

$('#sender').on('click', () => {
    GetPeerId("sender");
    $('#their-id').val("reciever");
});

$('#reciever').on('click', () => {
    GetPeerId("reciever");
    $('#their-id').val("sender");
});

// Connect to a peer
$('#connect').on('submit', e => {
    e.preventDefault();
    //接続
    const conn = peer.connect($('#their-id').val());
    Connect(conn);
});

//切断
$('#close').on('click', () => {
    existingConn.close();
});

//送信ボタン
$('#send').on('submit', e => {
    e.preventDefault();

    DataSend($('#message').val());

    //テキストボックスをクリア
    $('#message').val('');
    //テキストボックスを選択
    $('#message').focus();
});

//リロード
$('#reload').on('click', () => {
    location.reload(true);
});

//送信処理
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
        $('#connected-id').text(conn.remoteId);
    });

    //受信
    conn.on('data', DataRecieve);

    //相手が切断したとき
    conn.on('close', () => {
        $('#resultRecieve').text(conn.remoteId + 'has left the chat');
        setupMakeConnUI();
    });
}

//受信処理
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

    $('#resultRecieve').text('...');
}
