const fs = require('fs');
const { execSync } = require('child_process');

const addedItems = {};
const removedItems = {};
const changedNames = [];
const diffText = execSync('git diff README_RAW.md').toString();
const addedNames = new Set(diffText.split('\n').filter(e => /^\+- \[/.test(e)).map(e => {
  const [, name, link] = e.match(/^\+- \[(.+?)\]\((.+?)\)/);
  addedItems[name] = link;
  return name;
}));
const removedNames = diffText.split('\n').filter(e => /^-- \[/.test(e)).map(e => {
  const [, name, link] = e.match(/^-- \[(.+?)\]\((.+?)\)/);
  removedItems[name] = link;
  if (addedNames.has(name)) {
    addedNames.delete(name);
    changedNames.push(name);
    return null;
  }
  return name;
}).filter(e => e);

const addedLog = addedNames.size > 0 ? ('Added items:\n- ' + [...addedNames].map(e => `[${e}](${addedItems[e]})`).join('\n- ') + '\n') : '';
const removedLog = removedNames.length > 0 ? ('\nRemoved items:\n- ' + removedNames.map(e => `[${e}](${removedItems[e]})`).join('\n- ') + '\n') : '';
const changedLog = changedNames.length > 0 ? ('\nChanged items:\n- ' + changedNames.map(e => `[${e}](${addedItems[e]})`).join('\n- ') + '\n') : '';

const message = 'docs(main): update some items\n\n' + addedLog + removedLog + changedLog;

fs.writeFileSync('CHANGELOG.md', message.replace(/\n$/, ''));
