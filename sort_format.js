const fs = require('fs');
const pangu = require('pangu');

const content = fs.readFileSync('README_RAW.md').toString();

const [header, toc, mainText] = content.split('---');
const sortedMainText = mainText.split(/(\r?\n){2}/g).map(text => {
  text = text.replace(/\r/g, '');
  if (/^- /.test(text)) {
    return text.split(/\n/g).map(e => {
      const newText = e.replace(/^- \[(\S)/, s => s.toUpperCase()).replace(/[？！。，；?!,;]$/, '.');
      return pangu.spacing(/\.$/.test(newText) ? newText : `${newText}.`);
    }).sort().join('\n');
  }
  if (/^\n$/.test(text)) {
    return '';
  }
  return text;
}).join('\n') + '\n<!-- Sort Time: ' + new Date() + '\n';

fs.writeFileSync('README.md', [header, toc, sortedMainText].join('---'));
fs.writeFileSync('message.txt', 'Sort at ' + new Date());
