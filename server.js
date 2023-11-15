const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app); // express앱으로 http 서버 생성
const io = socketIO(server); // socketIO를 http 서버에 연결
const PORT = 8081;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('chat');
});

// 닉네임 저장
let nickStore = {
  socketId: 'nickname',
};

// on 메서드는 소켓 통신 작업을 수행
io.on('connection', (socket) => {
  console.log('서버.. 소켓 연결 완료. 소켓 객체 ID >> ', socket.id);

  // 새로운 클라이언트가 연결되면 모든 클라이언트에게 알리는 이벤트를 발생시킵니다.
  // io.emit('notice', `${socket.id} 님이 입장했음`);

  socket.on('chatMessage', (data) => {
    // 소켓아이디로 닉네임 찾기
    const nickName = nickStore[socket.id];

    // io.emit('chatMessage', { message: data.message, sender: socket.id });

    io.emit('chatMessage', { message: data.message, sender: nickName });
  });

  socket.on('setNick', (nick) => {
    // nickStore[socket.id] = nick;

    const nickDuplicate = Object.values(nickStore).indexOf(nick);

    // 닉네임 중복검사
    if (nickDuplicate > 0) {
      // 중복 일때
      socket.emit('nickDup', '사용할 수 없는 닉네임');
    } else {
      // 중복 아닐때

      // 저장
      nickStore[socket.id] = nick;

      // 이벤트 발생
      io.emit('notice', `${nick} 님이 입장했음`);
      socket.emit('entrySuccess', nick);
      // io.emit('updateNicks', nickStore)
    }
  });
  socket.on('disconnect', () => {
    io.emit('notice', `${nickStore[socket.id]} 님이 퇴장함`);
    delete nickStore[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`${PORT} 포트로 서버 실행`);
});
