async function setNewsData() {
  const newsArea = document.getElementById("newsData");
  try {
    const response = await fetch("http://127.0.0.1:5500/news");
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
setNewsData();
