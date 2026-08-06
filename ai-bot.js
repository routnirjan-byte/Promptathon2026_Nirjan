/* ==========================================================================
   Smart Nagpur Platform - Advanced Conversational AI Assistant
   Capabilities:
   - Natural Language Understanding (NLU) & Intent Recognition
   - Session Memory Context
   - Direct Navigation Commands
   - System Diagnostics & Real-time Data Retrieval
   - Quick Action Execution & Toast Feedback
   ========================================================================== */

// Conversation State & Knowledge Base
const AIBotState = {
  chatHistory: [],
  isOpen: false,
  isTyping: false
};

const SmartNagpurKnowledge = {
  water: {
    mld: "742 MLD",
    capacity: "96.4% Reservoirs Optimal",
    mainDam: "Totladoh & Ambazari Reservoirs",
    operator: "Orange City Water (OCW)"
  },
  power: {
    load: "1,248 MW",
    frequency: "50.02 Hz",
    gridStatus: "Normal Load Distribution",
    operator: "MSEDCL Nagpur Zone"
  },
  traffic: {
    activeSignals: "142 / 148 Operational",
    slowdowns: "Sitabuldi Interchange & Variety Square",
    corridors: "Wardha Road Green Corridor Active"
  },
  disaster: {
    readiness: "100% Prepared",
    squads: "10 Zonal Emergency Response Squads on Standby",
    hotspots: "Ambazari Overflow Spillway (82% Level)"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('ai-bot-root')) return;

  const botContainer = document.createElement('div');
  botContainer.id = 'ai-bot-root';
  botContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3';

  botContainer.innerHTML = `
    <!-- AI Bot Chat Window -->
    <div id="ai-chat-window" class="hidden glass-card p-4 rounded-3xl w-80 sm:w-[410px] shadow-2xl border border-orange-500/40 flex flex-col h-[500px] transition-all duration-300">
      
      <!-- Header -->
      <div class="flex justify-between items-center border-b border-slate-800 pb-3 mb-2">
        <div class="flex items-center gap-2.5">
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white text-base shadow-lg shadow-orange-600/30">
              <i class="fa-solid fa-brain"></i>
            </div>
            <span class="w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 absolute -bottom-0.5 -right-0.5 animate-pulse"></span>
          </div>
          <div>
            <h4 class="text-xs font-bold text-white flex items-center gap-1.5">
              Nagpur AI Command Bot
              <span class="px-2 py-0.5 text-[9px] font-mono rounded-full bg-orange-950 text-orange-400 border border-orange-800">v2.4 AI</span>
            </h4>
            <span class="text-[10px] text-slate-400 font-mono">Conversational Operations Core</span>
          </div>
        </div>
        
        <div class="flex items-center gap-1">
          <button onclick="clearAIChat()" title="Clear Chat" class="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
          <button onclick="toggleAIBot()" class="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <!-- Quick Context Chips -->
      <div class="flex gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar text-[10px]">
        <button onclick="sendQuickQuery('Give me a full city status report')" class="px-3 py-1 rounded-full bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white transition whitespace-nowrap border border-slate-700">
          <i class="fa-solid fa-chart-line text-orange-400"></i> City Status
        </button>
        <button onclick="aiBotNavigate('zones.html')" class="px-3 py-1 rounded-full bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white transition whitespace-nowrap border border-slate-700">
          <i class="fa-solid fa-map-location-dot text-amber-400"></i> Zones
        </button>
        <button onclick="sendQuickQuery('Force Wardha Road Green Wave')" class="px-3 py-1 rounded-full bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white transition whitespace-nowrap border border-slate-700">
          <i class="fa-solid fa-bolt text-emerald-400"></i> Wardha Wave
        </button>
        <button onclick="aiBotNavigate('alerts.html')" class="px-3 py-1 rounded-full bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white transition whitespace-nowrap border border-slate-700">
          <i class="fa-solid fa-triangle-exclamation text-red-400"></i> Emergencies
        </button>
      </div>

      <!-- Chat History Container -->
      <div id="ai-chat-messages" class="flex-1 overflow-y-auto space-y-3 p-1 text-xs">
        <div class="bg-slate-800/90 p-3.5 rounded-2xl rounded-tl-none border border-slate-700 text-slate-200 space-y-2 shadow">
          <p class="font-bold text-orange-400 flex items-center gap-1.5">
            <i class="fa-solid fa-hand-wave"></i> Welcome Officer!
          </p>
          <p>I am your advanced AI Assistant. I can answer questions about Nagpur's infrastructure, run quick operational actions, or navigate you to any module.</p>
          <p class="text-[11px] text-slate-400 italic">Try asking: <strong>"How is water supply doing?"</strong> or <strong>"Clear Sitabuldi traffic bottleneck"</strong>.</p>
        </div>
      </div>

      <!-- Typing Indicator Placeholder -->
      <div id="ai-typing-indicator" class="hidden px-2 py-1 text-[11px] text-orange-400 font-mono flex items-center gap-2">
        <i class="fa-solid fa-circle-notch animate-spin"></i> AI Bot processing telemetry...
      </div>

      <!-- Chat Form Input -->
      <form onsubmit="handleAISubmit(event)" class="mt-2 pt-2 border-t border-slate-800 flex gap-2">
        <input type="text" id="ai-input" autocomplete="off" placeholder="Chat with AI or give commands..." class="flex-1 bg-slate-950 border border-slate-700 rounded-full px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition">
        <button type="submit" class="w-9 h-9 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center text-xs shadow-lg shadow-orange-600/30 transition">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>

    <!-- Floating Toggle Circular Button -->
    <button onclick="toggleAIBot()" class="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-2xl border-2 border-orange-400 flex items-center justify-center text-xl transition transform hover:scale-110 active:scale-95 group">
      <i class="fa-solid fa-robot group-hover:rotate-12 transition"></i>
    </button>
  `;

  document.body.appendChild(botContainer);
});

