const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { parse } = require('yaml');

function readData(template) {
  const regex = /\{\{\s*(RAW_DATA\/.*?\.yml)\s*\}\}/g;
  let result = [];
  let matches;
  const fromLink = {
    github: 'https://github.com/',
    greasyfork: 'https://greasyfork.org/zh-CN/scripts/'
  }
  while ((matches = regex.exec(template)) !== null) {
    const [fullMatch, yamlPath] = matches;

    try {
      const filePath = path.join(process.cwd(), yamlPath);
      const type = yamlPath.replace('RAW_DATA/', '').replace('.yml', '');
      const yamlContent = fs.readFileSync(filePath, 'utf8');
      const data = parse(yamlContent).map((e) => {
        e.type = type;
        e.link = `${fromLink[e.from] || ''}${e.link}`
        return e;
      });
      result = [...result, ...data];

    } catch (err) {
      console.error(`Error reading ${yamlPath}:`, err);
    }
  }

  return result;
}

(async () => {
  const content = fs.readFileSync('README_RAW.md').toString();
  const items = readData(content);

  const errorLinks = [];

  const sleep = (time) => new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time * 5000);
  });

  let i = 1;
  for (const { name, link, type } of items) {
    console.log('Checking link', link);
    await axios.head(link, {
      maxRedirects: 0,
      validateStatus: (status) => {
        return (status >= 200 && status < 300) || status === 429;
      }
    }).catch(error => {
      if (!error.response?.headers?.location?.includes(link)) {
        console.log(link, error);
        errorLinks.push({ name, link, type });
      }
    });
    if (i % 10 === 0) {
      await sleep(Math.floor(Math.random() * (10 - 5 + 1) + 5));
    }
    i++;
  }

  if (errorLinks.length > 0) {
    console.error(`\n${errorLinks.length} broken links were founded!\n`);
    console.table(errorLinks);
  }
  await sleep(1);
  const uniquedLinks = new Set(items.map(e => e.link));
  if (items.length > uniquedLinks.size) {
    console.error(`\nDouble links were founded!`);
    console.table(items.map(e => {
      if (uniquedLinks.has(e.link)) {
        uniquedLinks.delete(e.link)
        return null;
      }
      return e;
    }).filter(e => e));
  }
})();
