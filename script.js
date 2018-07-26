$(function () {
    // peer serverからpeeridもらうとサンプルレベルだと
    // id打ち込むのがめんどいので、乱数でidを生成
    const myid = Math.floor(Math.random() * 100).toString();

    $("#myid").val(myid);

    // 接続状態になるまで、メッセージ送信用のフォームは隠しておく
    $("#messaging").hide();

    // SkyWayサーバーに接続する
    const peer = new Peer(myid, { key: "9373b614-604f-4fd5-b96a-919b20a7c24e" });

    // 接続元
    $("form#connect").submit(function Con (ev) {
        ev.preventDefault();

        // 接続先のpeeridを取得し、connect()で接続処理を開始する
        const peerid = $("#peerid").val();
        var conn = peer.connect(peerid);

        // peerとの接続が完了したらメッセージ送受信状態に移る
        conn.on("open", function () {
            messaging(this);
        });
    });

    // 接続先
    peer.on("connection", function (conn) {
        // peerからの接続要求を受け取ったら、メッセージ送受信状態に移る
        messaging(conn);
    });

    // メッセージ送受信を処理する関数
    var messaging = function (conn) {
        // 接続処理用のフォームを隠し、
        // メッセージ送受信用フォームをフェードインする。
        // 接続処理完了時にフォームを隠すことで、接続先が connect() を呼ぶことを防いでいる。
        $("form#connect").hide();
        $("form#messaging").fadeIn()
            .on("submit", function (ev) {
                ev.preventDefault(); // デフォルトのsubmit動作（reload）を抑制

                // 送信メッセージを取得し、peerに送信する
                var send_data = $(this).find("input").val();
                conn.send(send_data);

                // 送信フォームのメッセージをクリアする
                $(this).find("input").val("");
            });

        // peerからメッセージを受信した際の処理
        conn.on("data", function (data) {
            // 受信メッセージを #receive にappendしていく
            $("<p>").text(data).appendTo("#receive");
        });
    }
});
