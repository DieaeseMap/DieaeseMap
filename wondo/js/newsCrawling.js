const axios = require("axios"); //특정  URL  삽입 시 URL html 태그 가지고
const cheerio = require("cheerio");

// HTML 코드를 가지고 오는  함수
const getHTMLNaver = async (keyword) => {
  try {
    return await axios.get(
      "https://search.naver.com/search.naver?where=news&ie=UTF-8&query=" +
        encodeURI(keyword)
    ); //""안에는 URL 삽입
  } catch (err) {
    console.log(err);
  }
};

// 파싱 함수
async function getParsing1(keyword) {
  const html = await getHTMLNaver(keyword);
  const $ = cheerio.load(html.data); // 가지고 오는 data load
  const $titlist = $(".news_area");

  let informations = [];
  $titlist.each((idx, node) => {
    const title = $(node).find(".news_tit").text();
    informations.push({
      title: $(node).find(".news_tit:eq(0)").text(), // 뉴스제목 크롤링
      link: $(node).find(".news_contents > a").attr("href"), // 뉴스 링크
      press: $(node).find(".info_group > a").text(), // 출판사 크롤링
      time: $(node).find(".info_group > span").text(), // 기사 작성 시간 크롤링
      contents: $(node).find(".item-contents").text(), // 기사 내용 크롤링
    });
  });
  return informations;
}

// HTML 코드를 가지고 오는  함수
const getHTMLDaum = async (keyword) => {
  try {
    return await axios.get(
      "https://search.daum.net/search?nil_suggest=btn&w=news&DA=SBC&cluster=y&q=" +
        encodeURI(keyword)
    ); //""안에는 URL 삽입
  } catch (err) {
    console.log(err);
  }
};

// 파싱 함수
async function getParsing2(keyword) {
  const html = await getHTMLDaum(keyword);
  const $ = cheerio.load(html.data); // 가지고 오는 data load
  const $titlist = $(".c-item-content");

  let informations = [];
  $titlist.each((idx, node) => {
    const title = $(node).find(".item.title").text();
    informations.push({
      title: $(node).find(".item-title:eq(0)").text(), // 뉴스제목 크롤링
      time: $(node).find(".gem-subinfo > span").text(), // 기사 작성 시간 크롤링
      contents: $(node).find(".item-contents > p").text(), // 기사 내용 크롤링
      link: $(node).find(".item-contents > p > a").attr("href"), // 뉴스 링크
    });
  });
  
  return informations;
}

module.exports = { getParsing1, getParsing2 };
