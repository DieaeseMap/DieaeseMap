const $newsArea = document.querySelectorAll('#news-list li');

async function setNewsData() {
  try {
    const response = await fetch('http://127.0.0.1:5500/news');
    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}

setNewsData();