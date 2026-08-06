/* ==========================================================================
   Smart Nagpur Platform - Traffic Map Engine
   ========================================================================== */

let trafficMap = null;
let trafficFlowPolylines = [];
let isTrafficLayerVisible = true;
let liveUpdateTimer = null;

const TRAFFIC_JUNCTIONS = [
  { id: 1, name: "Variety Square (Sitabuldi)", lat: 21.1440, lng: 79.0830, status: "Heavy Jam", waitTime: "9 mins", cause: "Commercial Peak Volume" },
  { id: 2, name: "CST / Samvidhan Square", lat: 21.1480, lng: 79.0880, status: "Moderate", waitTime: "4 mins", cause: "Normal Signal Cycle" },
  { id: 3, name: "Indora Chowk (Zone 9)", lat: 21.1710, lng: 79.0980, status: "Heavy Jam", waitTime: "15 mins", cause: "Pipeline Repair Diversion" },
  { id: 4, name: "Subhash Nagar T-Junction", lat: 21.1230, lng: 79.0550, status: "Clear", waitTime: "1 min", cause: "Smooth Flow" },
  { id: 5, name: "Rahate Colony Square", lat: 21.1280, lng: 79.0760, status: "Clear", waitTime: "2 mins", cause: "Smooth Flow" }
];

const TRAFFIC_CORRIDORS = [
  {
    name: "Wardha Road Corridor",
    speed: 28,
    status: "Moderate",
    color: "#E5934C",
    coords: [
      [21.1000, 79.0600],
      [21.1200, 79.0700],
      [21.1350, 79.0800],
      [21.1440, 79.0830]
    ]
  },
  {
    name: "Central Avenue Corridor",
    speed: 16,
    status: "Congested",
    color: "#B84A39",
    coords: [
      [21.1440, 79.0830],
      [21.1480, 79.1000],
      [21.1500, 79.1200],
      [21.1520, 79.1400]
    ]
  },
  {
    name: "Amravati Road Arterial",
    speed: 48,
    status: "Smooth",
    color: "#557C60",
    coords: [
      [21.1440, 79.0830],
      [21.1480, 79.0600],
      [21.1520, 79.0300]
    ]
  },
  {
    name: "Kamptee Road Corridor",
    speed: 18,
    status: "Congested",
    color: "#B84A39",
    coords: [
      [21.1480, 79.0880],
      [21.1650, 79.0950],
      [21.1800, 79.1050]
    ]
  },
  {
    name: "Inner Ring Road South",
    speed: 52,
    status: "Smooth",
    color: "#557C60",
    coords: [
      [21.1100, 79.0400],
      [21.1050, 79.0800],
      [21.1150, 79.1200]
    ]
  }
];

function initTrafficMap() {
  const container = document.getElementById('traffic-map');
  if (!container) return;

  // Clean up existing instance if already created
  if (trafficMap !== null) {
    trafficMap.remove();
    trafficMap = null;
  }

  // Initialize Map directly on Nagpur coordinates
  trafficMap = L.map('traffic-map', {
    center: [21.1458, 79.0882],
    zoom: 12,
    zoomControl: true
  });

  // Standard OpenStreetMap Tiles (Ultra-Reliable CDN)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(trafficMap);

  // Multiple invalidateSize pulses guarantee tile rendering after animations complete
  [100, 300, 600].forEach(delay => {
    setTimeout(() => {
      if (trafficMap) trafficMap.invalidateSize();
    }, delay);
  });

  renderTrafficLayers();
  startLiveTrafficLoop();
}

function renderTrafficLayers() {
  if (!trafficMap) return;

  clearTrafficFlowLines();

  // 1. Draw Polyline Flow Layers
  if (isTrafficLayerVisible) {
    TRAFFIC_CORRIDORS.forEach(corridor => {
      const line = L.polyline(corridor.coords, {
        color: corridor.color,
        weight: 6,
        opacity: 0.85,
        lineCap: 'round'
      }).addTo(trafficMap);

      line.bindPopup(`
        <div class="p-1 font-sans">
          <h4 class="font-bold text-xs text-[#3B2A22]">${corridor.name}</h4>
          <div class="text-[11px] text-[#634E42] mt-1">Live Speed: <b class="text-[#B84A39]">${corridor.speed} km/h</b></div>
          <div class="text-[11px] text-[#634E42]">Condition: <b>${corridor.status}</b></div>
        </div>
      `);

      trafficFlowPolylines.push(line);
    });
  }

  // 2. Junction Markers
  renderJunctionPinsAndCards();

  // 3. Corridor Speeds
  renderCorridorSpeedList();
}