// Toggle Bot UI
function toggleAIBot() {
  const win = document.getElementById('ai-chat-window');
  if (win) {
    win.classList.toggle('hidden');
    AIBotState.isOpen = !win.classList.contains('hidden');
    if (AIBotState.isOpen) {
      document.getElementById('ai-input')?.focus();
    }
  }
}

// Quick Chip Action
function sendQuickQuery(text) {
  const input = document.getElementById('ai-input');
  if (input) {
    input.value = text;
    handleAISubmit(new Event('submit'));
  }
}

// Clear Chat History
function clearAIChat() {
  const history = document.getElementById('ai-chat-messages');
  if (history) {
    history.innerHTML = `
      <div class="bg-slate-800/90 p-3.5 rounded-2xl rounded-tl-none border border-slate-700 text-slate-200 shadow">
        Memory context cleared. How can I assist you with Nagpur Command Center operations?
      </div>
    `;
  }
}

// Navigation Helper
function aiBotNavigate(url) {
  appendAIMessage(`Navigating to <strong>${url}</strong>...`, 'user');
  showTypingIndicator(true);
  setTimeout(() => {
    window.location.href = url;
  }, 600);
}

// Append Chat Bubbles
function appendAIMessage(msg, sender = 'bot', actionBtn = null) {
  const history = document.getElementById('ai-chat-messages');
  if (!history) return;

  const bubble = document.createElement('div');
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (sender === 'user') {
    bubble.className = "bg-orange-600 text-white p-3 rounded-2xl rounded-tr-none ml-auto max-w-[85%] text-xs shadow space-y-1";
    bubble.innerHTML = `<div>${msg}</div><div class="text-[9px] text-orange-200 text-right font-mono">${timestamp}</div>`;
  } else {
    bubble.className = "bg-slate-800/90 p-3.5 rounded-2xl rounded-tl-none border border-slate-700 text-slate-200 max-w-[90%] text-xs shadow space-y-2";
    let content = `<div>${msg}</div>`;
    
    if (actionBtn) {
      content += `
        <div class="pt-1">
          <button onclick="${actionBtn.onClick}" class="px-3 py-1.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px] transition flex items-center gap-1.5">
            <i class="${actionBtn.icon}"></i> ${actionBtn.label}
          </button>
        </div>
      `;
    }

    content += `<div class="text-[9px] text-slate-400 font-mono text-right">${timestamp}</div>`;
    bubble.innerHTML = content;
  }

  history.appendChild(bubble);
  history.scrollTop = history.scrollHeight;
}

// Typing Indicator Manager
function showTypingIndicator(show) {
  const indicator = document.getElementById('ai-typing-indicator');
  if (indicator) {
    if (show) indicator.classList.remove('hidden');
    else indicator.classList.add('hidden');
  }
}

// Advanced Conversational Logic & Intent Processing
function handleAISubmit(event) {
  event.preventDefault();
  const input = document.getElementById('ai-input');
  const rawText = input.value.trim();
  if (!rawText) return;

  const query = rawText.toLowerCase();
  appendAIMessage(rawText, 'user');
  input.value = '';

  showTypingIndicator(true);

  // Simulate Natural Bot Response Latency
  setTimeout(() => {
    showTypingIndicator(false);
    processAIQuery(query, rawText);
  }, 600);
}

