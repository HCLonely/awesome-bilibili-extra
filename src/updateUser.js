const fs = require('fs');
const path = require('path');
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
      const data = parse(yamlContent).map((e) => e.link);
      result = [...result, ...data];

    } catch (err) {
      console.error(`Error reading ${yamlPath}:`, err);
    }
  }

  return result;
}

const rawDate = fs.readFileSync('./src/raw.user.js').toString();
const links = readData(fs.readFileSync('./README_RAW.md').toString());
fs.writeFileSync('./src/user.js', rawDate.replace('__addedItem__', `["${links.join('","')}"]`));
// console.log(links);
