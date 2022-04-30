const fs = require('fs');
const axios = require('axios');

(async () => {
  const content = fs.readFileSync('README_RAW.md').toString();

  const mainText = content.split('---')[2];
  const links = [];
  mainText.split(/(\r?\n){2}/g).map(text => {
    text = text.replace(/\r/g, '');
    if (/^- /.test(text)) {
      links.push(...text.split(/\n/g).map(e => e.match(/- \[(.*?)\]\((.*?)\)/)));
    }
    return;
  });
  const errorLinks = [];
  /*
  await Promise.all(
    links.map(link => axios.head(link).catch(error => {
      console.log(link, error);
      errorLinks.push(link);
    }))
  )
  */
  const sleep = (time) => new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time * 1000);
  });
  let i = 1;
  for (const [, name, link] of links) {
    console.log('Checking link', link);
    await axios.head(link).catch(error => {
      console.log(link, error);
      errorLinks.push({name,link});
    });
    if (i % 30 === 0) {
      await sleep(Math.floor(Math.random() * (10 - 5 + 1) + 5));
    }
    i++;
  }

  if (errorLinks.length > 0) {
    console.table(errorLinks);
    throw `${errorLinks.length} broken links were founded!`
  }

  const uniquedLinks = new Set(links.map(e => e[2]));
  if (links.length > uniquedLinks.size) {
    console.table(links.map(e => {
      if (uniquedLinks.has(e[2])) {
        uniquedLinks.delete(e[2])
        return null;
      }
      return {name: e[1], link: e[2]};
    }).filter(e => e));
    throw `Double links were founded!`
  }
})();
