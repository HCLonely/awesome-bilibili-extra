// ==UserScript==
// @name         Awesome Bilibili Filter
// @namespace    awesome-bilibili-extra
// @version      0.1
// @description  项目过滤
// @author       HCLonely
// @include      /https:\/\/github\.com\/search\?.*q=bili.*/
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.1/dayjs.min.js
// ==/UserScript==

(async function () {
  'use strict';
  const addedItemTemp = GM_getValue('temp') || {};
  let { addedItem } = addedItemTemp;
  if (addedItemTemp.updateTime !== dayjs().format('YYYY-MM-DD')) {
    addedItem = await getAddedItem();
    if (addedItem.length > 0) {
      GM_setValue('temp', {
        updateTime: dayjs().format('YYYY-MM-DD'),
        addedItem
      })
    }
  }
  $('.repo-list-item').filter((i, e) => $(e).find('p').length === 0 || addedItem.includes(new URL($(e).find('a').attr('href'), 'https://github.com/').href)).remove();
  const observer = new MutationObserver(function () {
    $('.repo-list-item').filter((i, e) => $(e).find('p').length === 0 || addedItem.includes(new URL($(e).find('a').attr('href'), 'https://github.com/').href)).remove();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  function getAddedItem () {
    return new Promise((resolve) => {
      $.ajax({
        url: 'https://raw.githubusercontent.com/HCLonely/awesome-bilibili-extra/main/README.md',
        method: 'GET',
        success: (data) => {
          const mainText = data.split('---')[2];
          const links = [];
          mainText.split(/(\r?\n){2}/g).map(text => {
            text = text.replace(/\r/g, '');
            if (/^- /.test(text)) {
              links.push(...text.split(/\n/g).map(e => e.match(/- \[.*?\]\((.*?)\)/)?.[1]));
            }
            return;
          });
          resolve([...new Set(links.filter((e) => e))]);
        },
        error: () => { resolve([]); }
      })
    })
  }
})();
