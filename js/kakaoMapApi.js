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
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude // 위도
    let lon = position.coords.longitude // 경도

    let locPosition = new kakao.maps.LatLng(lat, lon) // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
    let message = '<div style="padding:5px;">안양시</div>'; // 인포윈도우에 표시될 내용입니다

    map.setCenter(locPosition)
    // 마커를 표시합니다
    displayMarker(locPosition, message);

  });

} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

  let locPosition = new kakao.maps.LatLng(33.450701, 126.570667)
  let message = 'geolocation을 사용할수 없어요..'
  displayMarker(locPosition, message);
}

function displayMarker(locPosition, message) {
  let marker = new kakao.maps.Marker({
    position: locPosition, // 마커의 좌표
    map: map // 마커를 표시할 지도 객체
  });
  map.setMap(locPosition)
}

// // 마커 이미지의 주소
// var markerImageUrl = "./images/cold.jpg",
//   markerImageSize = new kakao.maps.Size(40, 42), // 마커 이미지의 크기
//   markerImageOptions = {
//     offset: new kakao.maps.Point(20, 42)// 마커 좌표에 일치시킬 이미지 안의 좌표
//   };

// // 지도에 표시할 다각형을 생성합니다
// var polygon = new kakao.maps.Polygon({
//   path: polygonPath, // 그려질 다각형의 좌표 배열입니다
//   strokeWeight: 3, // 선의 두께입니다
//   strokeColor: '#39DE2A', // 선의 색깔입니다
//   strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
//   strokeStyle: 'longdash', // 선의 스타일입니다
//   fillColor: '#A2FF99', // 채우기 색깔입니다
//   fillOpacity: 0.7 // 채우기 불투명도 입니다
// });

// // 다각형을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 다각형을 표시합니다
// var polygonPath = [
//   new kakao.maps.LatLng(33.45133510810506, 126.57159381623066),
//   new kakao.maps.LatLng(33.44955812811862, 126.5713551811832),
//   new kakao.maps.LatLng(33.449986291544086, 126.57263296172184),
//   new kakao.maps.LatLng(33.450682513554554, 126.57321034054742),
//   new kakao.maps.LatLng(33.451346760004206, 126.57235740081413)
// ];

// // 지도에 다각형을 표시합니다
// polygon.setMap(map);