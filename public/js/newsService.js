async function setNaverNewsData() {
  const newsArea = document.getElementById("newsData");
  try {
    const response = await fetch("https://port-0-diseasemap-test-1pgyr2mlvlp2ppo.sel5.cloudtype.app/news");
    const data = await response.json();

    // 최대 5개의 뉴스 기사만 출력
    for (let i = 0; i < Math.min(5, data.length); i++) {
      const newsItem = document.createElement("div");
      newsItem.innerHTML = `<a href="${data[i].link}"><strong>${data[i].title}</strong></a><br>${data[i].time}<br><br>`;
      newsArea.appendChild(newsItem);
    }
  } catch (error) {
    console.error(error);
  }
}
setNaverNewsData();

async function setDaumNewsData() {
  const newsArea = document.getElementById('newsData2');
  try {
      const response = await fetch("https://port-0-diseasemap-test-1pgyr2mlvlp2ppo.sel5.cloudtype.app/news2");
      const data3 = await response.json();

      // 최대 5개의 뉴스 기사만 출력
      for (let i = 0; i < Math.min(5, data3.length); i++) {
          const newsItem2 = document.createElement('div');
          newsItem2.innerHTML = `<a href="${data3[i].link}"><strong>${data3[i].title}</strong></a><br>${data3[i].time}<br><br>`;
          newsArea.appendChild(newsItem2);
      }
  } catch (error) {
      console.error(error.message);
  }
}
setDaumNewsData();
