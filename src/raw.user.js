// ==UserScript==
// @name         Awesome Bilibili Filter
// @namespace    awesome-bilibili-extra
// @version      0.1
// @description  项目过滤
// @author       HCLonely
// @include      /https:\/\/github\.com\/search\?.*q=bili.*/
// @include      https://greasyfork.org/zh-CN/scripts/by-site/bilibili.com*
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.1/dayjs.min.js
// ==/UserScript==

(async function () {
  'use strict';
  let addedItem = __addedItem__;
  if (window.location.host === 'github.com') $('[data-testid="results-list"]>div').filter((i, e) => $(e).find('span.search-match').length < 2 || ($(e).find('span[data-component="buttonContent"]').text().includes('Unstar') && !$(e).find('a').attr('href').includes('HCLonely/awesome-bilibili-extra'))).hide();
  if (window.location.host === 'greasyfork.org') $('#browse-script-list>li').filter((i, e) => addedItem.includes($(e).find('a.script-link').attr('href').match(/(https:\/\/greasyfork.org\/zh-CN\/scripts\/[\d]+?)-/)?.[1])).hide();
  const observer = new MutationObserver(function () {
    if (window.location.host === 'github.com') $('[data-testid="results-list"]>div').filter((i, e) => $(e).find('span.search-match').length < 2 || ($(e).find('span[data-component="buttonContent"]').text().includes('Unstar') && !$(e).find('a').attr('href').includes('HCLonely/awesome-bilibili-extra')) || (addedItem.includes($(e).find('a').attr('href')))).hide();
    if (window.location.host === 'greasyfork.org') $('#browse-script-list>li').filter((i, e) => addedItem.includes($(e).find('a.script-link').attr('href').match(/(https:\/\/greasyfork.org\/zh-CN\/scripts\/[\d]+?)-/)?.[1])).hide();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
