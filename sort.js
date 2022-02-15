const fs = require('fs');

const content = fs.readFileSync('README_RAW.md').toString();

const [header, toc, mainText] = content.split('---');
const sortedMainText = mainText.split(/(\r?\n){2}/g).map(text => {
  text = text.replace(/\r/g, '');
  if (/^- /.test(text)) {
    return text.split(/\n/g).sort().join('\n');
  }
  if (/^\n$/.test(text)) {
    return '';
  }
  return text;
}).join('\n') + '\n<!-- Sort Time: ' + new Date() + '\n';

fs.writeFileSync('README.md', [header, toc, sortedMainText].join('---'));
fs.writeFileSync('message.txt', 'Sort at ' + new Date());
