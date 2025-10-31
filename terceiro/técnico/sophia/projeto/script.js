/* EcoClassificador - versão estável e funcional offline
   ✅ Base ampliada e correta
   ✅ Modo seguro da IA
   ✅ Mapa funcional com fallback
   ✅ Preparado para IA real (não ativa)
   Desenvolvido para: Sophia Scholante
*/

// Configuração IA
const USE_REAL_AI = false;
const AI_API_URL = "";

// Base simplificada de materiais (sem erros)
const DB = [
  { name: "papel", cat: "papel", bin: "Azul", color: "#3498db" },
  { name: "papelão", cat: "papel", bin: "Azul", color: "#3498db" },
  { name: "plástico", cat: "plástico", bin: "Vermelho", color: "#e74c3c" },
  { name: "garrafa pet", cat: "plástico", bin: "Vermelho", color: "#e74c3c" },
  { name: "vidro", cat: "vidro", bin: "Verde", color: "#27ae60" },
  { name: "garrafa de vidro", cat: "vidro", bin: "Verde", color: "#27ae60" },
  { name: "metal", cat: "metal", bin: "Amarelo", color: "#f1c40f" },
  { name: "lata", cat: "metal", bin: "Amarelo", color: "#f1c40f" },
  { name: "pilha", cat: "perigoso", bin: "Laranja", color: "#e67e22" },
  { name: "bateria", cat: "perigoso", bin: "Laranja", color: "#e67e22" },
  { name: "óleo de cozinha", cat: "perigoso", bin: "Laranja", color: "#e67e22" },
  { name: "restos de comida", cat: "orgânico", bin: "Marrom", color: "#8e5a2b" },
  { name: "borra de café", cat: "orgânico", bin: "Marrom", color: "#8e5a2b" },
  { name: "seringa", cat: "hospitalar", bin: "Branco", color: "#ecf0f1" },
  { name: "agulha", cat: "hospitalar", bin: "Branco", color: "#ecf0f1" },
  { name: "espelho", cat: "não reciclável", bin: "Cinza", color: "#7f8c8d" },
  { name: "fralda", cat: "não reciclável", bin: "Cinza", color: "#7f8c8d" },
  { name: "roupa", cat: "doação", bin: "Doação", color: "#bdc3c7" },
  { name: "celular", cat: "eletrônico", bin: "Ponto de coleta", color: "#95a5a6" },
  { name: "computador", cat: "eletrônico", bin: "Ponto de coleta", color: "#95a5a6" },
];

// Função de normalização e busca
function normalize(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}
function searchLocal(term) {
  term = normalize(term);
  return DB.filter(i => normalize(i.name).includes(term) || normalize(i.cat).includes(term));
}

// Render de resultados
function renderResults(items) {
  const results = document.getElementById("results");
  results.innerHTML = "";
  if (!items.length) {
    results.innerHTML = "<div class='note'>Material não encontrado.</div>";
    return;
  }
  items.forEach(it => {
    results.innerHTML += `
      <div class="result-item">
        <div class="swatch" style="background:${it.color}"></div>
        <div class="meta">
          <strong>${it.name}</strong>
          <small>${it.cat} — Lixeira ${it.bin}</small>
        </div>
      </div>`;
  });
}

// Eventos de busca
document.getElementById("btnSearch").onclick = () => {
  const term = document.getElementById("q").value;
  const res = searchLocal(term);
  renderResults(res);
};

// Mapa com geolocalização + fallback Santa Cruz do Sul
const map = L.map("map").setView([-29.7174, -52.425], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19
}).addTo(map);

// Pontos fixos (Santa Cruz do Sul)
const pontos = [
  { n: "Ecoponto Central", lat: -29.7170, lng: -52.4255 },
  { n: "UNISC", lat: -29.7063, lng: -52.4319 },
  { n: "Prefeitura", lat: -29.7178, lng: -52.4292 },
];
pontos.forEach(p => L.marker([p.lat, p.lng]).addTo(map).bindPopup(p.n));

// Legenda
document.getElementById("mapLegend").innerHTML = `
  <div class='legend-item'><div class='legend-swatch' style='background:#00ff99'></div>Localização</div>
  <div class='legend-item'><div class='legend-swatch' style='background:#1f7a4a'></div>Pontos fixos</div>
`;

// Tentativa de geolocalização
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    map.setView([latitude, longitude], 14);
    L.circle([latitude, longitude], {
      radius: 60,
      color: "#00ff99",
      fillColor: "#00ff99",
      fillOpacity: 0.3
    }).addTo(map).bindPopup("Você está aqui");
  });
}
