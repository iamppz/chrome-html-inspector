var alt = false;
var ctrl = false;
var el = null;

document.body.addEventListener('keydown', e => {
  if (e.keyCode === 18) {
    alt = true;
  } else if (e.keyCode === 17) {
    ctrl = true;
  }
  if (ctrl && alt) {
    let sourceViewer = document.getElementById('div-source-viewer');
    sourceViewer.style.display = 'block';
    var rect = el.getBoundingClientRect();
    if ((rect.bottom + sourceViewer.clientHeight) >= window.innerHeight) {
      sourceViewer.style.top = (rect.top - sourceViewer.clientHeight + window.scrollY) + 'px';
    } else {
      sourceViewer.style.top = (rect.bottom + window.scrollY) + 'px';
    }
    if ((rect.left + 360) >= document.body.clientWidth) {
      sourceViewer.style.left = (rect.right - 360) + 'px';
    } else {
      sourceViewer.style.left = rect.left + 'px';
    }
    sourceViewer.firstChild.innerText = el.outerHTML;
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
    // sourceViewer.style.display = 'none';
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