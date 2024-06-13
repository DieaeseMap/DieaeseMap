import diseaseApi from "./diseaseApi.js";

// 로딩 시작 시 스피너 표시
const $spinnerArea = document.getElementById("loading-area");
const $spinnerDetails = document.getElementById("loading-details");
$spinnerArea.style.display = "block";
$spinnerDetails.style.display = "block";

await Promise.all([anyangCurrent(), areasCurrent()]);

// 진료현황
async function anyangCurrent() {
  const $anyangData = document.getElementById("anyang-live");
  const $totalData = document.getElementById("total-live");
  const $detailChart = document
    .getElementById("details-chart")
    .getContext("2d");

  let anyangValue = 0; // 안양시 진료 건수
  let totalValue = 0; // 총 진료 건수

  // 질병 데이터 가져오기
  const fetchPromises = [];
  for (let i = 1; i < 6; i++) {
    fetchPromises.push(fetch(diseaseApi(i, 41)).then((res) => res.json()));
    fetchPromises.push(fetch(diseaseApi(i)).then((res) => res.json()));
  }

  const responses = await Promise.all(fetchPromises);
  const detailsCnt = [];
  for (let i = 0; i < responses.length; i += 2) {
    const dataNat = responses[i + 1];
    const data = responses[i];

    const itemsNat = dataNat.response.body.items;
    const items = data.response.body.items;

    for (const item of items) {
      if (["41171", "41173"].includes(item.lowrnkZnCd)) {
        // 안양시 지역코드로 비교
        anyangValue += Number(item.cnt);
      }
    }
    totalValue += itemsNat[itemsNat.length - 1].cnt;
    detailsCnt.push(itemsNat[itemsNat.length - 1].cnt);
  }

  new Chart($detailChart, {
    type: "bar",
    data: {
      labels: ["감기", "눈병", "식중독", "피부염"],
      datasets: [
        {
          label: "진료 건수",
          data: detailsCnt,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(124, 75, 140, 0.2)",
            "rgba(107, 162, 132, 0.2)",
            "rgba(150, 99, 127, 0.2)",
            "rgba(175, 162, 35, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(124, 75, 140, 1)",
            "rgba(107, 162, 132, 1)",
            "rgba(150, 99, 127, 1)",
            "rgba(175, 162, 35, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  $anyangData.textContent = `안양시 : ${anyangValue} 명`;
  $totalData.textContent = `전체 : ${totalValue} 명`;

  // 로딩 완료 시 스피너 숨김
  $spinnerDetails.style.display = "none";
}

// 지역별 상세현황
async function areasCurrent() {
  const $chart = document.getElementById("area-chart").getContext("2d");

  const fetchPromises = [];
  for (let i = 1; i < 6; i++) {
    fetchPromises.push(fetch(diseaseApi(i)).then((res) => res.json()));
  }

  const responses = await Promise.all(fetchPromises);

  const areaCnt = {};
  responses.forEach((res) => {
    const items = res.response.body.items;
    for (const item of items) {
      // 지역코드로 분류
      if (!["29", "31", "41", "99"].includes(item.znCd)) {
        if (!areaCnt[item.znCd]) {
          areaCnt[item.znCd] = 0;
        }
        areaCnt[item.znCd] += parseInt(item.cnt);
      }
    }
  });

  new Chart($chart, {
    type: "pie",
    data: {
      labels: [
        "서울",
        "부산",
        "대구",
        "인천",
        "대전",
        "강원",
        "충북",
        "충남",
        "경북",
        "경남",
        "전북",
        "전남",
        "제주",
      ],
      datasets: [
        {
          label: "진료 건수",
          data: Object.values(areaCnt),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(124, 75, 140, 0.2)",
            "rgba(107, 162, 132, 0.2)",
            "rgba(150, 99, 127, 0.2)",
            "rgba(175, 162, 35, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(124, 75, 140, 1)",
            "rgba(107, 162, 132, 1)",
            "rgba(150, 99, 127, 1)",
            "rgba(175, 162, 35, 1)",
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  // 로딩 완료 시 스피너 숨김
  $spinnerArea.style.display = "none";
}
