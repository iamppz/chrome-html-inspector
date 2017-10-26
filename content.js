// Append source viewer panel to body
var div = document.createElement('div');
div.id = 'div-source-viewer';
div.classList.add('source-viewer');
div.appendChild(document.createElement('div'));
document.body.appendChild(div);

var cover = document.createElement('div');
cover.classList.add('cover');
document.body.appendChild(cover);

var alt = false;
var ctrl = false;
var enabled = false;
// A variable stores the last mouseover HTML element,
// ctrl-alt command will show its outHTML on a layer.
var el = null;

document.body.addEventListener('keydown', e => {
  if (e.keyCode === 18) {
    alt = true;
  } else if (e.keyCode === 17) {
    ctrl = true;
  }
  if (enabled && ctrl && alt) {
    let rect = el.getBoundingClientRect();
    
    // Show the layer with el's outerHTML
    let sourceViewer = document.getElementById('div-source-viewer');
    sourceViewer.firstChild.innerText = process(el.outerHTML);
    if ((rect.bottom + sourceViewer.clientHeight) >= window.innerHeight) {
      sourceViewer.style.top = (rect.top - sourceViewer.clientHeight + window.scrollY) + 'px';
    } else {
      sourceViewer.style.top = (rect.bottom + window.scrollY) + 'px';
    }
    if ((rect.left + sourceViewer.clientWidth) >= document.body.clientWidth) {
      sourceViewer.style.left = (rect.right - sourceViewer.clientWidth) + 'px';
    } else {
      sourceViewer.style.left = rect.left + 'px';
    }
    sourceViewer.style.display = 'block';

    // Cover the element with a translucent div
    let cover = document.getElementsByClassName('cover')[0];
    cover.style.top = (rect.top + window.scrollY) + 'px';
    cover.style.left = (rect.left) + 'px';
    console.log(rect);
    cover.style.width = rect.width + 'px';
    cover.style.height = rect.height + 'px';
    cover.style.display = 'block';
  }
});

document.body.addEventListener('keyup', e => {
  if (e.keyCode === 18) {
    alt = false;
  } else if (e.keyCode === 17) {
    ctrl = false;
  }
  if (!ctrl || !alt) {
    let sourceViewer = document.getElementById('div-source-viewer');
    sourceViewer.style.display = 'none';
    let cover = document.getElementsByClassName('cover')[0];
    cover.style.display = 'none';
  }
});

document.body.addEventListener('mouseover', e => {
  let sourceViewer = document.getElementById('div-source-viewer');
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

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('Receive message: ' + request.enabled);
    enabled = request.enabled;
    sendResponse({status: 'ok'});
  });