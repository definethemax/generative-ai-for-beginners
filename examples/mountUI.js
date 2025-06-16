// Example script demonstrating mounting two bars with the same styles
// but different ids. Each bar contains buttons generated from the
// global `prompts` array.

function createBar(id) {
  const bar = document.createElement('div');
  bar.id = id;
  bar.style.display = 'flex';
  bar.style.flexDirection = 'column';
  bar.style.gap = '8px';
  bar.style.padding = '10px';
  bar.style.background = '#fff';
  bar.style.border = '1px solid #ccc';
  bar.style.borderRadius = '10px';
  bar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
  bar.style.transition = 'opacity 0.2s ease';

  prompts.forEach((item) => {
    const btn = document.createElement('button');
    btn.textContent = item.label;
    btn.style.fontSize = '14px';
    btn.style.padding = '8px 12px';
    btn.style.border = '1px solid #ddd';
    btn.style.borderRadius = '8px';
    btn.style.background = '#fff';
    btn.style.cursor = 'pointer';
    btn.style.textAlign = 'left';
    btn.style.transition = 'background 0.2s ease';
    btn.onmouseenter = () => btn.style.background = '#f2f2f2';
    btn.onmouseleave = () => btn.style.background = '#fff';

    btn.onclick = () => {
      const finalText = item.text + '\n\n';
      navigator.clipboard.writeText(finalText);
      const editor = document.querySelector('[contenteditable="true"]');
      if (editor) {
        editor.focus();
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);
        const success = document.execCommand('insertText', false, finalText);
        if (!success) editor.innerText += finalText;
        editor.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        alert('未找到 contenteditable 输入区');
      }
    };

    bar.appendChild(btn);
  });

  return bar;
}

function mountUI(relativeElement) {
  const wrapper = document.createElement('div');
  wrapper.id = 'my-chatgpt-injector';
  wrapper.style.position = 'absolute';
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '8px';
  wrapper.style.zIndex = '999999';

  const toggle = document.createElement('button');
  toggle.style.fontSize = '14px';
  toggle.style.border = 'none';
  toggle.style.background = '#eee';
  toggle.style.borderRadius = '8px';
  toggle.style.cursor = 'pointer';
  toggle.style.padding = '4px 8px';
  toggle.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';

  const setToggleState = (visible) => {
    toggle.textContent = visible ? '▲' : '▼';
  };

  // Create two bars with the same styles but different ids
  const bar1 = createBar('my-chatgpt-bar1');
  const bar2 = createBar('my-chatgpt-bar2');

  let visible = true;
  toggle.onclick = () => {
    visible = !visible;
    bar1.style.display = bar2.style.display = visible ? 'flex' : 'none';
    setToggleState(visible);
  };

  setToggleState(true);
  wrapper.appendChild(toggle);
  wrapper.appendChild(bar1);
  wrapper.appendChild(bar2);
  document.body.appendChild(wrapper);

  function position() {
    const rect = relativeElement.getBoundingClientRect();
    const barsHeight = bar1.offsetHeight + bar2.offsetHeight;
    wrapper.style.top = `${window.scrollY + rect.top - barsHeight + 70}px`;
    wrapper.style.left = `${window.scrollX + rect.left - 200}px`;
  }

  position();
  window.addEventListener('resize', position);
  window.addEventListener('scroll', position);
}

export { mountUI };
