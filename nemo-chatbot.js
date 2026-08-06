/* ==========================================================================
   NEMO GLOBAL AI CHATBOT SYSTEM (GEN-Z ANIMATED EDITION)
   ========================================================================== */

(function () {
  // Groq API Key Fallback
  const EMBEDDED_GROQ_KEY = "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";

  function getActiveGroqKey() {
    return localStorage.getItem('sm_groq_api_key') || EMBEDDED_GROQ_KEY;
  }

  // Inject Chatbot UI HTML & Styles into Page
  function injectNemoUI() {
    if (document.getElementById('nemo-global-container')) return;

    const chatbotHTML = `
      <div id="nemo-global-container" class="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
        
        <!-- Chat Drawer Window -->
        <div id="nemo-chat-drawer" class="hidden w-[380px] sm:w-[420px] h-[540px] bg-[#FFFDF8]/95 backdrop-blur-md rounded-3xl border-2 border-[#E8DFD1] shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300">
          
          <!-- Drawer Header with Mascot -->
          <div class="bg-gradient-to-r from-[#B84A39] via-[#E5934C] to-[#557C60] p-4 text-[#FFFDF8] flex justify-between items-center shadow-md">
            <div class="flex items-center gap-3">
              <!-- Animated Mascot Avatar -->
              <div class="w-11 h-11 rounded-full bg-[#FFFDF8] text-[#B84A39] flex items-center justify-center font-bold shadow-md border-2 border-[#F2A93B] animate-mascot relative">
                <i class="fa-solid fa-robot text-xl text-[#B84A39]"></i>
                <span class="absolute -top-1 -right-1 text-xs">✨</span>
              </div>
              <div>
                <h3 class="font-bold text-sm tracking-wide flex items-center gap-1.5">
                  Nemo AI Copilot
                  <span class="w-2.5 h-2.5 rounded-full bg-[#557C60] border border-white animate-pulse"></span>
                </h3>
                <p class="text-[10px] text-[#FFFDF8]/90 font-medium">Smart Nagpur AI Operator • Active</p>
              </div>
            </div>
            <button onclick="window.toggleNemoChat()" class="text-[#FFFDF8]/80 hover:text-white p-1 transition text-lg active:scale-90">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Chat Messages Container -->
          <div id="nemo-messages-box" class="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF6ED]/50 text-xs">
            <!-- Welcome Message -->
            <div class="flex gap-2.5 max-w-[88%]">
              <div class="w-8 h-8 rounded-full bg-[#B84A39] text-[#FFFDF8] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1 shadow-sm">🤖</div>
              <div class="bg-[#FFFDF8] p-3.5 rounded-2xl border border-[#E8DFD1] shadow-sm text-[#3B2A22] space-y-1">
                <p class="font-bold text-[#B84A39] text-[11px] flex items-center gap-1">
                  Nemo AI Guide <span class="bg-[#FEF3E2] text-[#E5934C] text-[9px] px-2 py-0.5 rounded-full font-bold">Online</span>
                </p>
                <p class="leading-relaxed">Namaste! I'm <b>Nemo</b> 🚀. Your AI co-pilot for Nagpur traffic, zone directories, analytics, or emergency alerts! How can I assist you today?</p>
                <span class="text-[9px] text-[#8C6D58] block text-right pt-1">Just now</span>
              </div>
            </div>
          </div>

          <!-- Quick Action Chips -->
          <div class="px-3 py-2.5 bg-[#FFFDF8] border-t border-[#E8DFD1] flex gap-1.5 overflow-x-auto">
            <button onclick="window.sendNemoPreset('How to report an emergency alert?')" class="px-3 py-1 bg-[#FAF6ED] hover:bg-[#E8DFD1] border border-[#E8DFD1] rounded-full text-[10px] font-bold text-[#634E42] whitespace-nowrap transition transform active:scale-95 shadow-sm">🚨 Emergency</button>
            <button onclick="window.sendNemoPreset('Tell me about Nagpur Metro & Traffic Corridors')" class="px-3 py-1 bg-[#FAF6ED] hover:bg-[#E8DFD1] border border-[#E8DFD1] rounded-full text-[10px] font-bold text-[#634E42] whitespace-nowrap transition transform active:scale-95 shadow-sm">🚦 Traffic & Metro</button>
            <button onclick="window.sendNemoPreset('What zones are in Smart Nagpur?')" class="px-3 py-1 bg-[#FAF6ED] hover:bg-[#E8DFD1] border border-[#E8DFD1] rounded-full text-[10px] font-bold text-[#634E42] whitespace-nowrap transition transform active:scale-95 shadow-sm">🗺️ City Zones</button>
          </div>

          <!-- Input Box -->
          <div class="p-3 bg-[#FFFDF8] border-t border-[#E8DFD1] flex items-center gap-2">
            <input type="text" id="nemo-input" onkeypress="window.handleNemoKeyPress(event)" placeholder="Ask Nemo anything about Smart Nagpur..." class="flex-1 bg-[#FAF6ED] border border-[#E8DFD1] rounded-2xl px-3.5 py-2.5 text-xs text-[#3B2A22] focus:outline-none focus:border-[#B84A39]">
            <button onclick="window.sendNemoMessage()" class="w-9 h-9 bg-[#B84A39] hover:bg-[#A03E2F] text-[#FFFDF8] rounded-2xl flex items-center justify-center shadow-md transition flex-shrink-0 active:scale-95">
              <i class="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </div>

        </div>

        <!-- Animated Floating Mascot Launcher Button -->
        <button onclick="window.toggleNemoChat()" class="relative group w-16 h-16 bg-[#B84A39] hover:bg-[#A03E2F] text-[#FFFDF8] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-2 border-[#F2A93B] active:scale-90 animate-mascot">
          <i class="fa-solid fa-robot text-2xl group-hover:rotate-12 transition-transform"></i>
          <span class="absolute -top-1 -right-1 w-4 h-4 bg-[#557C60] rounded-full border-2 border-white animate-pulse"></span>
        </button>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  // Global Chatbot Logic
  window.toggleNemoChat = function () {
    const drawer = document.getElementById('nemo-chat-drawer');
    if (drawer) drawer.classList.toggle('hidden');
  };

  window.handleNemoKeyPress = function (e) {
    if (e.key === 'Enter') window.sendNemoMessage();
  };

  window.sendNemoPreset = function (text) {
    const input = document.getElementById('nemo-input');
    if (input) {
      input.value = text;
      window.sendNemoMessage();
    }
  };

  window.sendNemoMessage = async function () {
    const inputElem = document.getElementById('nemo-input');
    const msgText = inputElem.value.trim();
    if (!msgText) return;

    const box = document.getElementById('nemo-messages-box');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append User Message
    box.innerHTML += `
      <div class="flex gap-2.5 max-w-[85%] ml-auto justify-end">
        <div class="bg-[#B84A39] text-[#FFFDF8] p-3 rounded-2xl shadow-sm space-y-1">
          <p class="leading-relaxed">${msgText}</p>
          <span class="text-[9px] text-white/70 block text-right pt-0.5">${timeStr}</span>
        </div>
      </div>
    `;
    inputElem.value = '';
    box.scrollTop = box.scrollHeight;

    // Typing Indicator
    const typingId = 'nemo-typing-' + Date.now();
    box.innerHTML += `
      <div id="${typingId}" class="flex gap-2.5 max-w-[85%]">
        <div class="w-8 h-8 rounded-full bg-[#B84A39] text-[#FFFDF8] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1 shadow-sm">🤖</div>
        <div class="bg-[#FFFDF8] p-3 rounded-2xl border border-[#E8DFD1] text-[#8C6D58] italic flex items-center gap-2">
          <i class="fa-solid fa-spinner animate-spin text-[#B84A39]"></i> Nemo is thinking...
        </div>
      </div>
    `;
    box.scrollTop = box.scrollHeight;

    // Groq API Call
    const apiKey = getActiveGroqKey();
    const systemPrompt = "You are Nemo, the official AI operations guide for Smart Nagpur Municipal Corporation. Assist users on all website sections including Dashboard Analytics, Zones Directory, Live Traffic & Transit, and Emergency Alerts. Keep responses polite, structured, concise, and helpful.";

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: msgText }
          ],
          temperature: 0.3
        })
      });

      const data = await response.json();
      let reply = "I am currently unable to process your request. Please try again.";
      if (data.choices && data.choices[0]) {
        reply = data.choices[0].message.content;
      }

      document.getElementById(typingId)?.remove();

      box.innerHTML += `
        <div class="flex gap-2.5 max-w-[85%]">
          <div class="w-8 h-8 rounded-full bg-[#B84A39] text-[#FFFDF8] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1 shadow-sm">🤖</div>
          <div class="bg-[#FFFDF8] p-3.5 rounded-2xl border border-[#E8DFD1] shadow-sm text-[#3B2A22] space-y-1">
            <p class="font-bold text-[#B84A39] text-[11px]">Nemo Assistant</p>
            <p class="leading-relaxed whitespace-pre-line">${reply}</p>
            <span class="text-[9px] text-[#8C6D58] block text-right pt-1">${timeStr}</span>
          </div>
        </div>
      `;
    } catch (err) {
      document.getElementById(typingId)?.remove();
      box.innerHTML += `
        <div class="flex gap-2.5 max-w-[85%]">
          <div class="w-8 h-8 rounded-full bg-[#B84A39] text-[#FFFDF8] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">🤖</div>
          <div class="bg-[#FFFDF8] p-3 rounded-2xl border border-[#E8DFD1] text-[#B84A39]">
            Unable to connect to Groq AI service.
          </div>
        </div>
      `;
    }

    box.scrollTop = box.scrollHeight;
  };

  // Auto-inject when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNemoUI);
  } else {
    injectNemoUI();
  }
})();
