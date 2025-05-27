const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const pangu = require('pangu');
const { parse } = require('yaml');
const { addIcon } = require('./addIcon');

function parseMarkdownTable(md) {
  const lines = md
    .trim()
    .split('\n')
    .filter((line, i) => i > 1 && line.includes('|'));

  return lines.map(line => {
    const cols = line.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
    const [nameAndLink, description, , , extra] = cols;
    const match = nameAndLink.match(/\[(.+?)\]\(([^)]+)\)/);
    const name = match ? match[1] : '';
    const link = match ? match[2] : '';
    return name ? { name, link, description, extra } : null;
  }).filter((e) => e);
}


function processDescription(text) {
  return `${pangu.spacing(text.replace(/[？！。，；?!,;]$/, '.')).replace(/\|/g, '&#124;')}${text.endsWith('.') ? '' : '.'}`
}

function processYmlData(template) {
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
      const yamlContent = fs.readFileSync(filePath, 'utf8');
      const data = parse(yamlContent).map((e) => {
        return {
          name: e.name,
          link: `${fromLink[e.from] || ''}${e.link}`,
          description: processDescription(e.description),
          extra: addIcon(e.icon)
        };
      });
      result = [...result, ...data];

    } catch (err) {
      console.error(`Error reading ${yamlPath}:`, err);
    }
  }

  return result;
}

function diffArrays(a, b) {
  const mapA_link = new Map(a.map(item => [item.link, item]));
  const mapB_link = new Map(b.map(item => [item.link, item]));

  const changed = [];
  for (const [link, itemB] of mapB_link) {
    if (mapA_link.has(link)) {
      const itemA = mapA_link.get(link);
      if (
        itemA.name !== itemB.name ||
        itemA.description !== itemB.description ||
        itemA.extra !== itemB.extra
      ) {
        changed.push({ old: itemA, new: itemB, type: 'content-changed' });
      }
      mapA_link.delete(link);
      mapB_link.delete(link);
    }
  }

  const mapA_nd = new Map(
    [...mapA_link.values()].map(item => [`${item.name}||${item.description}`, item])
  );
  const mapB_nd = new Map(
    [...mapB_link.values()].map(item => [`${item.name}||${item.description}`, item])
  );

  for (const [ndKey, itemB] of mapB_nd) {
    if (mapA_nd.has(ndKey)) {
      const itemA = mapA_nd.get(ndKey);
      changed.push({ old: itemA, new: itemB, type: 'link-changed' });
      mapA_link.delete(itemA.link);
      mapB_link.delete(itemB.link);
    }
  }

  const added = [...mapB_link.values()];
  const removed = [...mapA_link.values()];

  return { changed: changed.filter((e) => e.name && e.link), added: added.filter((e) => e.name && e.link), removed: removed.filter((e) => e.name && e.link) };
}

const oldData = parseMarkdownTable(fs.readFileSync('README.md').toString());
const newData = processYmlData(fs.readFileSync('README_RAW.md').toString());
const { added, removed, changed } = diffArrays(oldData, newData);

const addedLog = added.length > 0 ? ('Added items:\n- ' + added.map(e => `[${e.name}](${e.link})`).join('\n- ') + '\n') : '';
const removedLog = removed.length > 0 ? ('\nRemoved items:\n- ' + removed.map(e => `[${e.name}](${e.link})`).join('\n- ') + '\n') : '';
const changedLog = changed.length > 0 ? ('\nChanged items:\n- ' + changed.map(e => `[${e.name}](${e.link})`).join('\n- ') + '\n') : '';

const message = 'docs(main): update some items\n\n' + addedLog + removedLog + changedLog;

fs.writeFileSync('CHANGELOG.md', message.replace(/\n$/, ''));
