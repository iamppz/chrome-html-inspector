document.body.addEventListener('mouseover', e => {
  var sourceViewer = document.getElementById('div-source-viewer');
  if (e.altKey) {
    sourceViewer.style.display = 'block';
    sourceViewer.style.top = e.clientY + 'px';
    sourceViewer.style.left = e.clientX + 'px';
    sourceViewer.innerText = e.target.outerHTML;
  } else {
    sourceViewer.style.display = 'none';
  }
});
var div = document.createElement('div');
div.classList.add('source-viewer');
div.id = 'div-source-viewer';
div.innerHTML = 'This is source viewer';
document.body.appendChild(div);