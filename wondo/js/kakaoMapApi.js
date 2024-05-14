import diseaseApi from "./diseaseApi.js";
import markerAdress from "./markerAdress.js";

const dissCd = [1, 2, 3, 4, 5, 15];

// 지도 생성하기
const mapContainer = document.getElementById('map') // 지도를 표시할 div 
const mapOption = {
  center: new kakao.maps.LatLng(37.566810689783956, 126.97866358173395), // 지도의 중심좌표
  level: 10 // 지도의 확대 레벨
};
let map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

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

if (navigator.geolocation) { // 브라우저가 geolocation을 지원하면 true 
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude; // 위도
    let lon = position.coords.longitude; // 경도
    let locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성

    let img;
    switch (5) {
      case 1:
        img = '../img/cold.jpg';
        fetchDisease(1);
        break;
      case 2:
        img = '../img/eye_disease.jpg';
        fetchDisease(2);
        break;
      case 3:
        img = '../img/Food_posisoning.jpg';
        fetchDisease(3);
        break;
      case 4:
        img = '../img/Asthma.jpg';
        fetchDisease(4);
        break;
      case 5:
        img = '../img/dermatitis.jpg';
        fetchDisease(5);
        break;
      default:
        console.log("선택된 목록이 없습니다.");
    }

    map.setCenter(locPosition) // 현재 위치로 카메라 이동  
  },
    // 에러 발생 시 실행됨 [옵션], 옵션값
    error, options
  );

} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정

  let locPosition = new kakao.maps.LatLng(33.450701, 126.570667)
  let message = 'geolocation을 사용할수 없어요..'
  displayMarker(locPosition, message);
}

// 메서드 모음

function fetchDisease(dissCd = 1) {
  fetch(diseaseApi(dissCd)) // 질병코드 n번으로 데이터 추출
    .then((response) => {
      if (!response.ok) {
        throw new Error('response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      let items = data.response.body.items;
      console.log(items);
      for (let j = 0; j < items.length; j++) {
        let znCd = items[j].znCd;
        let message = `<div style="padding: 5px;">${items[j].dissRiskXpln}`; // 메시지 가져오기
        let position = new kakao.maps.LatLng(markerAdress[znCd].lat, markerAdress[znCd].lon);
        displayMarker(position, message); // 마커를 표시합니다
      }
    })
    .catch(error => console.log(error));
}

function error(e) {
  console.log(e.code);
}

function displayMarker(locPosition, message) {
  // 마커이미지의 설정
  let imageSrc = '../img/cold.jpg';
  let imageSize = new kakao.maps.Size(64, 69);
  let imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션, 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정

  // 마커의 이미지정보를 가지고 있는 마커이미지를 생성
  let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

  let marker = new kakao.maps.Marker({
    position: locPosition, 
    image: markerImage
  });

  let infowindow = new kakao.maps.InfoWindow({
    content: message,
    removable: true
  })

  // 마커를 지도에 표시합니다.
  marker.setMap(map);

  // 마커에 클릭이벤트를 등록합니다
  kakao.maps.event.addListener(marker, 'click', () => {
    // 마커 위에 인포윈도우를 표시합니다
    infowindow.open(map, marker);
  });
}
