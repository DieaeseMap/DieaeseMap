# DiseaseMap

### 질병 예측관리 프로그램
- 카카오API = https://apis.map.kakao.com/web/guide/
- 공공데이터API = https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15028050

<br>

### 카카오 지도 API 가이드
- 지도레벨: level: 10
- 기본좌표: center: new kakao.maps.LatLng(33.450701, 126.570667)
- 지도 크기: style="width:100%;height:350px;"

### 질병관리 API 가이드
- API url: http://apis.data.go.kr/B550928/dissForecastInfoSvc/getDissForecastInfo
- GET방식으로 데이터를 가져옴
  - serviceKey=`개개인의 시리얼코드를 입력`
  - numOfRows=`한 페이지 결과 수`
  - pageNo=`페이지 번호` 기본값: 1
  - type=`응답결과의 출력 방식 ex) xml, json` 기본값: xml
  - dissCd=`질병코드`
  - znCd=`지역코드`
  >  위 속성은 필수 입력사항

### 배포 관리