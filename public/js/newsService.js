async function setNewsData() {
  const newsArea = document.getElementById("newsData");
  try {
    const response = await fetch("https://port-0-diseasemap-test-1pgyr2mlvlp2ppo.sel5.cloudtype.app/news");
    const data = await response.json();

    // 최대 5개의 뉴스 기사만 출력
    for (let i = 0; i < Math.min(4, data.length); i++) {
      const newsItem = document.createElement("div");
      newsItem.innerHTML = `<a href="${data[i].link}"><strong>${data[i].title}</strong></a><br>${data[i].time}<br><br>`;
      newsArea.appendChild(newsItem);
    }
  } catch (error) {
    console.error(error);
  }
}
setNewsData();