function renderJunctionPinsAndCards() {
  const listElem = document.getElementById('junctions-list');
  if (listElem) listElem.innerHTML = '';

  TRAFFIC_JUNCTIONS.forEach(j => {
    let pinColor = "#557C60";
    let badgeBg = "bg-[#D4EFDF] text-[#1E8449]";

    if (j.status === "Moderate") {
      pinColor = "#E5934C";
      badgeBg = "bg-[#FCF3CF] text-[#9A7D0A]";
    } else if (j.status === "Heavy Jam" || j.status === "High Traffic") {
      pinColor = "#B84A39";
      badgeBg = "bg-[#FADBD8] text-[#900C3F]";
    }

    const customIcon = L.divIcon({
      className: 'custom-traffic-pin',
      html: `
        <div style="background-color: ${pinColor}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid #FFFDF8; display: flex; align-items: center; justify-content: center; color: #FFFDF8; font-size: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
          <i class="fa-solid fa-car"></i>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const m = L.marker([j.lat, j.lng], { icon: customIcon }).addTo(trafficMap);

    m.bindPopup(`
      <div class="p-1 font-sans">
        <h4 class="font-bold text-xs text-[#3B2A22]">${j.name}</h4>
        <div class="text-[11px] text-[#634E42] mt-1">Status: <b class="text-[#B84A39]">${j.status}</b></div>
        <div class="text-[11px] text-[#634E42]">Delay: <b>${j.waitTime}</b></div>
        <div class="text-[10px] text-[#8C6D58] mt-1">${j.cause}</div>
      </div>
    `);

    if (listElem) {
      const card = document.createElement('div');
      card.className = "p-3 bg-[#FAF6ED] rounded-2xl border border-[#E8DFD1] flex justify-between items-center shadow-sm hover:border-[#B84A39] transition cursor-pointer";
      card.onclick = () => {
        trafficMap.flyTo([j.lat, j.lng], 14, { duration: 1 });
        m.openPopup();
      };

      card.innerHTML = `
        <div>
          <h4 class="font-bold text-[#3B2A22] text-xs">${j.name}</h4>
          <p class="text-[11px] text-[#8C6D58]">${j.cause} • Delay: ${j.waitTime}</p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${badgeBg}">${j.status}</span>
      `;
      listElem.appendChild(card);
    }
  });
}

function renderCorridorSpeedList() {
  const corridorElem = document.getElementById('corridor-speed-list');
  if (!corridorElem) return;

  corridorElem.innerHTML = '';

  TRAFFIC_CORRIDORS.forEach(c => {
    let badgeBg = "bg-[#D4EFDF] text-[#1E8449]";
    if (c.status === "Moderate") badgeBg = "bg-[#FCF3CF] text-[#9A7D0A]";
    if (c.status === "Congested") badgeBg = "bg-[#FADBD8] text-[#900C3F]";

    const row = document.createElement('div');
    row.className = "p-2.5 bg-[#FAF6ED] rounded-xl border border-[#E8DFD1] flex justify-between items-center";
    row.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${c.color}"></span>
        <span class="font-bold text-[#3B2A22] text-[11px]">${c.name}</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-mono text-xs font-bold text-[#3B2A22]">${c.speed} km/h</span>
        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold ${badgeBg}">${c.status}</span>
      </div>
    `;
    corridorElem.appendChild(row);
  });
}

function clearTrafficFlowLines() {
  trafficFlowPolylines.forEach(line => {
    if (trafficMap) trafficMap.removeLayer(line);
  });
  trafficFlowPolylines = [];
}

function toggleTrafficFlowLayer() {
  isTrafficLayerVisible = !isTrafficLayerVisible;
  const btn = document.getElementById('btn-toggle-traffic');

  if (btn) {
    if (isTrafficLayerVisible) {
      btn.className = "px-4 py-2.5 bg-[#B84A39] hover:bg-[#A03E2F] text-[#FFFDF8] text-xs font-bold rounded-2xl transition shadow-md flex items-center gap-2";
      btn.innerHTML = `<i class="fa-solid fa-layer-group"></i> Traffic Layer: ON`;
    } else {
      btn.className = "px-4 py-2.5 bg-[#FAF6ED] hover:bg-[#E8DFD1] text-[#634E42] text-xs font-bold rounded-2xl transition border border-[#E8DFD1] flex items-center gap-2 shadow-sm";
      btn.innerHTML = `<i class="fa-solid fa-layer-group"></i> Traffic Layer: OFF`;
    }
  }

  renderTrafficLayers();
}

function startLiveTrafficLoop() {
  if (liveUpdateTimer) clearInterval(liveUpdateTimer);

  liveUpdateTimer = setInterval(() => {
    TRAFFIC_CORRIDORS.forEach(c => {
      const delta = Math.floor(Math.random() * 5) - 2;
      c.speed = Math.max(10, Math.min(65, c.speed + delta));

      if (c.speed < 22) {
        c.status = "Congested";
        c.color = "#B84A39";
      } else if (c.speed < 38) {
        c.status = "Moderate";
        c.color = "#E5934C";
      } else {
        c.status = "Smooth";
        c.color = "#557C60";
      }
    });

    renderTrafficLayers();
  }, 5000);
}

// Window resize listener guarantees map adjusts smoothly
window.addEventListener('resize', () => {
  if (trafficMap) trafficMap.invalidateSize();
});
