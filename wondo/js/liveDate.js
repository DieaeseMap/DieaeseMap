import diseaseApi from "./diseaseApi.js";

const $anyangData = document.getElementById("anyang-live");
const $detailsData = document.getElementById("details-live");
const $chart = document.getElementById("chart").getContext("2d");

await anyangCurrent();
await detailsCurrent();
await areasCurrent();

// 안양시 진료현황
async function anyangCurrent() {
  const response = await fetch(diseaseApi(1, 41)); // 지역별 질병 데이터 가져오기 (참고: markerAdress.js)
  const data = await response.json();

  if (!response.ok) {
    // 예외 처리
    throw new Error("Failed to fetch diseaseApi()");
  }

  const items = data.response.body.items;

  let countValue = 0;

  for (const item of items) {
    console.log(item);
    if (item.lowrnkZnCd === "41171" || item.lowrnkZnCd === "41173") {
      // 안양시 지역코드로 비교
      countValue += Number(item.cnt);
    }
  }
  $anyangData.textContent = `안양시 : ${countValue}`;
}

// 상세 진료현황
async function detailsCurrent() {
  const response = await fetch(diseaseApi(1, 41)); // 지역별 질병 데이터 가져오기 (참고: markerAdress.js)
  const data = await response.json();

  if (!response.ok) {
    // 예외 처리
    throw new Error("Failed to fetch diseaseApi()");
  }

  const items = data.response.body.items;

  let countValue = 0;

  for (const item of items) {
    console.log(item);
    if (item.lowrnkZnCd === "41171" || item.lowrnkZnCd === "41173") {
      // 안양시 지역코드로 비교
      countValue += Number(item.cnt);
    }
  }
  $detailsData.textContent = countValue;
}

// 지역별 상세현황
async function areasCurrent() {
  const response = await fetch(diseaseApi(1, 41)); // 지역별 질병 데이터 가져오기 (참고: markerAdress.js)
  const data = await response.json();

  const areaChart = new Chart($chart, chartOption);
  
  if (!response.ok) {
    // 예외 처리
    throw new Error("Failed to fetch diseaseApi()");
  }

  const items = data.response.body.items;

  let countValue = 0;

  for (const item of items) {
    console.log(item);
    if (item.lowrnkZnCd === "41171" || item.lowrnkZnCd === "41173") {
      // 안양시 지역코드로 비교
      countValue += Number(item.cnt);
    }
  }
  $areasData.textContent = countValue;
}

const chartOption = {
  type: "pie",
  data: {
    labels: ["서울", "부산", "대구", "대전", "인천", "제주"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
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
};
