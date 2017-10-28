initHTMLElements();

var alt = false;
var ctrl = false;
var enabled = false;
// A variable stores the last mouseover HTML element,
// ctrl-alt command will show its outHTML on a layer.
var el = null;
const sourceViewer = document.getElementById('div-source-viewer');
const cover = document.getElementById('sv-cover');
const outerPointer = document.getElementsByClassName('sv-pointer outer')[0];
const innerPointer = document.getElementsByClassName('sv-pointer inner')[0];

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
    if ((rect.bottom + sourceViewer.clientHeight) >= window.innerHeight - 8) {
      sourceViewer.style.top = (rect.top - sourceViewer.clientHeight + window.scrollY - 8) + 'px';
      sourceViewer.classList.add('up');
      sourceViewer.classList.remove('down');
    } else {
      sourceViewer.style.top = (rect.bottom + window.scrollY + 8) + 'px';
      sourceViewer.classList.add('down');
      sourceViewer.classList.remove('up');
    }

    if (rect.left < document.body.clientWidth / 2) {
      sourceViewer.classList.add('left');
      sourceViewer.classList.remove('right');
      sourceViewer.style.left = rect.left + 'px';
      sourceViewer.style.right = null;
    } else {
      sourceViewer.classList.add('right');
      sourceViewer.classList.remove('left');
      sourceViewer.style.left = null;
      sourceViewer.style.right = (document.body.clientWidth - rect.right) + 'px';
    }

    // Cover the element with a translucent div
    cover.style.top = (rect.top + window.scrollY) + 'px';
    cover.style.left = (rect.left) + 'px';
    cover.style.width = rect.width + 'px';
    cover.style.height = rect.height + 'px';
    cover.style.display = 'block';
  }
});

function showSourceViewer() {
  sourceViewer.style.top = sourceViewer.style.left = sourceViewer.right = null;
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
  let viewer = document.createElement('div');
  viewer.id = 'div-source-viewer';
  viewer.classList.add('source-viewer');

  // HTML content container
  viewer.appendChild(document.createElement('div'));

  document.body.appendChild(viewer);

  // Cover
  let cover = document.createElement('div');
  cover.id = 'sv-cover';
  document.body.appendChild(cover);
}