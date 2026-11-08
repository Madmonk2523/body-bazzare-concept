const artworkDialog = document.getElementById('artwork-dialog');
const artworkView = document.getElementById('artwork-view');
const artworkTitle = document.getElementById('artwork-title');
const artworkLinks = [...document.querySelectorAll('[data-artwork]')];
const artworkSource = document.getElementById('artwork-source');
let artworkTrigger = null;
let artworkIndex = 0;

function showArtwork(index) {
  artworkIndex = (index + artworkLinks.length) % artworkLinks.length;
  const link = artworkLinks[artworkIndex];
  const enlarged = link.querySelector('img').cloneNode();
  enlarged.removeAttribute('width');
  enlarged.removeAttribute('height');
  enlarged.loading = 'eager';
  artworkView.replaceChildren(enlarged);
  artworkTitle.textContent = link.dataset.artworkTitle;
  document.getElementById('artwork-count').textContent = `${artworkIndex + 1} / ${artworkLinks.length}`;
  artworkSource.hidden = !link.dataset.source;
  if (link.dataset.source) artworkSource.href = link.dataset.source;
  else artworkSource.removeAttribute('href');
}

if (artworkDialog && typeof artworkDialog.showModal === 'function') {
  artworkLinks.forEach((link, index) => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      artworkTrigger = link;
      showArtwork(index);
      artworkDialog.showModal();
    });
  });
  document.getElementById('artwork-close').addEventListener('click', () => artworkDialog.close());
  document.getElementById('artwork-prev').addEventListener('click', () => showArtwork(artworkIndex - 1));
  document.getElementById('artwork-next').addEventListener('click', () => showArtwork(artworkIndex + 1));
  artworkDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showArtwork(artworkIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  artworkDialog.addEventListener('click', event => {
    const box = artworkDialog.getBoundingClientRect();
    if (event.target === artworkDialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) artworkDialog.close();
  });
  artworkDialog.addEventListener('close', () => {
    artworkView.replaceChildren();
    artworkTrigger?.focus({ preventScroll: true });
  });
}
