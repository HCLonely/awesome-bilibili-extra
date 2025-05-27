// ==UserScript==
// @name         Awesome Bilibili Filter
// @namespace    awesome-bilibili-extra
// @version      0.1
// @description  项目过滤
// @author       HCLonely
// @include      /https:\/\/github\.com\/search\?.*q=bili.*/
// @include      *://github.com/*
// @include      https://greasyfork.org/zh-CN/scripts/by-site/bilibili.com*
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.1/dayjs.min.js
// ==/UserScript==

(async function () {
  'use strict';
  if (!/^\/search/.test(window.location.pathname)) {
    // add list item
    const ul = document.querySelector('#repository-details-container > ul');
    if (!ul) return;
    const newLi = document.createElement('li');
    const div = document.createElement('div');
    const link = document.createElement('a');
    div.setAttribute('data-view-component', 'true');
    div.className = 'BtnGroup d-flex';
    link.id = 'git-info-button';
    link.textContent = 'Info';
    link.className = 'btn-sm btn BtnGroup-item';
    div.appendChild(link);
    newLi.appendChild(div);
    ul.insertBefore(newLi, ul.firstChild);
    newLi.addEventListener('click', async function (event) {
      const info = `- name: ${document.querySelector('article h1').innerText || window.location.pathname.split('/')[2]}
  link: ${window.location.pathname.split('/').slice(1, 3).join('/') }
  from: github
  description: ${document.querySelector('#repo-content-pjax-container div.Layout-sidebar.rgh-sticky-sidebar-container div.BorderGrid-cell p').innerText}
  icon:
    - `;
      try {
        await navigator.clipboard.writeText(info);
        alert('已成功复制到剪贴板 📋');
      } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = info;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          alert('已成功复制到剪贴板 📋');
        } catch (error) {
          alert('复制失败，请手动复制 ❌');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    });
    return;
  }
  let addedItem = __addedItem__;
  if (window.location.host === 'github.com') $('[data-testid="results-list"]>div').filter((i, e) => $(e).find('span.search-match').length < 2 || ($(e).find('span[data-component="buttonContent"]').text().includes('Unstar') && !$(e).find('a').attr('href').includes('HCLonely/awesome-bilibili-extra'))).hide();
  if (window.location.host === 'greasyfork.org') $('#browse-script-list>li').filter((i, e) => addedItem.includes($(e).find('a.script-link').attr('href').match(/https:\/\/greasyfork.org\/.+?\/scripts\/([\d]+?)-/)?.[1])).hide();
  const observer = new MutationObserver(function () {
    if (window.location.host === 'github.com') $('[data-testid="results-list"]>div').filter((i, e) => $(e).find('span.search-match').length < 2 || ($(e).find('span[data-component="buttonContent"]').text().includes('Unstar') && !$(e).find('a').attr('href').includes('HCLonely/awesome-bilibili-extra')) || (addedItem.includes($(e).find('a').attr('href')))).hide();
    if (window.location.host === 'greasyfork.org') $('#browse-script-list>li').filter((i, e) => addedItem.includes($(e).find('a.script-link').attr('href').match(/https:\/\/greasyfork.org\/.+?\/scripts\/([\d]+?)-/)?.[1])).hide();
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

})();
