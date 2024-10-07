import { CLIENT_VERSION } from '../constants.js';
import handlerMappings from './handlers/handlerMapping.js';

export const handleEvent = (io, socket, data) => {
  // 서버에 저장된 클라이언트 배열에서 메시지로 받은 clientVersion을 확인
  if (!CLIENT_VERSION.includes(data.clientVERSION)) {
    // 만약 일치하면 버전이 없으면 response 이벤트로 fail결과 전송
    socket.emit('response', { status: 'fail', message: 'Client version mismatch' });
    return;
  }
};

// 메세지로 오는 handlerId에 따라 handlerMappings 객체에서 적절한 핸들러를 찾기
const handler = handlerMappings(data.handlerId);
// 적절한 핸들러가 없다면 실패처리
if (!handler) {
  socket.emit('response', { status: 'fail', message: ' Handler not found' });
  return;
}

//적절한 핸들러에 userID와 payload를 전달하고 결과 받기
const response = handler(data.userId, data.payload);
// 만약 결과에 broadcast (모든 유저에게 전달)이 있다면 broadcast 하고
if (response.broadcast) {
  io.emit('response', 'broadcast');
  return;
}

// // 해당 유저에게 적절한 response 전달
socket.emit('response', response);
