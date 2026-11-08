const artworkDialog = document.getElementById('artwork-dialog');
const artworkView = document.getElementById('artwork-view');
const artworkTitle = document.getElementById('artwork-title');
let artworkTrigger = null;

if (artworkDialog && typeof artworkDialog.showModal === 'function') {
  document.querySelectorAll('[data-artwork]').forEach(link => {
    link.addEventListener('click', event => {
      const original = link.querySelector('img');
      if (!original) return;
      event.preventDefault();
      artworkTrigger = link;
      const enlarged = original.cloneNode();
      enlarged.removeAttribute('width');
      enlarged.removeAttribute('height');
      enlarged.loading = 'eager';
      artworkView.replaceChildren(enlarged);
      artworkTitle.textContent = link.dataset.artworkTitle;
      artworkDialog.showModal();
    });
  });
  document.getElementById('artwork-close').addEventListener('click', () => artworkDialog.close());
  artworkDialog.addEventListener('click', event => {
    if (event.target === artworkDialog) artworkDialog.close();
  });
  artworkDialog.addEventListener('close', () => {
    artworkView.replaceChildren();
    artworkTrigger?.focus();
  });
}
