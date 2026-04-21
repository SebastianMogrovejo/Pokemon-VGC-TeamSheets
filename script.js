const POKEMON_COUNT = 6;

const STATS = ['Level', 'HP', 'Atk', 'Def', 'Sp. Atk', 'Sp. Def', 'Speed'];

function buildPokemonCards() {
  const grid = document.getElementById('pokemonGrid');
  for (let i = 0; i < POKEMON_COUNT; i++) {
    grid.innerHTML += `
      <div class="pokemon-card">
        <div class="pokemon-card-header">
          <span class="label">Pokémon</span>
          <input type="text" placeholder="Name" data-pokemon="${i}" data-field="name" />
        </div>
        <div class="pokemon-card-body">
          <div class="pokemon-fields">
            <div class="pokemon-row">
              <span class="row-label">Tera Type</span>
              <input type="text" placeholder="" data-pokemon="${i}" data-field="tera" />
            </div>
            <div class="pokemon-row">
              <span class="row-label">Ability</span>
              <input type="text" placeholder="" data-pokemon="${i}" data-field="ability" />
            </div>
            <div class="pokemon-row">
              <span class="row-label">Held Item</span>
              <input type="text" placeholder="" data-pokemon="${i}" data-field="item" />
            </div>
            <div class="pokemon-row">
              <span class="row-label">Move 1</span>
              <input type="text" placeholder="" data-pokemon="${i}" data-field="move1" />
            </div>
            <div class="pokemon-row">
              <span class="row-label">Move 2</span>
              <input type="text" placeholder="" data-pokemon="${i}" data-field="move2" />
            </div>
            <div class="pokemon-row">
              <span class="row-label">Move 3</span>
              <input type="text" placeholder="" data-pokemon="${i}" data-field="move3" />
            </div>
            <div class="pokemon-row">
              <span class="row-label">Move 4</span>
              <input type="text" placeholder="" data-pokemon="${i}" data-field="move4" />
            </div>
          </div>
          <div class="stats-col">
            ${STATS.map(s => `
              <div class="stat-row">
                <span class="stat-label">${s}</span>
                <input type="number" min="0" data-pokemon="${i}" data-field="stat_${s.replace(/ /g,'_').toLowerCase()}" />
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
}

function collectData() {
  const data = {
    playerName: document.getElementById('playerName').value,
    trainerName: document.getElementById('trainerName').value,
    teamName: document.getElementById('teamName').value,
    pokemon: []
  };

  for (let i = 0; i < POKEMON_COUNT; i++) {
    const p = {};
    document.querySelectorAll(`[data-pokemon="${i}"]`).forEach(el => {
      p[el.dataset.field] = el.value;
    });
    data.pokemon.push(p);
  }
  return data;
}

function generateCode() {
  const data = collectData();
  const json = JSON.stringify(data);
  const encoded = btoa(encodeURIComponent(json));

  // Create a short readable code: first 6 chars of a hash + timestamp suffix
  const hash = cyrb53(encoded).toString(36).toUpperCase().padStart(8, '0');
  const suffix = Date.now().toString(36).toUpperCase().slice(-4);
  const code = `${hash}-${suffix}`;

  document.getElementById('uniqueCode').textContent = code;
  document.getElementById('codeOutput').classList.remove('hidden');

  // Store full encoded data in sessionStorage keyed by code for later use
  sessionStorage.setItem(`team_${code}`, encoded);
}

function copyCode() {
  const code = document.getElementById('uniqueCode').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = '¡Copiado!';
    setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
  });
}

// Fast non-crypto hash (cyrb53)
function cyrb53(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

// Init
buildPokemonCards();
