<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Nagpur | Emergency Alerts</title>
  
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body class="text-slate-100 min-h-screen flex flex-col">

  <header class="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-40 shadow-xl">
    <div class="max-w-[1400px] mx-auto flex justify-between items-center">
      <div class="flex items-center gap-3">
        <a href="index.html" class="w-11 h-11 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-orange-600/30 border border-orange-400">
          NMC
        </a>
        <div>
          <h1 class="text-lg font-bold text-white leading-none">Smart Nagpur</h1>
          <p class="text-xs text-slate-300 font-mono mt-0.5">Disaster Response & Broadcasting</p>
        </div>
      </div>

      <nav class="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
        <a href="index.html" class="hover:text-orange-400 transition flex items-center gap-1.5"><i class="fa-solid fa-chart-pie"></i> Dashboard</a>
        <a href="zones.html" class="hover:text-orange-400 transition flex items-center gap-1.5"><i class="fa-solid fa-map-location-dot"></i> Zones Directory</a>
        <a href="traffic.html" class="hover:text-orange-400 transition flex items-center gap-1.5"><i class="fa-solid fa-traffic-light"></i> Traffic & Transit</a>
        <a href="alerts.html" class="text-orange-400 hover:text-white transition flex items-center gap-1.5"><i class="fa-solid fa-bell"></i> Alerts & Emergency</a>
      </nav>

      <button onclick="handleLogout()" class="px-4 py-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-full text-xs font-bold transition flex items-center gap-1.5">
        <i class="fa-solid fa-right-from-bracket"></i> Logout
      </button>
    </div>
  </header>

  <main class="flex-1 p-6 max-w-[1400px] w-full mx-auto space-y-6">
    <div class="glass-card p-6 rounded-3xl border border-red-800/40 flex justify-between items-center shadow-2xl">
      <div>
        <span class="text-xs font-mono text-red-400 uppercase tracking-widest block mb-1">Disaster Management Protocol</span>
        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
          <span class="w-10 h-10 rounded-full bg-red-950 text-red-400 flex items-center justify-center border border-red-800"><i class="fa-solid fa-triangle-exclamation"></i></span>
          Active Emergency Advisories
        </h2>
        <p class="text-xs text-slate-300 mt-1">Nag River water level monitoring, Ambazari overflow gates, and team dispatch.</p>
      </div>
    </div>

    <div class="space-y-4">
      <div class="glass-card border border-amber-800/60 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold rounded-full uppercase font-mono">Moderate Priority</span>
            <span class="text-xs text-slate-300 font-mono">Zone 2: Dharampeth</span>
          </div>
          <h3 class="text-lg font-bold text-white">Ambazari Overflow Canal Monitoring</h3>
          <p class="text-xs text-slate-300">Spillway level at 82% capacity. NDRF and NMC local squad placed on Level 1 alert.</p>
        </div>

        <button onclick="dispatchZoneAction('Dharampeth Alert', 'Disaster Response Boat Unit Deployed')" class="px-5 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-full shadow-lg transition whitespace-nowrap">
          Deploy Local Rescue Unit
        </button>
      </div>

      <div class="glass-card border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold rounded-full uppercase font-mono">Standby</span>
            <span class="text-xs text-slate-300 font-mono">Zone 6: Gandhi Baugh</span>
          </div>
          <h3 class="text-lg font-bold text-white">Itwari Market Fire Hydrant Test</h3>
          <p class="text-xs text-slate-300">Routine high-pressure inspection for tight-lane commercial fire preparedness.</p>
        </div>

        <button onclick="dispatchZoneAction('Gandhi Baugh Alert', 'Hydrant Pressure Verification Completed')" class="px-5 py-3 bg-slate-800 hover:bg-orange-600 text-white font-bold text-xs rounded-full shadow-lg transition whitespace-nowrap">
          Verify Station Readiness
        </button>
      </div>
    </div>
  </main>

  <script src="app.js"></script>
  <script src="floating-widgets.js"></script>
  <script src="ai-bot.js"></script>
</body>
</html>
