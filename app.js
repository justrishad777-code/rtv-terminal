let chartState = { symbol: "OANDA:XAUUSD", interval: "D", style: "1", showDraw: false };
let isChartInitialized = false;

function renderDynamicChart() {
    const wrapper = document.getElementById('dynamic-chart-wrapper');
    wrapper.innerHTML = ''; 
    const container = document.createElement('div');
    container.id = "tv_dynamic_container";
    container.style.height = "100%";
    container.style.width = "100%";
    wrapper.appendChild(container);

    new TradingView.widget({
        "autosize": true, "symbol": chartState.symbol, "interval": chartState.interval, "timezone": "Asia/Dhaka", "theme": "dark", "style": chartState.style, "locale": "en", "enable_publishing": false, "backgroundColor": "#000000", "gridColor": "rgba(255, 255, 255, 0.04)", "hide_top_toolbar": true, "hide_side_toolbar": !chartState.showDraw, "hide_legend": true, "allow_symbol_change": false, "save_image": false, "container_id": "tv_dynamic_container",
        "studies_overrides": {},
        "overrides": {
            "mainSeriesProperties.candleStyle.upColor": "#00C873", "mainSeriesProperties.candleStyle.downColor": "#FF2E50", "mainSeriesProperties.candleStyle.borderUpColor": "#00C873", "mainSeriesProperties.candleStyle.borderDownColor": "#FF2E50", "mainSeriesProperties.candleStyle.wickUpColor": "#00C873", "mainSeriesProperties.candleStyle.wickDownColor": "#FF2E50",
            "mainSeriesProperties.hollowCandleStyle.upColor": "#00C873", "mainSeriesProperties.hollowCandleStyle.downColor": "#FF2E50", "mainSeriesProperties.hollowCandleStyle.borderUpColor": "#00C873", "mainSeriesProperties.hollowCandleStyle.borderDownColor": "#FF2E50", "mainSeriesProperties.hollowCandleStyle.wickUpColor": "#00C873", "mainSeriesProperties.hollowCandleStyle.wickDownColor": "#FF2E50"
        }
    });
}

function toggleBranding(element) {
    element.classList.toggle('is-expanded');
    if(element.classList.contains('is-expanded')) {
        setTimeout(() => element.classList.remove('is-expanded'), 3000);
    }
}

function openChartSettings() { document.getElementById('chartSettingsModal').style.display = 'flex'; }
function closeChartSettings() { document.getElementById('chartSettingsModal').style.display = 'none'; }
function applyTimeframe(intervalCode, element) { chartState.interval = intervalCode; let siblings = element.parentNode.querySelectorAll('.tf-option'); siblings.forEach(opt => opt.classList.remove('is-active')); element.classList.add('is-active'); renderDynamicChart(); }
function applyStyle(styleCode, element) { chartState.style = styleCode; let siblings = element.parentNode.querySelectorAll('.tf-option'); siblings.forEach(opt => opt.classList.remove('is-active')); element.classList.add('is-active'); renderDynamicChart(); }
function toggleDrawingMenu(element) { chartState.showDraw = !chartState.showDraw; if(chartState.showDraw) { element.classList.add('is-active'); element.innerText = "Hide Left Toolbar"; } else { element.classList.remove('is-active'); element.innerText = "Show Left Toolbar"; } renderDynamicChart(); }

function openSearchModal() { document.getElementById('searchModal').style.display = 'flex'; document.getElementById('searchInput').focus(); }
function closeSearchModal() { document.getElementById('searchModal').style.display = 'none'; }
function selectSymbol(fullSymbol, subTitle, shortName) { chartState.symbol = fullSymbol; document.getElementById("chart-title").innerText = shortName; document.getElementById("chart-subtitle").innerText = subTitle; closeSearchModal(); renderDynamicChart(); }
function filterWatchlist() { let filter = document.getElementById('searchInput').value.toUpperCase(); let li = document.getElementById('watchlistItems').getElementsByTagName('li'); for (let i = 0; i < li.length; i++) { let txtValue = li[i].textContent || li[i].innerText; if (txtValue.toUpperCase().indexOf(filter) > -1) { li[i].style.display = ""; } else { li[i].style.display = "none"; } } }

function routeTo(viewId, headerTitle, triggerElement) {
    document.querySelectorAll('.view-module').forEach(view => view.classList.remove('is-active')); document.getElementById(viewId).classList.add('is-active'); document.querySelectorAll('.nav-action').forEach(btn => btn.classList.remove('is-active')); triggerElement.classList.add('is-active');
    const globalHeader = document.getElementById('globalHeader'); const mainWorkspace = document.getElementById('mainWorkspace');
    if (viewId === 'view-terminal') { globalHeader.style.display = 'none'; mainWorkspace.style.padding = '0 0 50px 0'; mainWorkspace.style.overflowY = 'hidden'; if (!isChartInitialized) { renderDynamicChart(); isChartInitialized = true; } } else { globalHeader.style.display = 'flex'; document.querySelector('#globalHeader h1').innerText = headerTitle; mainWorkspace.style.padding = '10px 15px 70px 15px'; mainWorkspace.style.overflowY = 'auto'; }
}

function performSystemCleanup() { if (window.confirm("Perform cache purge?")) { localStorage.clear(); sessionStorage.clear(); window.location.reload(true); } }
if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(err => console.log('SW error')); }); }
