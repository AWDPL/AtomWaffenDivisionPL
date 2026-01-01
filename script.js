// Ładowanie filmów z videos.json i obsługa formularza (statycznie, bez wysyłania)
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Wczytaj filmy z videos.json
  fetch('videos.json')
    .then(res => {
      if (!res.ok) throw new Error('Brak videos.json');
      return res.json();
    })
    .then(data => renderVideos(data))
    .catch(err => {
      console.warn('Nie udało się wczytać videos.json:', err);
      // możesz wyświetlić komunikat użytkownikowi
      const container = document.getElementById('videos-list');
      if (container) container.innerHTML = '<p class="muted">Brak filmów. Dodaj plik videos.json z listą filmów.</p>';
    });

  // Formularz - prosta lokalna symulacja wysłania
  const form = document.getElementById('join-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const msgEl = document.getElementById('form-msg');
      // Tutaj możesz wysłać dane do serwera (np. Netlify Forms, Formspree) — poniżej tylko symulacja
      msgEl.textContent = 'Dziękujemy! Twoje zgłoszenie zostało zarejestrowane lokalnie (symulacja).';
      msgEl.classList.remove('muted');
      form.reset();
    });
  }
});

function renderVideos(list){
  const container = document.getElementById('videos-list');
  if (!container) return;
  if (!Array.isArray(list) || list.length === 0) {
    container.innerHTML = '<p class="muted">Brak filmów do wyświetlenia.</p>';
    return;
  }
  container.innerHTML = '';
  list.forEach(item => {
    // item: { id: "YouTubeID", title: "Tytuł", description: "..." }
    const div = document.createElement('div');
    div.className = 'video-card';
    const title = document.createElement('h4');
    title.textContent = item.title || 'Film';
    const frame = document.createElement('iframe');
    frame.setAttribute('loading', 'lazy');
    frame.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    frame.setAttribute('allowfullscreen', '');
    frame.src = `https://www.youtube.com/embed/${encodeURIComponent(item.id)}`;
    const desc = document.createElement('p');
    desc.className = 'muted';
    desc.textContent = item.description || '';
    div.appendChild(title);
    div.appendChild(frame);
    if (item.description) div.appendChild(desc);
    container.appendChild(div);
  });
}
