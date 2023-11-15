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

// on 메서드는 소켓 통신 작업을 수행
io.on('connection', (socket) => {
  console.log('서버.. 소켓 연결 완료. 소켓 객체 ID >> ', socket.id);

  // 실습 1
  //   socket.on('hello', (data) => {
  //     console.log(data);
  //     socket.emit('helloKr', { who: 'hello', msg: '안녕!!' });
  //   });
});

server.listen(PORT, () => {
  console.log(`${PORT} 포트로 서버 실행`);
});