function processAIQuery(query, originalText) {

  // Intent 1: Navigation Request
  if (query.includes('traffic') || query.includes('signal') || query.includes('transit')) {
    if (query.includes('clear') || query.includes('override') || query.includes('sitabuldi')) {
      dispatchZoneAction('Sitabuldi Interchange', 'AI Bot Overrode Signal Duration (+30s)');
      appendAIMessage("I have dispatched an automated green signal extension (+30s) to clear the Sitabuldi bottleneck.");
    } else {
      appendAIMessage("Opening Traffic & Transit Command module...", 'bot', {
        label: "Go to Traffic Page",
        icon: "fa-solid fa-traffic-light",
        onClick: "aiBotNavigate('traffic.html')"
      });
    }
  } 
  else if (query.includes('zone') || query.includes('district') || query.includes('laxmi') || query.includes('dharampeth')) {
    appendAIMessage("Accessing the 10 NMC Administrative Zones Directory...", 'bot', {
      label: "Open Zones Directory",
      icon: "fa-solid fa-map-location-dot",
      onClick: "aiBotNavigate('zones.html')"
    });
  } 
  else if (query.includes('alert') || query.includes('emergency') || query.includes('disaster') || query.includes('ambazari')) {
    appendAIMessage("Fetching active disaster protocols and spillway advisories...", 'bot', {
      label: "Open Emergency Alerts",
      icon: "fa-solid fa-bell",
      onClick: "aiBotNavigate('alerts.html')"
    });
  } 
  else if (query.includes('dashboard') || query.includes('home') || query.includes('main')) {
    appendAIMessage("Returning to the Central Executive Operations Dashboard...", 'bot', {
      label: "Go to Dashboard",
      icon: "fa-solid fa-chart-pie",
      onClick: "aiBotNavigate('index.html')"
    });
  }

  // Intent 2: System Data Queries (Water / Power / Overall)
  else if (query.includes('water') || query.includes('ocw') || query.includes('mld') || query.includes('reservoir')) {
    appendAIMessage(`<strong>OCW Water Supply Status:</strong><br>• Daily Output: ${SmartNagpurKnowledge.water.mld}<br>• Reservoirs: ${SmartNagpurKnowledge.water.capacity}<br>• Primary Source: ${SmartNagpurKnowledge.water.mainDam}`);
  }
  else if (query.includes('power') || query.includes('msedcl') || query.includes('electricity') || query.includes('grid')) {
    appendAIMessage(`<strong>MSEDCL Power Grid Status:</strong><br>• Current Load: ${SmartNagpurKnowledge.power.load}<br>• Grid Frequency: ${SmartNagpurKnowledge.power.frequency}<br>• Status: ${SmartNagpurKnowledge.power.gridStatus}`);
  }
  else if (query.includes('status') || query.includes('report') || query.includes('summary') || query.includes('health')) {
    appendAIMessage(`<strong>Nagpur Real-time Overview:</strong><br>💧 <strong>Water:</strong> ${SmartNagpurKnowledge.water.mld} (${SmartNagpurKnowledge.water.capacity})<br>⚡ <strong>Power:</strong> ${SmartNagpurKnowledge.power.load} @ ${SmartNagpurKnowledge.power.frequency}<br>🚦 <strong>Signals:</strong> ${SmartNagpurKnowledge.traffic.activeSignals}<br>🚨 <strong>Disaster Squads:</strong> ${SmartNagpurKnowledge.disaster.readiness}`);
  }

  // Intent 3: Direct Command Execution
  else if (query.includes('sync') || query.includes('refresh') || query.includes('update')) {
    dispatchZoneAction('City-Wide Grid', 'AI Bot Executed Total Telemetry Synchronization');
    appendAIMessage("City-wide operational telemetry sync complete. All 10 zonal hubs refreshed.");
  }
  else if (query.includes('logout') || query.includes('sign out') || query.includes('exit')) {
    appendAIMessage("Terminating officer security session...");
    setTimeout(() => handleLogout(), 1000);
  }

  // Intent 4: Small Talk / Greetings
  else if (query.includes('hi') || query.includes('hello') || query.includes('hey') || query.includes('who are you')) {
    appendAIMessage("Hello Officer! I am your AI assistant for Nagpur Metropolitan Command. Ask me anything regarding water grids, traffic signals, zonal overrides, or emergency alerts.");
  }

  // Fallback AI Help Response
  else {
    appendAIMessage(`I understood: <em>"${originalText}"</em>.<br><br>Here are commands I can run for you:<br>• <strong>"Show city status report"</strong><br>• <strong>"Open traffic control"</strong><br>• <strong>"What is the power load?"</strong><br>• <strong>"Execute city sync"</strong><br>• <strong>"Open zones directory"</strong>`);
  }
}
