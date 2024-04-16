  /* Javascript 샘플 코드 */
  var xhr = new XMLHttpRequest();
  var url = 'http://apis.data.go.kr/B550928/dissForecastInfoSvc/getDissForecastInfo'; /*URL*/
  var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + '0osPSL6ycDPUaQPjoTOvZ%2BCHeLmN1jzoHKlx8v5Ty%2BQMQIa4g%2BC9pRJCnLp%2BQzVCu5NMlqVHw0qqN8RPTArZHA%3D%3D'; /*Service Key*/
  queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /*한 페이지 결과 수*/
  queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /*페이지 번호, 미입력 시 기본값 1*/
  queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json'); /*응답결과의 출력 방식(xml, json), 미입력시 기본값:xml*/
  queryParams += '&' + encodeURIComponent('dissCd') + '=' + encodeURIComponent('1'); /*질병코드*/
  queryParams += '&' + encodeURIComponent('znCd') + '=' + encodeURIComponent('41'); /*지역코드*/

  xhr.open('GET', url + queryParams)
  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      var testDiv = document.getElementById('dieaese');
      let dieaeseObj = JSON.parse(xhr.response)
      testDiv.innerHTML = "안양시 질병정보: " + JSON.stringify(dieaeseObj.response.body.items[0])
      console.log(dieaeseObj.response.body)
    }
  };

  xhr.send('');