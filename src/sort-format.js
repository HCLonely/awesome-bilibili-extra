const fs = require('fs');
const path = require('path');
const pangu = require('pangu');
const dayjs = require('dayjs');
const { parse } = require('yaml');
const { addIcon } = require('./addIcon');

const content = fs.readFileSync('README_RAW.md').toString();
const time = dayjs().format('YYYY-MM-DD HH:mm:ss Z');

function addStar(from, link) {
  if (from === 'github') {
    return `![Star](https://img.shields.io/github/stars/${link}?&label=)`;
  }
  if (from === 'greasyfork') {
    return `![总安装量](https://img.shields.io/badge/dynamic/regex?url=https%3A%2F%2Fgreasyfork.org%2Fen%2Fscripts%2F${link}&search=%3Cdd%20class%3D%22script-show-total-installs%22%3E%3Cspan%3E(.%2B%3F)%3C%2Fspan%3E%3C%2Fdd%3E&replace=%241&style=social&logo=greasyfork&label=%20)`;
  }
  return '';
}

function addLastCommit(from, link) {
  if (from === 'github') {
    return `![最近更新](https://img.shields.io/github/last-commit/${link}?label=)`;
  }
  if (from === 'greasyfork') {
    return `![最近更新](https://img.shields.io/badge/dynamic/regex?url=https%3A%2F%2Fgreasyfork.org%2Fen%2Fscripts%2F${link}&search=%3Cdd%20class%3D%22script-(list%7Cshow)-updated-date%22%3E%3Cspan%3E%3Crelative-time.*%3F%3E(.*%3F)%3C%2Frelative-time%3E%3C%2Fspan%3E%3C%2Fdd%3E&replace=%242&style=flat&label=)`;
  }
  return '';
}

function processDescription(text) {
  return `${pangu.spacing(text.replace(/[？！。，；?!,;]$/, '.')).replace(/\|/g, '&#124;')}${text.endsWith('.') ? '' : '.'}`
}

function processTemplate(template) {
  const regex = /\{\{\s*(RAW_DATA\/.*?\.yml)\s*\}\}/g;
  let result = template;
  let matches;

  while ((matches = regex.exec(template)) !== null) {
    const [fullMatch, yamlPath] = matches;

    try {
      const filePath = path.join(process.cwd(), yamlPath);
      const yamlContent = fs.readFileSync(filePath, 'utf8');
      const data = parse(yamlContent);
      const generatedContent = generateTable(data);

      result = result.replace(fullMatch, generatedContent);
    } catch (err) {
      console.error(`Error processing ${yamlPath}:`, err);
      result = result.replace(fullMatch, `⚠️ Error loading ${yamlPath}`);
    }
  }

  return result;
}

function generateMarkdown(name, link, description, icons, stars, lastCommit) {
  return `| [${name}](${link}) | ${description} | ${icons} | ${stars} | ${lastCommit} |`;
}

function generateTable(info) {
  const fromLink = {
    github: 'https://github.com/',
    greasyfork: 'https://greasyfork.org/zh-CN/scripts/'
  }
  const tbody = info.map(({name, link, from, description, icon}) => {
    return generateMarkdown(name, `${fromLink[from] || ''}${link}`, processDescription(description), addStar(from, link), addLastCommit(from, link), addIcon(icon));
  }).sort().join('\n');
  return `| 项目名称&地址 | 项目描述 | Star/安装 | 最近更新 | 备注 |
|:--- |:--- |:--- |:--- |:--- |
${tbody}`;
}

fs.writeFileSync('README.md', processTemplate(content));

// todo: user.js
