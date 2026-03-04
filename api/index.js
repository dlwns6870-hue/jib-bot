module.exports = (req, res) => {
  // 디스코드에서 보내는 인증 요청(Type 1)인지 확인합니다
  if (req.body && req.body.type === 1) {
    return res.status(200).send({ type: 1 });
  }
  
  // 일반 접속 시 확인용 메시지
  res.status(200).send("제이아이비 에이전트가 정상 작동 중입니다.");
};
