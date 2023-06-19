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
  let addedItem = ["https://greasyfork.org/zh-CN/scripts/428453","https://greasyfork.org/zh-CN/scripts/395575","https://greasyfork.org/zh-CN/scripts/441403","https://greasyfork.org/zh-CN/scripts/422227","https://greasyfork.org/zh-CN/scripts/438461","https://greasyfork.org/zh-CN/scripts/374894","https://greasyfork.org/zh-CN/scripts/395456","https://greasyfork.org/zh-CN/scripts/368446","https://greasyfork.org/zh-CN/scripts/411092","https://greasyfork.org/zh-CN/scripts/437528","https://greasyfork.org/zh-CN/scripts/408526","https://greasyfork.org/zh-CN/scripts/378513","https://greasyfork.org/zh-CN/scripts/425696","https://greasyfork.org/zh-CN/scripts/429152","https://greasyfork.org/zh-CN/scripts/396032","https://greasyfork.org/zh-CN/scripts/432283","https://greasyfork.org/zh-CN/scripts/413228","https://greasyfork.org/zh-CN/scripts/384723","https://greasyfork.org/zh-CN/scripts/30367","https://greasyfork.org/zh-CN/scripts/428895","https://greasyfork.org/zh-CN/scripts/372289","https://greasyfork.org/zh-CN/scripts/428222","https://greasyfork.org/zh-CN/scripts/429205","https://greasyfork.org/zh-CN/scripts/398500","https://greasyfork.org/zh-CN/scripts/437941","https://greasyfork.org/zh-CN/scripts/398655","https://greasyfork.org/zh-CN/scripts/428342","https://greasyfork.org/zh-CN/scripts/428746","https://greasyfork.org/zh-CN/scripts/25718","https://greasyfork.org/zh-CN/scripts/439169","https://greasyfork.org/zh-CN/scripts/406048","https://greasyfork.org/zh-CN/scripts/435623","https://greasyfork.org/zh-CN/scripts/429846","https://greasyfork.org/zh-CN/scripts/21416","https://greasyfork.org/zh-CN/scripts/387120","https://greasyfork.org/zh-CN/scripts/368635","https://greasyfork.org/zh-CN/scripts/416768","https://greasyfork.org/zh-CN/scripts/418195"];
  if (window.location.host === 'github.com') $('[data-testid="results-list"]>div').filter((i, e) => $(e).find('span.search-match').length < 2 || ($(e).find('span[data-component="buttonContent"]').text().includes('Unstar') && !$(e).find('a').attr('href').includes('HCLonely/awesome-bilibili-extra'))).hide();
  if (window.location.host === 'greasyfork.org') $('#browse-script-list>li').filter((i, e) => addedItem.includes($(e).find('a.script-link').attr('href').match(/(https:\/\/greasyfork.org\/zh-CN\/scripts\/[\d]+?)-/)?.[1])).hide();
  const observer = new MutationObserver(function () {
    if (window.location.host === 'github.com') $('[data-testid="results-list"]>div').filter((i, e) => $(e).find('span.search-match').length < 2 || ($(e).find('span[data-component="buttonContent"]').text().includes('Unstar') && !$(e).find('a').attr('href').includes('HCLonely/awesome-bilibili-extra'))).hide();
    if (window.location.host === 'greasyfork.org') $('#browse-script-list>li').filter((i, e) => addedItem.includes($(e).find('a.script-link').attr('href').match(/(https:\/\/greasyfork.org\/zh-CN\/scripts\/[\d]+?)-/)?.[1])).hide();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
