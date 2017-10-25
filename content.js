var alt = false;
var ctrl = false;
// A variable stores the last mouseover HTML element,
// ctrl-alt command will show its outHTML on a layer.
var el = null;

document.body.addEventListener('keydown', e => {
  if (e.keyCode === 18) {
    alt = true;
  } else if (e.keyCode === 17) {
    ctrl = true;
  }
  if (ctrl && alt) {
    // Show the layer with el's outerHTML
    let sourceViewer = document.getElementById('div-source-viewer');
    sourceViewer.style.display = 'block';
    sourceViewer.firstChild.innerText = process(el.outerHTML);
    let rect = el.getBoundingClientRect();
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
  }
});

document.body.addEventListener('mouseover', e => {
  let sourceViewer = document.getElementById('div-source-viewer');
  el = e.target;
});

// Append source viewer panel to body
var div = document.createElement('div');
var childDiv = document.createElement('div');
div.appendChild(childDiv);
div.classList.add('source-viewer');
div.id = 'div-source-viewer';
div.firstChild.innerHTML = 'This is source viewer';
document.body.appendChild(div);

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