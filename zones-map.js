/* ==========================================================================
   Smart Nagpur Platform - Pastel Indian Aesthetic Interactive Map Engine
   ========================================================================== */

let map = null;
let zoneMarkers = {};
let activeStatusFilter = 'All';
let searchQuery = '';

// Data set for Nagpur 10 NMC Municipal Zones
const NMC_ZONES = [
  { id: 1, name: "Laxmi Nagar (Zone 1)", lat: 21.1180, lng: 79.0620, status: "Optimal", water: "98%", power: "Operational", alert: "None" },
  { id: 2, name: "Dharampeth (Zone 2)", lat: 21.1415, lng: 79.0600, status: "Optimal", water: "96%", power: "Operational", alert: "None" },
  { id: 3, name: "Hanuman Nagar (Zone 3)", lat: 21.1150, lng: 79.0950, status: "Warning", water: "89%", power: "Voltage Fluctuation", alert: "Substation Maintenance" },
  { id: 4, name: "Dhantoli (Zone 4)", lat: 21.1320, lng: 79.0830, status: "Optimal", water: "94%", power: "Operational", alert: "None" },
  { id: 5, name: "Nehru Nagar (Zone 5)", lat: 21.1200, lng: 79.1150, status: "Optimal", water: "95%", power: "Operational", alert: "None" },
  { id: 6, name: "Gandhi Bagh (Zone 6)", lat: 21.1520, lng: 79.0980, status: "Warning", water: "88%", power: "Operational", alert: "High Traffic Congestion" },
  { id: 7, name: "Satranjipura (Zone 7)", lat: 21.1630, lng: 79.1020, status: "Optimal", water: "92%", power: "Operational", alert: "None" },
  { id: 8, name: "Lakadganj (Zone 8)", lat: 21.1500, lng: 79.1280, status: "Optimal", water: "97%", power: "Operational", alert: "None" },
  { id: 9, name: "Ashi Nagar (Zone 9)", lat: 21.1780, lng: 79.1050, status: "Critical", water: "74%", power: "Feeder Trip", alert: "Water Main Leakage" },
  { id: 10, name: "Mangalwari (Zone 10)", lat: 21.1820, lng: 79.0700, status: "Optimal", water: "93%", power: "Operational", alert: "None" }
];

function initZonesMap() {
  const mapElem = document.getElementById('zones-map');
  if (!mapElem || map) return;

  // Initialize Map centered over Nagpur City
  map = L.map('zones-map', {
    center: [21.1458, 79.0882],
    zoom: 12,
    zoomControl: true
  });

  // CartoDB Voyager Tile Layer - Soft, clean map style matching pastel aesthetics
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO',
    maxZoom: 18,
    minZoom: 10
  }).addTo(map);

  renderZoneCardsAndMarkers();
}

