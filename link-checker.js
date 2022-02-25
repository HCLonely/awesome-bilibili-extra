const fs = require('fs');
const axios = require('axios');

(async () => {
  const content = fs.readFileSync('README.md').toString();

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
  for (const [, name, link] of links) {
    console.log('Checking link', link)
    await axios.head(link).catch(error => {
      console.log(link, error);
      errorLinks.push({name,link});
    })
  }

  if (errorLinks.length > 0) {
    console.table(errorLinks);
    throw `${errorLinks.length} broken links found!`
  }
})();
