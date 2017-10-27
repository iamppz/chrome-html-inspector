initHTMLElements();

var alt = false;
var ctrl = false;
var enabled = false;
// A variable stores the last mouseover HTML element,
// ctrl-alt command will show its outHTML on a layer.
var el = null;
const sourceViewer = document.getElementById('div-source-viewer');
const cover = document.getElementById('sv-cover');

document.body.addEventListener('keydown', e => {
  if (e.keyCode === 18) {
    alt = true;
  } else if (e.keyCode === 17) {
    ctrl = true;
  }
  if (enabled && ctrl && alt) {
    let rect = el.getBoundingClientRect();

    // Show the layer with el's outerHTML
    showSourceViewer();
    sourceViewer.firstChild.innerText = process(el.outerHTML);
    if ((rect.bottom + sourceViewer.clientHeight) >= window.innerHeight) {
      sourceViewer.style.top = (rect.top - sourceViewer.clientHeight + window.scrollY - 8) + 'px';
      sourceViewer.children[1].style.bottom = '-16px';
      sourceViewer.children[1].style.top = null;
      sourceViewer.children[1].style.borderBottomColor = 'transparent';
      sourceViewer.children[1].style.borderTopColor = '#999';

      sourceViewer.children[2].style.bottom = '-14px';
      sourceViewer.children[2].style.top = null;
      sourceViewer.children[2].style.borderBottomColor = 'transparent';
      sourceViewer.children[2].style.borderTopColor = 'white';
    } else {
      sourceViewer.style.top = (rect.bottom + window.scrollY + 8) + 'px';
      sourceViewer.children[1].style.top = '-16px';
      sourceViewer.children[1].style.bottom = null;
      sourceViewer.children[1].style.borderBottomColor = '#999';
      sourceViewer.children[1].style.borderTopColor = 'transparent';

      sourceViewer.children[2].style.top = '-14px';
      sourceViewer.children[2].style.bottom = null;
      sourceViewer.children[2].style.borderBottomColor = 'white';
      sourceViewer.children[2].style.borderTopColor = 'transparent';
    }
    sourceViewer.style.left = ((rect.left + rect.right) / 2 - (500 / 2)) + 'px';
    let sub = sourceViewer.getBoundingClientRect().right - document.body.clientWidth
    if (sub >= 0) {
      sourceViewer.style.left = null;
      sourceViewer.style.right = 0;
    }

    sourceViewer.children[1].style.left = ((sub >= 0 ? sub : 0) + 242) + 'px';
    sourceViewer.children[2].style.left = ((sub >= 0 ? sub : 0) + 243) + 'px';

    // Cover the element with a translucent div
    cover.style.top = (rect.top + window.scrollY) + 'px';
    cover.style.left = (rect.left) + 'px';
    cover.style.width = rect.width + 'px';
    cover.style.height = rect.height + 'px';
    cover.style.display = 'block';
  }
});

function showSourceViewer() {
  sourceViewer.style.top = null;
  sourceViewer.style.left = null;
  sourceViewer.style.right = null;
  sourceViewer.style.display = 'block';
}

document.body.addEventListener('keyup', e => {
  if (e.keyCode === 18) {
    alt = false;
  } else if (e.keyCode === 17) {
    ctrl = false;
  }
  if (!ctrl || !alt) {
    // sourceViewer.style.display = 'none';
    // cover.style.display = 'none';
  }
});

document.body.addEventListener('mouseover', e => {
  el = e.target;
});

function process(str) {
  var div = document.createElement('div');
  div.innerHTML = str.trim();
  return format(div, 0).innerHTML;
}

function format(node, level) {
  var indentBefore = new Array(level++ + 1).join('  '),
    indentAfter = new Array(level - 1).join('  '),
    textNode;
  for (var i = 0; i < node.children.length; i++) {
    textNode = document.createTextNode('\n' + indentBefore);
    node.insertBefore(textNode, node.children[i]);
    format(node.children[i], level);
    if (node.lastElementChild == node.children[i]) {
      textNode = document.createTextNode('\n' + indentAfter);
      node.appendChild(textNode);
    }
  }

  return node;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Receive message: ' + request.enabled);
  enabled = request.enabled;
  sendResponse({
    status: 'ok'
  });
});

function initHTMLElements() {
  // Append source viewer panel to body
  let div = document.createElement('div');
  div.id = 'div-source-viewer';
  div.classList.add('source-viewer');

  // HTML content container
  div.appendChild(document.createElement('div'));

  // Outer pointer
  let i = document.createElement('i');
  i.classList.add('sv-pointer');
  div.appendChild(i);

  // Inner pointer
  i = document.createElement('i')
  i.classList.add('sv-pointer');
  div.appendChild(i);
  document.body.appendChild(div);

  // Cover
  div = document.createElement('div');
  div.classList.add('sv-cover');
  document.body.appendChild(div);
}