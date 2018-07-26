$(function () {
    // peer server����peerid���炤�ƃT���v�����x������
    // id�ł����ނ̂��߂�ǂ��̂ŁA������id�𐶐�
    const myid = Math.floor(Math.random() * 100).toString();

    $("#myid").val(myid);

    // �ڑ���ԂɂȂ�܂ŁA���b�Z�[�W���M�p�̃t�H�[���͉B���Ă���
    $("#messaging").hide();

    // SkyWay�T�[�o�[�ɐڑ�����
    const peer = new Peer(myid, { key: "9373b614-604f-4fd5-b96a-919b20a7c24e" });

    // �ڑ���
    $("form#connect").submit(function Con (ev) {
        ev.preventDefault();

        // �ڑ����peerid���擾���Aconnect()�Őڑ��������J�n����
        const peerid = $("#peerid").val();
        var conn = peer.connect(peerid);

        // peer�Ƃ̐ڑ������������烁�b�Z�[�W����M��ԂɈڂ�
        conn.on("open", function () {
            messaging(this);
        });
    });

    // �ڑ���
    peer.on("connection", function (conn) {
        // peer����̐ڑ��v�����󂯎������A���b�Z�[�W����M��ԂɈڂ�
        messaging(conn);
    });

    // ���b�Z�[�W����M����������֐�
    var messaging = function (conn) {
        // �ڑ������p�̃t�H�[�����B���A
        // ���b�Z�[�W����M�p�t�H�[�����t�F�[�h�C������B
        // �ڑ������������Ƀt�H�[�����B�����ƂŁA�ڑ��悪 connect() ���ĂԂ��Ƃ�h���ł���B
        $("form#connect").hide();
        $("form#messaging").fadeIn()
            .on("submit", function (ev) {
                ev.preventDefault(); // �f�t�H���g��submit����ireload�j��}��

                // ���M���b�Z�[�W���擾���Apeer�ɑ��M����
                var send_data = $(this).find("input").val();
                conn.send(send_data);

                // ���M�t�H�[���̃��b�Z�[�W���N���A����
                $(this).find("input").val("");
            });

        // peer���烁�b�Z�[�W����M�����ۂ̏���
        conn.on("data", function (data) {
            // ��M���b�Z�[�W�� #receive ��append���Ă���
            $("<p>").text(data).appendTo("#receive");
        });
    }
});
