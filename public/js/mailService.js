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
  submit("https://port-0-diseasemap-test-1pgyr2mlvlp2ppo.sel5.cloudtype.app/sendEmail", formData).then((data) => {
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
