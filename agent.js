class CityAgent {
  constructor(name, role, colorClass) {
    this.name = name;
    this.role = role;
    this.colorClass = colorClass;
  }

  logStep(action, message) {
    return `
      <div class="border-l-2 border-slate-700 pl-3 py-1.5 my-1 space-y-1">
        <span class="text-xs font-bold ${this.colorClass} uppercase">[${this.name}] • ${action}</span>
        <p class="text-slate-200 text-xs font-sans">${message}</p>
      </div>
    `;
  }
}

const Agents = {
  Orchestrator: new CityAgent('NMC Command Center', 'Nagpur Master Supervisor', 'text-blue-400'),
  Traffic: new CityAgent('Nagpur Traffic Control', 'Traffic & Metro Corridor Agent', 'text-blue-300'),
  Emergency: new CityAgent('NMC Disaster Response', 'Fire & Flood Response Unit', 'text-red-400'),
  Utility: new CityAgent('OCW & MSEDCL Agent', 'Water & Power Grid Control', 'text-amber-400'),
  Citizen: new CityAgent('MahaMyNagpur Support', 'Citizen Grievance & Advisory', 'text-emerald-400')
};

const CityTools = {
  overrideTrafficSignals: (junction) => `Overriding traffic signals at Nagpur junction: ${junction}. Clearing corridor for emergency vehicles.`,
  dispatchFirstResponders: (unit, location) => `Dispatching NMC Fire & Rescue (${unit}) to ${location} with priority signal routing.`,
  isolateUtilityGrid: (sector) => `OCW/MSEDCL grid isolated at ${sector}. Rerouting supply to protect main grid.`,
  broadcastEmergencyAlert: (msg) => `Broadcasting NMC Citywide Alert via MyNagpur App & SMS: "${msg}"`
};

// Real-World Nagpur Action Implementations
function triggerTrafficCorridor() {
  const nodeEl = document.getElementById('override-nodes');
  if (nodeEl) {
    let count = parseInt(nodeEl.innerText) || 3;
    nodeEl.innerText = `${count + 1} Junctions`;
  }
  showNotification('Nagpur Traffic Police', 'Priority Green Corridor Activated on Wardha Road & Zero Mile Flyover', 'blue');
  logDomainActivity('Nagpur Traffic Agent', 'GREEN CORRIDOR: Overrode traffic signals from Sitabuldi Interchange to AIIMS MIHAN.');
}

function triggerEmergencyDispatch() {
  const unitsEl = document.getElementById('active-units');
  if (unitsEl) {
    unitsEl.innerText = "24 / 28 Units";
  }
  showNotification('NMC Disaster Cell', 'Nag River Flood Control & Quick Response Teams Dispatched', 'red');
  logDomainActivity('NMC Disaster Response', 'FLOOD ALERT: Dispatched rescue boats and pumping trucks to Ambazari & Jhansi Rani Square area.');
}

function triggerGridIsolation() {
  const warningsEl = document.getElementById('grid-warnings');
  if (warningsEl) {
    warningsEl.innerText = "0 Critical Leaks";
    warningsEl.className = "text-3xl font-extrabold text-emerald-400 font-mono mt-2";
  }
  showNotification('Orange City Water (OCW)', 'Main Pipeline Valve Isolated at Dharampeth Zone', 'amber');
  logDomainActivity('OCW Water Grid', 'ISOLATION COMPLETE: Closed 600mm feeder valve at Laxmi Nagar Water Tank. Emergency tanker dispatched.');
}

function triggerCitizenBroadcast() {
  const alertsEl = document.getElementById('alerts-count');
  if (alertsEl) {
    let count = parseInt(alertsEl.innerText) || 4;
    alertsEl.innerText = `${count + 1} Sent`;
  }
  showNotification('MahaMyNagpur Alert', 'Vidarbha Heatwave Advisory Issued to All 10 NMC Zones', 'emerald');
  logDomainActivity('Citizen Agent', 'BROADCAST ISSUED: Heatwave emergency warning issued. Cooling centers opened in Itwari & Sadar.');
}

// Zone-Specific Action Dispatcher
function dispatchZoneAction(zoneName, actionType) {
  showNotification(`NMC ${zoneName}`, `Executing ${actionType} for ${zoneName}`, 'blue');
  logDomainActivity(`${zoneName} Control`, `OPERATIONAL ACTION: Initiated ${actionType} across zonal wards.`);
}

async function processIncidentPipeline(incidentText, onStepCallback) {
  const query = incidentText.toLowerCase();

  onStepCallback(Agents.Orchestrator.logStep('Reasoning', `Analyzing Nagpur City incident: "${incidentText}"`));
  await new Promise(r => setTimeout(r, 500));

  let dispatchedAgents = [];
  if (query.includes('flood') || query.includes('nag river') || query.includes('ambazari') || query.includes('fire') || query.includes('explosion')) {
    dispatchedAgents.push('Utility', 'Emergency', 'Traffic', 'Citizen');
  } else if (query.includes('water') || query.includes('pipe') || query.includes('ocw') || query.includes('msedcl')) {
    dispatchedAgents.push('Utility', 'Traffic', 'Citizen');
  } else {
    dispatchedAgents.push('Traffic', 'Citizen');
  }

  onStepCallback(Agents.Orchestrator.logStep('NMC Dispatch', `Coordinating agents: ${dispatchedAgents.join(', ')}`));
  await new Promise(r => setTimeout(r, 600));

  if (dispatchedAgents.includes('Utility')) {
    onStepCallback(Agents.Utility.logStep('OCW / MSEDCL Action', CityTools.isolateUtilityGrid('Laxmi Nagar Substation / OCW Tank')));
    await new Promise(r => setTimeout(r, 500));
  }
  if (dispatchedAgents.includes('Emergency')) {
    onStepCallback(Agents.Emergency.logStep('Fire & Disaster Cell', CityTools.dispatchFirstResponders('3 Rescue Vans, 2 Fire Engines', 'Sitabuldi & Nag River Banks')));
    await new Promise(r => setTimeout(r, 500));
  }
  if (dispatchedAgents.includes('Traffic')) {
    onStepCallback(Agents.Traffic.logStep('Traffic Police Automation', CityTools.overrideTrafficSignals('Zero Mile & Variety Square')));
    await new Promise(r => setTimeout(r, 500));
  }
  if (dispatchedAgents.includes('Citizen')) {
    onStepCallback(Agents.Citizen.logStep('MyNagpur App', CityTools.broadcastEmergencyAlert('Avoid Low-Lying areas along Nag River. Emergency Teams on site.')));
    await new Promise(r => setTimeout(r, 500));
  }

  onStepCallback(`
    <div class="bg-emerald-950/60 border border-emerald-500/40 p-3.5 rounded-xl text-emerald-200 mt-2 font-sans text-xs">
      <p class="font-bold"><i class="fa-solid fa-circle-check mr-1.5"></i> Nagpur Multi-Agent Action Complete</p>
      <p class="text-slate-300 text-xs mt-1">NMC Control Room successfully contained the incident.</p>
    </div>
  `);
}
