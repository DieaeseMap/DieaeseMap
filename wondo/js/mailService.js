// from에서 submit 발생 시
document.getElementById("emailForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;
  const formData = {
    fromEmail: form.fromEmail.value,
    subject: form.subject.value,
    message: form.message.value,
  };

  // 서버로 요청을 보내고 받는다.
  submit("http://127.0.0.1:5500/sendEmail", formData).then((data) => {
    if (data.success) {
      alert("요청하신 문의사항이 관리자에게 전달되었습니다.");
    } else {
      alert("전송에 실패했습니다.");
    }
  });
});

// 서버로 요청을 보냅니다.
async function submit(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
