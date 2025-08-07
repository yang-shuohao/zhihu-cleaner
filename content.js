let blockerEnabled = true;
let blockedCount = 0;

function isMarketingLink(href) {
  return href && [
    'xen/market',
    'promotion-activities',
    'education_channel_code',
    'edu_card_id',
    'edu_click_id',
    '/edu/',
    'training/promotion'
  ].some(key => href.includes(key));
}

function isMarketingText(text) {
  return text && [
    '训练营', '推广', '了解更多', '报名学习',
    '助教', '点击查看', '课程介绍'
  ].some(key => text.includes(key));
}

function hideMarketingElements() {
  if (!blockerEnabled) return;

  let hideCount = 0;

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    const text = a.innerText || '';
    if (isMarketingLink(href) && isMarketingText(text)) {
      const block = a.closest('.List-item, .Card, .AnswerItem, article, .TopstoryItem');
      if (block && !block.getAttribute('data-hidden-by-plugin')) {
        block.style.display = 'none';
        block.setAttribute('data-hidden-by-plugin', '1');
        hideCount++;
      }
    }
  });

  document.querySelectorAll('[class*="EduCard"], [class*="edu-card"], [class*="TrainingCard"]').forEach(el => {
    const block = el.closest('.List-item, .Card, .AnswerItem, article, .TopstoryItem');
    if (block && !block.getAttribute('data-hidden-by-plugin')) {
      block.style.display = 'none';
      block.setAttribute('data-hidden-by-plugin', '1');
      hideCount++;
    }
  });

  if (hideCount > 0) {
    blockedCount += hideCount;
    updateToggleText();
    console.log(`[知乎屏蔽插件] 屏蔽了 ${hideCount} 项内容，总计 ${blockedCount}`);
  }
}

function createToggleButton() {
  const btn = document.createElement('div');
  btn.id = 'zhihu-blocker-toggle';
  btn.textContent = '知乎屏蔽：加载中...';
  btn.onclick = () => {
    blockerEnabled = !blockerEnabled;
    updateToggleText();
    localStorage.setItem('zhihuBlockerEnabled', blockerEnabled ? '1' : '0');
    if (blockerEnabled) hideMarketingElements();
    location.reload();
  };
  document.body.appendChild(btn);
}

function updateToggleText() {
  const btn = document.getElementById('zhihu-blocker-toggle');
  if (!btn) return;
  if (blockerEnabled) {
    btn.textContent = `✅ 正在屏蔽（${blockedCount}）`;
  } else {
    btn.textContent = `❌ 已关闭屏蔽`;
  }
}

// 初始化开关状态
(function initBlocker() {
  blockerEnabled = localStorage.getItem('zhihuBlockerEnabled') !== '0';
  createToggleButton();
  updateToggleText();
  hideMarketingElements();
})();

// 监听 DOM 动态变化
const observer = new MutationObserver(() => {
  hideMarketingElements();
});
observer.observe(document.body, { childList: true, subtree: true });
