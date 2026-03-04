// 디스코드 보안 검증 라이브러리 사용
const { InteractionType, InteractionResponseType, verifyKey } = require('discord-interactions');

module.exports = async (req, res) => {
  // 1. 디스코드에서 보낸 보안 서명(Header)을 가져옵니다
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const rawBody = JSON.stringify(req.body);

  // 2. 부대표님이 설정한 PUBLIC_KEY로 진짜 디스코드 신호인지 검사합니다
  const isValidRequest = verifyKey(rawBody, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);

  if (!isValidRequest) {
    return res.status(401).send('인증되지 않은 요청입니다.');
  }

  // 3. 디스코드의 인증 요청(Ping)에 대해 올바른 형식으로 응답합니다
  if (req.body.type === InteractionType.PING) {
    return res.status(200).send({ type: InteractionResponseType.PONG });
  }

  // 4. 일반적인 명령어 요청 처리 (여기서 실적 데이터를 보여줍니다)
  res.status(200).send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: { content: "제이아이비(JIB) 에이전트 연결 성공!" }
  });
};
