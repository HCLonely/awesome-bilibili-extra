const fs = require('fs');

const rawDate = fs.readFileSync('./src/raw.user.js').toString();
const links = [];
const items = fs.readFileSync('./README.md').toString().split('---')[2].split(/(\r?\n){2}/g).forEach(text => {
  text = text.replace(/\r/g, '');
  if (/^- /.test(text)) {
    links.push(...text.split(/\n/g).map(e => e.match(/- \[(.*?)\]\((.*?)\)/)[2]));
  }
});
fs.writeFileSync('./src/user.js', rawDate.replace('__addedItem__', `["${links.join('","')}"]`));
// console.log(links);
