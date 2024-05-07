const axios = require("axios"); //특정  URL  삽입 시 URL html 태그 가지고
const cheerio = require("cheerio");
var scanf = require('scanf');


// HTML 코드를 가지고 오는  함수
const getHTML = async(keyword) => {
  try{
    return await axios.get("https://search.naver.com/search.naver?where=news&ie=UTF-8&query=" + encodeURI(keyword)) //""안에는 URL 삽입
  }catch(err) {
    console.log(err);
  }
}

 // 파싱 함수
const parsing = async (keyword) => {
  const html = await getHTML(keyword)
  const $ = cheerio.load(html.data);// 가지고 오는 data load
  const $titlist = $(".news_area");

  let informations = [];
  $titlist.each((idx,node) => {
    const title = $(node).find(".news_tit").text();  
    informations.push({
      title: $(node).find(".news_tit:eq(0)").text(), // 뉴스제목 크롤링
      press: $(node).find(".info_group > a").text(), // 출판사 크롤링
      time: $(node).find(".info_group > span").text(), // 기사 작성 시간 크롤링
      contents: $(node).find(".dsc_wrap").text(), // 기사 내용 크롤링
    })
    console.log(informations);
  }); //for문과 동일
}

parsing("감염병"); // 검색어