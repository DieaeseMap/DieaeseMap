require("dotenv").config();
const nodemailer = require("nodemailer");

function mailConfig(fromEmail, subject, message) {
  // null 체크
  if (fromEmail === undefined && subject === undefined && message === undefined) {
    return { success: false };
  }

  // 이메일 전송을 위한 서버 연결
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // 이메일 서비스의 포트 번호 (ex: 25, 587, 465, 2525)
    auth: {
      user: process.env.EMAIL, // 환경변수에서 이메일 주소를 가져옴
      pass: process.env.PASSWORD, // 환경변수에서 애플리케이션 비밀번호를 가져옴
    },
  });

  // 메일 옵션 설정
  const mailOptions = {
    from: process.env.EMAIL, // 작성자
    to: fromEmail, // 수신자
    subject: subject, // 메일 제목
    text: message, // 메일 내용
  };

  // 메일 전송
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  return { success: true };
}

module.exports = { mailConfig };
