const $newsArea = document.querySelectorAll('#news-list li');

async function setNewsData() {
  try {
    const response = await fetch('https://port-0-diseasemap-test-1pgyr2mlvlp2ppo.sel5.cloudtype.app/news');
    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}

setNewsData();