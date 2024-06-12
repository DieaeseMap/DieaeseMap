import diseaseApi from "./diseaseApi.js";
import markerAdress from "./markerAdress.js";

// 지도 생성
const mapContainer = document.getElementById("map");
const mapOption = {
  center: new kakao.maps.LatLng(37.566810689783956, 126.97866358173395),
  level: 10,
};
let map = new kakao.maps.Map(mapContainer, mapOption);

// 지도에 클릭 이벤트
kakao.maps.event.addListener(map, "click", function (mouseEvent) {
  var latlng = mouseEvent.latLng;
  console.log(
    `클릭한 위치의 위도: ${latlng.getLat()}, 경도: ${latlng.getLng()}`
  );
});

// geoLocation을 이용해서 접속 위치를 가져오기
const options = {
  enableHighAccuracy: true, // 높은 정확도로 위치정보를 읽음, 기본값: false
  maximumAge: 300000, // 위치정보 재확인 시간 (5분)
  timeout: 15000, // 위치정보를 받기까지의 대기시간 (15초)
};
let locPosition;
let message;
if (navigator.geolocation) {
  // 브라우저가 geolocation을 지원하면 true
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude; // 위도
    let lon = position.coords.longitude; // 경도
    locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성

    // 지역별 감염병 마크 생성
    diseaseMarker();
    // 내 위치 마크 생성
    displayMarker(locPosition, message);

    map.setCenter(locPosition); // 현재 위치로 카메라 이동
    // 에러 발생 시 실행됨 [옵션], 옵션값
    error, options;
  });
} else {
  // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정
  locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
  message = "geolocation을 사용할수 없어요..";
  displayMarker(locPosition, message);
}

async function diseaseMarker() {
  try {
    const maxCnt = await regionMaxCnt(); // 최대 발생 건수 가져오기

    const fetchPromises = [];
    for (let i = 1; i < 6; i++) {
      fetchPromises.push(fetch(diseaseApi(i)).then((res) => res.json()));
    }
    const responses = await Promise.all(fetchPromises);
    const message = {};
    responses.forEach((data) => {
      const items = data.response.body.items;
      items.forEach((item) => {
        const znCd = item.znCd;
        if (maxCnt[znCd] === item.cnt) {
          const position = new kakao.maps.LatLng(
            markerAdress[znCd].lat,
            markerAdress[znCd].lon
          );
          const img = getImage(item.dissCd);
          message.dt = item.dt;
          message.znCd = markerAdress[znCd].name;
          message.dissRiskXpln = item.dissRiskXpln;
          displayMarker(position, message, img);
        }
      });
    });
  } catch (e) {
    console.log("diseaseMarker() 에러 : ", e);
  }
}

function getImage(dissCd) {
  let img = null;
  switch (dissCd) {
    case "1":
      img = "../img/cold.png";
      break;
    case "2":
      img = "../img/eye_disease.png";
      break;
    case "3":
      img = "../img/Food_poisoning.png";
      break;
    case "4":
      img = "../img/Asthma.png";
      break;
    case "5":
      img = "../img/dermatitis.png";
      break;
    default:
      if (dissCd === null) {
        return console.log("선택된 목록이 없습니다.");
      }
  }
  return img;
}

function error(e) {
  console.error(e);
}

function displayMarker(locPosition, message = "내 위치", imageSrc) {
  // 마커이미지의 설정
  let markerImage = imageSrc !== undefined ? imageMarker(imageSrc) : undefined;

  // 마커 생성
  let marker = new kakao.maps.Marker({
    position: locPosition,
    image: markerImage,
  });

  let content = `<div class="wrap">
  <div class="info">
    <div class="title">
      ${message.znCd}
    </div>
    <div class="body">
      <div class="img">
        <img src="${imageSrc}" width="73" height="70">
      </div>
      <div class="desc">
        <div class="ellipsis">${
          message.dissRiskXpln.substring(0, 18) +
          "<br>" +
          message.dissRiskXpln.substring(18, 37) +
          "<br>" +
          message.dissRiskXpln.substring(37, 55) +
          "<br>" +
          message.dissRiskXpln.substring(55, 68) +
          "<br>"
        }</div>
        <div class="jibun ellipsis">
          적용일자: ${message.dt}
        </div>
      </div>
    </div>
  </div>  
</div>;
  `;

  // 커스텀 오버레이를 생성합니다
  let customOverlay = new kakao.maps.CustomOverlay({
    position: locPosition,
    content: content,
    yAnchor: 1,
  });

  customOverlay.setMap(map);
  customOverlay.setVisible(false);

  // 마커에 클릭 이벤트를 등록하여 커스텀 오버레이를 표시
  kakao.maps.event.addListener(marker, "click", function () {
    if (customOverlay.getVisible() === false) {
      customOverlay.setVisible(true);
    } else {
      customOverlay.setVisible(false);
    }
  });

  marker.setMap(map); // 마커를 지도에 표시합니다
}

function imageMarker(imageSrc) {
  let imageSize = new kakao.maps.Size(65, 60);
  let imageOption = { offset: new kakao.maps.Point(30, 70) }; // 마커이미지의 옵션, 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정

  // 마커의 이미지정보를 가지고 있는 마커이미지를 생성
  let markerImage = new kakao.maps.MarkerImage(
    imageSrc,
    imageSize,
    imageOption
  );
  return markerImage;
}

async function regionMaxCnt() {
  try {
    let arr = {};
    let maxCnt = {};
    for (let i = 1; i < 6; i++) {
      const response = await fetch(diseaseApi(i));
      if (!response.ok) {
        throw new Error("Failed to fetch diseaseApi");
      }

      const data = await response.json();

      let items = data.response.body.items;
      for (let item of items) {
        arr[item.znCd] =
          item.cnt < maxCnt[item.znCd] ? maxCnt[item.znCd] : item.cnt;
        maxCnt[item.znCd] = arr[item.znCd];
      }
    }
    return maxCnt;
  } catch (e) {
    console.error("regionMaxCnt() 에러 : ", e);
  }
}
