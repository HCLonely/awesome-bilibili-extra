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

  const uniquedLinks = new Set(items.map(e => e.link));
  if (items.length > uniquedLinks.size) {
    console.table(items.map(e => {
      if (uniquedLinks.has(e.link)) {
        uniquedLinks.delete(e.link)
        return null;
      }
      return e;
    }).filter(e => e));
    throw new Error('存在重复链接，请检查数据文件');
  }
})();
