import diseaseApi from "./diseaseApi.js";

// 지도 생성하기
const mapContainer = document.getElementById('map') // 지도를 표시할 div 
const mapOption = {
  center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
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

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude // 위도
    let lon = position.coords.longitude // 경도
    let locPosition = new kakao.maps.LatLng(lat, lon) // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성

    fetch(diseaseApi(1))
      .then(response => {
        if (!response.ok) {
          throw new Error('response was not ok')
        }
        return response.json()
      })
      .then(data => {
        console.log(data)
        for (let index = 0; index < data.length; index++) {
          const element = array[index];
          
        }
        let message = data.response.body.items[0].dissRiskXpln
        displayMarker(locPosition, message); // 마커를 표시합니다
      })
      .catch(error => console.log(error))
      
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

function error(e) {
  console.log(e.code);
}

function displayMarker(locPosition, message) {
  let marker = new kakao.maps.Marker({
    position: locPosition, // 마커의 좌표
    map: map // 마커를 표시할 지도 객체
  });

  let infowindow = new kakao.maps.InfoWindow({
    position: locPosition,
    content: message
  })

  marker.setMap(map)
  infowindow.open(map, marker)
}