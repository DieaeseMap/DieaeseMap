document
  .getElementById("searchButton")
  .addEventListener("click", async function () {
    const location = document.getElementById("location").value; // 입력된 위치 가져오기

    try {
      const response = await fetch("/api/hospital?location=" + location, {
        method: "POST",
      });
      const data = await response.json();

      // 서버로부터 받은 데이터를 처리
      const hospitalDataElement = document.getElementById("hospitalData");
      hospitalDataElement.innerHTML = ""; // 이전 결과를 지우고 새 결과 표시
      data.forEach(function (hospital) {
        const hospitalItem = document.createElement("div");
        hospitalItem.innerHTML = `<a href="${hospital.link}"><strong>${hospital.title}</strong></a><br>${hospital.location}<br>${hospital.type}<br>${hospital.time}<br><br>`;
        hospitalDataElement.appendChild(hospitalItem);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  });
