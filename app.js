// Government Login Handler
function handleGovLogin(e) {
  e.preventDefault();
  const targetDomain = document.getElementById('gov-domain').value;
  sessionStorage.setItem('scoc_gov_auth', 'true');
  window.location.href = targetDomain;
}

// Toast Notifications for Action Buttons
function showNotification(title, message, color) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-6 right-6 z-50 transition-all transform translate-y-10 opacity-0';
    document.body.appendChild(toast);
  }

  const borderColors = {
    blue: 'border-blue-500 bg-blue-950/90 text-blue-200',
    red: 'border-red-500 bg-red-950/90 text-red-200',
    amber: 'border-amber-500 bg-amber-950/90 text-amber-200',
    emerald: 'border-emerald-500 bg-emerald-950/90 text-emerald-200'
  };

  toast.innerHTML = `
    <div class="border-l-4 ${borderColors[color] || borderColors.blue} backdrop-blur-md p-4 rounded-xl shadow-2xl min-w-[320px]">
      <h4 class="text-xs font-bold uppercase tracking-wider">${title}</h4>
      <p class="text-xs mt-1 text-slate-100">${message}</p>
    </div>
  `;

  setTimeout(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  }, 50);

  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
  }, 4000);
}

// Log activities directly into domain pages
function logDomainActivity(agentName, text) {
  const logContainer = document.getElementById('domain-logs');
  if (logContainer) {
    const timestamp = new Date().toLocaleTimeString();
    logContainer.innerHTML = `
      <div class="border-b border-slate-800 pb-2 mb-2 text-xs">
        <span class="text-slate-500 font-mono">[${timestamp}]</span>
        <span class="font-bold text-slate-300 ml-1">${agentName}:</span>
        <span class="text-slate-400 block mt-0.5">${text}</span>
      </div>
    ` + logContainer.innerHTML;
  }
}

// Dynamic Header Injector with NMC Zones Link
document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('nav-header');
  if (navContainer) {
    navContainer.innerHTML = `
      <header class="border-b border-slate-800 bg-slate-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-orange-600/20">
            <i class="fa-solid fa-building-columns"></i>
          </div>
          <div>
            <h1 class="text-base font-bold text-slate-100">Nagpur Smart City Operations Center</h1>
            <span class="text-xs text-orange-400 font-mono block">NMC Command HQ • Civil Lines, Nagpur</span>
          </div>
        </div>

        <nav class="flex items-center gap-2 text-xs font-semibold">
          <a href="dashboard.html" class="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition">
            <i class="fa-solid fa-gauge mr-1"></i> HQ Control
          </a>
          <a href="zones.html" class="px-3 py-2 rounded-lg bg-orange-950/80 border border-orange-700/60 text-orange-300 hover:bg-orange-900/60 transition">
            <i class="fa-solid fa-map-location-dot mr-1"></i> NMC Zones (10)
          </a>
          <a href="traffic.html" class="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-blue-400 transition">
            <i class="fa-solid fa-traffic-light mr-1"></i> Traffic
          </a>
          <a href="emergency.html" class="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-red-500/50 text-red-400 transition">
            <i class="fa-solid fa-truck-medical mr-1"></i> Emergency
          </a>
          <a href="utility.html" class="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-amber-400 transition">
            <i class="fa-solid fa-plug mr-1"></i> Water & Power
          </a>
          <a href="citizen.html" class="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-emerald-400 transition">
            <i class="fa-solid fa-bullhorn mr-1"></i> Citizen
          </a>
          <a href="index.html" class="ml-2 px-3 py-2 rounded-lg bg-red-950/60 border border-red-800/50 text-rose-300 hover:bg-red-900 transition">
            <i class="fa-solid fa-right-from-bracket"></i>
          </a>
        </nav>
      </header>
    `;
  }
});

function appendToConsole(html) {
  const c = document.getElementById('chat-messages');
  if (c) {
    c.innerHTML += html;
    c.scrollTop = c.scrollHeight;
  }
}

function clearConsole() {
  const c = document.getElementById('chat-messages');
  if (c) {
    c.innerHTML = `
      <div class="bg-slate-950 border border-orange-900/40 p-4 rounded-xl text-slate-300 space-y-1">
        <p class="font-bold text-orange-400">NMC Multi-Agent Command Console Ready.</p>
        <p class="text-slate-400 text-xs">Enter a incident report for Nagpur Municipal Corporation area.</p>
      </div>
    `;
  }
}

async function handleUserSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;

  appendToConsole(`
    <div class="text-right">
      <div class="inline-block bg-orange-950/80 border border-orange-800/50 text-orange-100 p-3 rounded-xl text-left max-w-[85%] font-sans text-xs">
        <span class="text-[10px] text-orange-400 font-mono font-bold block mb-0.5">[NMC DISPATCH OFFICER]</span>
        ${text}
      </div>
    </div>
  `);

  input.value = '';
  await processIncidentPipeline(text, (stepHtml) => appendToConsole(stepHtml));
}

function triggerPreset(type) {
  const input = document.getElementById('user-input');
  if (type === 'ambazari_flood') input.value = "CRITICAL: Ambazari Lake overflow causing flood warning near Corporation Colony & Nag River banks.";
  if (type === 'sitabuldi_jam') input.value = "ALERT: Gridlock at Variety Square and Sitabuldi Metro Station during peak market hours.";
  if (type === 'ocw_leak') input.value = "WATER EMERGENCY: 700mm OCW pipeline burst at Dharampeth Zone near Law College Square.";
  handleUserSubmit(new Event('submit'));
}
