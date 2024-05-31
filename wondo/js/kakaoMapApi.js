import diseaseApi from "./diseaseApi.js";
import markerAdress from "./markerAdress.js";

// 지도 생성
const mapContainer = document.getElementById('map')
const mapOption = {
  center: new kakao.maps.LatLng(37.566810689783956, 126.97866358173395),
  level: 10
};
let map = new kakao.maps.Map(mapContainer, mapOption);

// 지도에 클릭 이벤트
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
  var latlng = mouseEvent.latLng;
  console.log(`클릭한 위치의 위도: ${latlng.getLat()}, 경도: ${latlng.getLng()}`)
});

// geoLocation을 이용해서 접속 위치를 가져오기
const options = {
  enableHighAccuracy: true, // 높은 정확도로 위치정보를 읽음, 기본값: false
  maximumAge: 300000, // 위치정보 재확인 시간 (5분)
  timeout: 15000 // 위치정보를 받기까지의 대기시간 (15초)
};
let locPosition;
let message;
if (navigator.geolocation) { // 브라우저가 geolocation을 지원하면 true 
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude; // 위도
    let lon = position.coords.longitude; // 경도
    locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성

    // 지역별 감염병 마크 생성
    diseaseMarker();
    displayMarker(locPosition, message);

    map.setCenter(locPosition) // 현재 위치로 카메라 이동  
    // 에러 발생 시 실행됨 [옵션], 옵션값
    error, options
  });
} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정
  locPosition = new kakao.maps.LatLng(33.450701, 126.570667)
  message = 'geolocation을 사용할수 없어요..'
  displayMarker(locPosition, message);
}



async function diseaseMarker() {
  try {
    const maxCnt = await regionMaxCnt(); // 최대 발생 건수 가져오기

    for (let i = 1; i < 6; i++) {
      const response = await fetch(diseaseApi(i)); // 질병 데이터 가져오기
      if (!response.ok) {
        throw new Error('Failed to fetch diseaseApi()');
      }

      const data = await response.json(); // JSON 파싱

      const items = data.response.body.items;
      for (let item of items) {
        const znCd = item.znCd;
        const img = getImage(item.dissCd); // 질병 코드에 따른 이미지 경로 가져오기
        if (maxCnt[znCd] === item.cnt) {
          const position = new kakao.maps.LatLng(markerAdress[znCd].lat, markerAdress[znCd].lon);
          const message = item.dissRiskXpln; // 질병 위험 설명 가져오기
          displayMarker(position, message, img); // 마커 표시
        }
      }
    }
  } catch (e) {
    console.log('diseaseMarker() 에러 : ', e);
  }
}

function getImage(dissCd) {
  let img = null;
  switch (dissCd) {
    case '1':
      img = "../img/cold.png"; break;
    case '2':
      img = "../img/eye_disease.png"; break;
    case '3':
      img = "../img/Food_poisoning.png"; break;
    case '4':
      img = "../img/Asthma.png"; break;
    case '5':
      img = "../img/dermatitis.png"; break;
    default:
      if (dissCd === null) { return console.log("선택된 목록이 없습니다."); }
  }
  return img;
}

function error(e) {
  console.error(e);
}

function displayMarker(locPosition, message = '내 위치', imageSrc) {

  // 마커이미지의 설정
  let markerImage = imageSrc !== undefined ? imageMarker(imageSrc) : undefined;

  let marker = new kakao.maps.Marker({
    position: locPosition,
    image: markerImage
  });

  let infowindow = new kakao.maps.InfoWindow({
    content: message
  });

  // 마커에 클릭이벤트를 등록합니다
  kakao.maps.event.addListener(marker, 'mouseover', () => {
    // 마커 위에 인포윈도우를 표시합니다
    infowindow.open(map, marker);
  });

  kakao.maps.event.addListener(marker, 'mouseout', () => {
    // 마커 위에 인포윈도우를 표시합니다
    infowindow.close();
  });

  marker.setMap(map); // 마커를 지도에 표시합니다
}

function imageMarker(imageSrc) {
  let imageSize = new kakao.maps.Size(70, 70);
  let imageOption = { offset: new kakao.maps.Point(30, 70) }; // 마커이미지의 옵션, 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정

  // 마커의 이미지정보를 가지고 있는 마커이미지를 생성
  let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
  return markerImage;
}

async function regionMaxCnt() {
  try {
    let arr = {};
    let maxCnt = {};
    for (let i = 1; i < 6; i++) {
      const response = await fetch(diseaseApi(i));
      if (!response.ok) {
        throw new Error('Failed to fetch diseaseApi');
      }

      const data = await response.json();

      let items = data.response.body.items;
      for (let item of items) {
        arr[item.znCd] = item.cnt < maxCnt[item.znCd] ? maxCnt[item.znCd] : item.cnt;
        maxCnt[item.znCd] = arr[item.znCd];
      }
    }
    return maxCnt;
  } catch (e) {
    console.error('regionMaxCnt() 에러 : ', e);
  }
}