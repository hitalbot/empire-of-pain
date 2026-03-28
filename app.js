// Empire of Pain — Visual Reading Guide
// Loads data.json, renders all sections, handles navigation + filtering

(function () {
  let data = null;

  // ---- Data Loading ----

  async function init() {
    try {
      const resp = await fetch('data.json');
      data = await resp.json();
      document.getElementById('currentChapter').textContent = data.currentChapter;
      renderCharacters(data.characters);
      renderTimeline(data.timeline);
      renderPlaces(data.places);
      renderNotes(data.notes);
      setupNavigation();
      setupFilters();
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  }

  // ---- Characters ----

  function renderCharacters(characters, filter = 'all') {
    const grid = document.getElementById('characters-grid');
    const filtered = filter === 'all'
      ? characters
      : characters.filter(c => c.generation === filter);

    grid.innerHTML = filtered.map(c => {
      const hasPhoto = !!c.photo;
      const initials = c.name.split(' ').map(w => w[0]).join('').slice(0, 2);
      const isFeatured = c.id === 'arthur-sackler';

      if (hasPhoto) {
        return `
          <div class="character-card has-photo ${isFeatured ? 'featured' : ''}"
               data-generation="${c.generation}" data-id="${c.id}">
            <div class="card-photo">
              <img src="${c.photo}" alt="${c.name}" loading="lazy">
              ${c.photoCaption ? `<div class="card-photo-caption">${c.photoCaption}</div>` : ''}
            </div>
            <div class="card-body">
              <div class="card-identity">
                <h3>${c.name}</h3>
                <div class="card-role">${c.role}</div>
                ${c.born ? `<div class="card-dates">${c.born}${c.died ? ' \u2014 ' + c.died : ''}</div>` : ''}
              </div>
              <p class="card-bio">${c.shortBio}</p>
              <ul class="card-bullets">
                ${c.bullets.map(b => `<li>${b}</li>`).join('')}
              </ul>
              <div class="card-chapter">Introduced Ch. ${c.chapter_introduced}</div>
            </div>
          </div>`;
      }

      return `
        <div class="character-card ${isFeatured ? 'featured' : ''}"
             data-generation="${c.generation}" data-id="${c.id}">
          <div class="card-header">
            <div class="card-avatar">${initials}</div>
            <div class="card-identity">
              <h3>${c.name}</h3>
              <div class="card-role">${c.role}</div>
              ${c.born ? `<div class="card-dates">${c.born}${c.died ? ' \u2014 ' + c.died : ''}</div>` : ''}
            </div>
          </div>
          <p class="card-bio">${c.shortBio}</p>
          <ul class="card-bullets">
            ${c.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
          <div class="card-chapter">Introduced Ch. ${c.chapter_introduced}</div>
        </div>`;
    }).join('');
  }

  // ---- Timeline ----

  function renderTimeline(timeline, filter = 'all') {
    const track = document.getElementById('timeline-track');
    const filtered = filter === 'all'
      ? timeline
      : timeline.filter(t => t.category === filter);

    track.innerHTML = filtered.map(t => `
      <div class="timeline-item" data-category="${t.category}">
        <div class="timeline-dot" data-category="${t.category}"></div>
        <div class="timeline-year">${t.year}</div>
        <div class="timeline-event">${t.event}</div>
        ${t.image ? `
          <div class="timeline-image">
            <img src="${t.image}" alt="${t.event}" loading="lazy">
          </div>` : ''}
        <div class="timeline-chapter">Chapter ${t.chapter}</div>
      </div>
    `).join('');
  }

  // ---- Places ----

  function renderPlaces(places) {
    if (!places || !places.length) return;
    const grid = document.getElementById('places-grid');
    grid.innerHTML = places.map(p => `
      <div class="place-card">
        <div class="place-card-image">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </div>
        <div class="place-card-body">
          <div class="place-card-name">${p.name}</div>
          <div class="place-card-caption">${p.caption}</div>
        </div>
      </div>
    `).join('');
  }

  // ---- Notes ----

  function renderNotes(notes) {
    const list = document.getElementById('notes-list');
    list.innerHTML = notes.map(n => `
      <div class="note-card">
        <div class="note-chapter-label">Chapter ${n.chapter}</div>
        <h3 class="note-title">${n.title}</h3>
        <p class="note-content">${n.content}</p>
      </div>
    `).join('');
  }

  // ---- Navigation ----

  function setupNavigation() {
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.section');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.section).classList.add('active');
      });
    });
  }

  // ---- Filters ----

  function setupFilters() {
    // Character filters
    const charSection = document.getElementById('characters');
    charSection.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        charSection.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderCharacters(data.characters, btn.dataset.filter);
      });
    });

    // Timeline filters
    const timeSection = document.getElementById('timeline');
    timeSection.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        timeSection.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTimeline(data.timeline, btn.dataset.filter);
      });
    });
  }

  // ---- Go ----
  document.addEventListener('DOMContentLoaded', init);
})();
