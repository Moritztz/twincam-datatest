let peer = null;
let existingConn = null;
//let conn = null;
//let connectedPeers = null;

function GetPeerId(id) {
    //�{�^�������ׂď����@PeerID���T�[�o�[�Ɏc���Ă��܂����������ł��Ȃ�
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

    //���M����
    peer.on('connection', Connect);

    //�G���[
    peer.on('error', err => {
        alert(err);
        setupMakeConnUI();
    });

}

//ID�I��
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
    //�ڑ�
    const conn = peer.connect($('their-id').val());
    Connect(conn);
});

//�ؒf
$('#close').on('click', () => {
    existingConn.close();
});

//���M�{�^��
$('#send').on('submit', e => {
    e.preventDefault();

    DataSend($('#message').val());

    //�e�L�X�g�{�b�N�X���N���A
    $('#message').val('');
    //�e�L�X�g�{�b�N�X��I��
    $('#message').focus();
});

//���M����
function DataSend(msg) {
    existingConn.send(msg);
    $("#resultSend").text(msg);
}

//�ڑ��C�x���g�̊Ǘ�
function Connect(conn) {
    if (existingConn) {
        existingConn.close();
    }
    setupEndConnUI();

    //�ڑ������ێ�
    existingConn = conn;

    //�ڑ������������ꍇ�̃C�x���g
    conn.on('open', () => {
        $('#connected-id').val(conn.id);
    });

    //��M
    conn.on('data', DataRecieve);

    //���肪�ؒf�����Ƃ�
    conn.on('close', () => {
        $('#resuluRecieve').text(conn.id + 'has left the chat');
        setupMakeConnUI();
    });
}

//��M����
function DataRecieve(data) {
    $('#resultRecieve').text(data);
}

//UI����
function setupMakeConnUI() {
    $('#connect').show();
    $('#connected-ui').hide();
}

function setupEndConnUI() {
    $('#connect').hide();
    $('#connected-ui').show();

    $('#resuluRecieve').text('...');
}