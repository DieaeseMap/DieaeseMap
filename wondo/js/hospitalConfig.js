const axios = require("axios"); // 특정 URL 삽입 시 URL html 태그 가지고
const cheerio = require("cheerio");

// HTML 코드를 가져오는 함수
const getHospitalHTML = async (keyword) => {
    try {
        return await axios.get("https://search.daum.net/search?w=tot&DA=YZR&t__nil_searchbox=btn&q=" + encodeURI(keyword) + "병원");
    } catch (err) {
        console.log(err);
    }
};

// 파싱 함수
async function searchHospital(keyword) {
    const html = await getHospitalHTML(keyword);
    const $ = cheerio.load(html.data);
    const $titlist = $("li .cont_info");

    let hospital = [];
    $titlist.each((idx, node) => {
        let timeText = $(node).find(".info_place .txt_info").text();
        let startIdx1 = timeText.indexOf("진료마감");
        let startIdx2 = timeText.indexOf("진료중");
        let startIdx3 = timeText.indexOf("브레이크타임");
        let startIdx = startIdx1 !== -1 ? startIdx1 : startIdx2 !== -1 ? startIdx2 : startIdx3 !== -1 ? startIdx3 : -1; // "진료마감", "진료중", "브레이크타임" 중 하나라도 찾으면 해당 인덱스 사용
        let endIdx = timeText.indexOf(","); // 쉼표(,)가 나오는 부분까지를 선택

        if (endIdx === -1) endIdx = timeText.length;

        let extractedTime = timeText.substring(startIdx, endIdx);

        if (extractedTime.length > 14) {
            extractedTime = extractedTime.substring(0, 18); // 14번째 글자 이후의 내용 제거
            let after13 = extractedTime.substring(13);
            let onlyNumbers = after13.replace(/[^\d]/g, '');
            extractedTime = extractedTime.substring(0, 13) + onlyNumbers;
            // 만약 14번째 글자 이후에 숫자라면 콜론 추가
            if (extractedTime.length > 14 && extractedTime.charAt(14).match(/\d/)) {
                extractedTime = extractedTime.substring(0, 15); // 공백 추가
            }
            if (startIdx < 10) {
                extractedTime = extractedTime.replace(/(\d{2}):(\d{2})/g, (match, p1, p2) => {
                    return p1 + ":" + p2;
                });
            }
        }


        let status = startIdx === startIdx1 ? "진료마감" : startIdx === startIdx2 ? "진료중" : "브레이크타임"; // 인덱스를 기반으로 상태 설정


        if (startIdx < 10) {
            extractedTime = extractedTime.replace(status, status + " "); // 상태 앞에 공백 추가
        }

        const spans = [];
        $(node).find(".cont > span").each((i, spanNode) => {
            if (i % 2 === 0) { // 짝수 번째만 선택
                spans.push($(spanNode).text());
            }
        });

        hospital.push({
            title: $(node).find(".fn_tit:eq(0)").text().trim(), // 병원 이름 크롤링
            link: $(node).find(".inner_tit > a ").attr("href"), // 병원 주소 링크 크롤링
            location: spans.join(', '), // 병원 좌표
            type: $(node).find(".inner_tit > span").text(), // 병원 종류
            phone: $(node).find(".f_url").text(), // 전화번호
            time: extractedTime.trim() // 진료 시간
        });
    });

    return hospital;
}

module.exports = { searchHospital };