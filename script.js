const POKEMON_COUNT = 6;


function buildPokemonCards() {
  const grid = document.getElementById('pokemonGrid');
  for (let i = 0; i < POKEMON_COUNT; i++) {
    grid.innerHTML += `
      <div class="pokemon-card">
        <div class="pokemon-card-header">
          <span class="label">Pokémon</span>
          <input type="text" placeholder="Name" required data-pokemon="${i}" data-field="name" />
        </div>
        <div class="pokemon-card-body">
          <div class="pokemon-fields">
            <div class="pokemon-row pokemon-row--info">
              <span class="row-label">Ability</span>
              <input type="text" placeholder="" required data-pokemon="${i}" data-field="ability" />
            </div>
            <div class="pokemon-row pokemon-row--info">
              <span class="row-label">Held Item</span>
              <input type="text" placeholder="" required data-pokemon="${i}" data-field="item" />
            </div>
            <div class="pokemon-row">
              <span class="row-label">Move 1</span>
              <input type="text" placeholder="" required data-pokemon="${i}" data-field="move1" />
            </div>
            <div class="pokemon-row">
              <span class="row-label">Move 2</span>
              <input type="text" placeholder="" required data-pokemon="${i}" data-field="move2" />
            </div>
            <div class="pokemon-row">
              <span class="row-label">Move 3</span>
              <input type="text" placeholder="" required data-pokemon="${i}" data-field="move3" />
            </div>
            <div class="pokemon-row">
              <span class="row-label">Move 4</span>
              <input type="text" placeholder="" required data-pokemon="${i}" data-field="move4" />
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

function collectData() {
  const data = {
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

function buildShowdownPaste(data) {
  const blocks = [];
  data.pokemon.forEach(p => {
    if (!p.name) return;
    const lines = [];
    let header = p.name;
    if (p.item) header += ` @ ${p.item}`;
    lines.push(header);
    if (p.ability) lines.push(`Ability: ${p.ability}`);
    lines.push('Level: 50');
    ['move1', 'move2', 'move3', 'move4'].forEach(m => {
      if (p[m]) lines.push(`- ${p[m]}`);
    });
    blocks.push(lines.join('\n'));
  });
  return blocks.join('\n\n');
}

function handleSubmit(event) {
  event.preventDefault();
  generateCode();
}

function generateCode() {
  const data = collectData();
  const paste = buildShowdownPaste(data);

  document.getElementById('showdownText').value = paste;
  document.getElementById('codeOutput').classList.remove('hidden');
  document.getElementById('codeOutput').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function copyCode() {
  const text = document.getElementById('showdownText').value;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = '¡Copiado!';
    setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
  });
}

// Init
buildPokemonCards();