function renderZoneCardsAndMarkers() {
  const listContainer = document.getElementById('zones-list');
  if (!listContainer) return;

  // Clear map pins and sidebar list
  Object.values(zoneMarkers).forEach(m => map.removeLayer(m));
  zoneMarkers = {};
  listContainer.innerHTML = '';

  // Filter zones by active status & search string
  const visibleZones = NMC_ZONES.filter(z => {
    const matchesStatus = (activeStatusFilter === 'All' || z.status === activeStatusFilter);
    const matchesSearch = z.name.toLowerCase().includes(searchQuery) || z.alert.toLowerCase().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  if (visibleZones.length === 0) {
    listContainer.innerHTML = `
      <div class="p-8 text-center text-[#8C6D58] font-medium text-xs border border-dashed border-[#E8DFD1] rounded-2xl bg-[#FAF6ED]">
        No municipal zones currently match the active filter or search criteria.
      </div>
    `;
    return;
  }

  const bounds = [];

  visibleZones.forEach(zone => {
    // Pastel Indian Palette badge & pin definitions
    let badgeBg = "bg-[#D4EFDF] text-[#1E8449] border-[#A9DFBF]";
    let pinColor = "#557C60"; // Soft Pistachio/Forest Green

    if (zone.status === "Warning") {
      badgeBg = "bg-[#FCF3CF] text-[#9A7D0A] border-[#F9E79F]";
      pinColor = "#E5934C"; // Soft Marigold/Amber
    } else if (zone.status === "Critical") {
      badgeBg = "bg-[#FADBD8] text-[#900C3F] border-[#F5B7B1]";
      pinColor = "#B84A39"; // Terracotta Red
    }

    bounds.push([zone.lat, zone.lng]);

    // 1. Create Leaflet Custom Div Marker Pin
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="background-color: ${pinColor};" class="w-8 h-8 rounded-full border-2 border-[#FFFDF8] flex items-center justify-center shadow-md text-[#FFFDF8] font-bold text-xs transform transition hover:scale-125 cursor-pointer">
          Z${zone.id}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([zone.lat, zone.lng], { icon: customIcon }).addTo(map);
    
    // Custom Map Popup
    marker.bindPopup(`
      <div class="p-1 font-sans">
        <h4 class="font-bold text-sm text-[#3B2A22] mb-1">${zone.name}</h4>
        <div class="text-xs space-y-1 text-[#634E42]">
          <div>Water Level: <b class="text-[#557C60]">${zone.water}</b></div>
          <div>Power Grid: <b class="text-[#3B2A22]">${zone.power}</b></div>
          <div>Status: <b class="uppercase text-[#B84A39]">${zone.status}</b></div>
        </div>
      </div>
    `);

    marker.on('click', () => {
      focusZoneCard(zone.id);
    });

    zoneMarkers[zone.id] = marker;

    // 2. Render Sidebar Card with Soft Pastel Styling
    const card = document.createElement('div');
    card.id = `zone-card-${zone.id}`;
    card.className = "p-4 bg-[#FFFDF8] hover:bg-[#FAF6ED] border border-[#E8DFD1] rounded-2xl transition cursor-pointer space-y-2 shadow-sm hover:shadow-md";
    card.onclick = () => focusZoneOnMap(zone.id);

    card.innerHTML = `
      <div class="flex justify-between items-center">
        <h4 class="text-xs font-bold text-[#3B2A22] flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-[#FAF6ED] text-[#B84A39] border border-[#E8DFD1] flex items-center justify-center text-[10px] font-bold">${zone.id}</span>
          ${zone.name}
        </h4>
        <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeBg}">
          ${zone.status}
        </span>
      </div>
      <div class="grid grid-cols-2 gap-2 text-[11px] text-[#8C6D58] font-medium">
        <div>Water: <span class="text-[#3B2A22] font-bold">${zone.water}</span></div>
        <div>Power: <span class="text-[#3B2A22] font-bold">${zone.power}</span></div>
      </div>
      ${zone.alert !== "None" ? `
        <div class="text-[10px] text-[#9A7D0A] bg-[#FCF3CF]/60 px-2.5 py-1 rounded-xl border border-[#F9E79F] flex items-center gap-1.5 font-medium">
          <i class="fa-solid fa-triangle-exclamation"></i> ${zone.alert}
        </div>
      ` : ''}
    `;

    listContainer.appendChild(card);
  });

  // Fit bounds when filtering
  if (activeStatusFilter !== 'All' && bounds.length > 0 && map) {
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  }
}

// Status Filter Switcher Engine
function filterZonesByStatus(status) {
  activeStatusFilter = status;

  const btnStyles = {
    'All': { id: 'btn-filter-all', activeClass: 'bg-[#B84A39] text-[#FFFDF8] shadow-sm' },
    'Critical': { id: 'btn-filter-critical', activeClass: 'bg-[#B84A39] text-[#FFFDF8] shadow-sm' },
    'Warning': { id: 'btn-filter-warning', activeClass: 'bg-[#E5934C] text-[#FFFDF8] shadow-sm' },
    'Optimal': { id: 'btn-filter-optimal', activeClass: 'bg-[#557C60] text-[#FFFDF8] shadow-sm' }
  };

  Object.keys(btnStyles).forEach(key => {
    const btn = document.getElementById(btnStyles[key].id);
    if (btn) {
      if (key === status) {
        btn.className = `px-3 py-1.5 rounded-xl font-bold transition ${btnStyles[key].activeClass}`;
      } else {
        btn.className = "px-3 py-1.5 rounded-xl text-[#8C6D58] hover:bg-[#F2EBDC] transition";
      }
    }
  });

  const label = document.getElementById('active-filter-label');
  if (label) {
    label.textContent = status === 'All' ? 'Showing All 10 Zones' : `Filtered: ${status} Zones`;
  }

  renderZoneCardsAndMarkers();

  if (status === 'All' && map) {
    map.flyTo([21.1458, 79.0882], 12, { duration: 1 });
  }
}

function handleZoneSearch() {
  const input = document.getElementById('zone-search-input');
  if (input) {
    searchQuery = input.value.trim().toLowerCase();
    renderZoneCardsAndMarkers();
  }
}

// Pan map to marker location
function focusZoneOnMap(zoneId) {
  const zone = NMC_ZONES.find(z => z.id === zoneId);
  const marker = zoneMarkers[zoneId];

  if (zone && marker && map) {
    map.flyTo([zone.lat, zone.lng], 14, { duration: 1 });
    marker.openPopup();
    highlightZoneCardUI(zoneId);
  }
}

// Highlight sidebar card when marker clicked
function focusZoneCard(zoneId) {
  const card = document.getElementById(`zone-card-${zoneId}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    highlightZoneCardUI(zoneId);
  }
}

function highlightZoneCardUI(zoneId) {
  NMC_ZONES.forEach(z => {
    const c = document.getElementById(`zone-card-${z.id}`);
    if (c) {
      c.classList.remove('border-[#B84A39]', 'bg-[#FAF6ED]');
      c.classList.add('border-[#E8DFD1]', 'bg-[#FFFDF8]');
    }
  });

  const activeCard = document.getElementById(`zone-card-${zoneId}`);
  if (activeCard) {
    activeCard.classList.remove('border-[#E8DFD1]', 'bg-[#FFFDF8]');
    activeCard.classList.add('border-[#B84A39]', 'bg-[#FAF6ED]');
  }
}

function resetMapView() {
  const input = document.getElementById('zone-search-input');
  if (input) input.value = '';
  searchQuery = '';
  filterZonesByStatus('All');
}
