const { InteractionType, InteractionResponseType, verifyKey } = require('discord-interactions');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 제미나이 설정
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = async (req, res) => {
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];
  const rawBody = JSON.stringify(req.body);

  const isValidRequest = verifyKey(rawBody, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);
  if (!isValidRequest) return res.status(401).send('인증 에러');

  if (req.body.type === InteractionType.PING) {
    return res.status(200).send({ type: InteractionResponseType.PONG });
  }

  // 사용자가 디스코드에서 보낸 메시지 추출
  if (req.body.type === InteractionType.APPLICATION_COMMAND) {
    const userMessage = req.body.data.options[0].value;

    // 제미나이에게 질문 전달
    const prompt = `너는 제이아이비(JIB)의 전문 에이전트야. 부대표님의 질문에 답해줘: ${userMessage}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return res.status(200).send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: { content: response.text() }
    });
  }
};
