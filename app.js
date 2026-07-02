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

const FAVORITES_KEY = 'aurx_favorite_symbols';

function getFavorites() {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; } catch (e) { return []; }
}

function saveFavorites(favs) { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs)); }

function reorderDashboardCards() {
    const container = document.getElementById('dashboardCards');
    if (!container) return;
    const favs = getFavorites();
    const cards = Array.from(container.querySelectorAll('.asset-card'));
    cards.sort((a, b) => {
        const aFav = favs.includes(a.dataset.symbol) ? 0 : 1;
        const bFav = favs.includes(b.dataset.symbol) ? 0 : 1;
        return aFav - bFav;
    });
    cards.forEach(card => container.appendChild(card));
}

function applyFavoriteStates() {
    const favs = getFavorites();
    document.querySelectorAll('.asset-card').forEach(card => {
        const star = card.querySelector('.fav-star');
        if (!star) return;
        if (favs.includes(card.dataset.symbol)) { star.classList.add('is-favorited'); } else { star.classList.remove('is-favorited'); }
    });
}

function toggleFavorite(symbol, element) {
    let favs = getFavorites();
    if (favs.includes(symbol)) { favs = favs.filter(s => s !== symbol); } else { favs.push(symbol); }
    saveFavorites(favs);
    applyFavoriteStates();
    reorderDashboardCards();
}

document.addEventListener('DOMContentLoaded', () => {
    applyFavoriteStates();
    reorderDashboardCards();
    initPullToRefresh();
    initInstallPrompt();
});

let deferredInstallPrompt = null;

function initInstallPrompt() {
    const installItem = document.getElementById('installAppItem');
    if (!installItem) return;

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) {
        installItem.style.display = 'none';
        return;
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        installItem.style.display = 'flex';
    });

    window.addEventListener('appinstalled', () => {
        deferredInstallPrompt = null;
        installItem.style.display = 'none';
    });

    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    if (isIos) {
        installItem.style.display = 'flex';
    }
}

function handleInstallClick() {
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.finally(() => {
            deferredInstallPrompt = null;
        });
    } else if (isIos) {
        alert('To install Aurx: tap the Share icon in Safari, then select "Add to Home Screen".');
    } else {
        alert('Install is not available in this browser yet. Try opening this app in Chrome or Edge on desktop/Android.');
    }
}

function initPullToRefresh() {
    const scrollContainer = document.getElementById('mainWorkspace');
    const indicator = document.getElementById('pullRefreshIndicator');
    const pullContent = document.getElementById('dashboardPullContent');
    const dashboardView = document.getElementById('view-dashboard');
    if (!scrollContainer || !indicator || !pullContent || !dashboardView) return;

    const THRESHOLD = 68;
    const MAX_PULL = 100;
    let startY = 0;
    let pulling = false;
    let currentPull = 0;
    let refreshing = false;

    function isDashboardActive() { return dashboardView.classList.contains('is-active'); }

    function setTransition(on) {
        pullContent.style.transition = on ? 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
        indicator.style.transition = on ? 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease' : 'opacity 0.2s ease';
    }

    scrollContainer.addEventListener('touchstart', (e) => {
        if (!isDashboardActive() || refreshing) { pulling = false; return; }
        if (scrollContainer.scrollTop <= 0) {
            startY = e.touches[0].clientY;
            pulling = true;
            setTransition(false);
        } else {
            pulling = false;
        }
    }, { passive: true });

    scrollContainer.addEventListener('touchmove', (e) => {
        if (!pulling || refreshing) return;
        const deltaY = e.touches[0].clientY - startY;
        if (deltaY <= 0) {
            currentPull = 0;
            pullContent.style.transform = '';
            indicator.style.opacity = 0;
            indicator.style.transform = 'translateY(0)';
            return;
        }
        currentPull = Math.min(deltaY * 0.45, MAX_PULL);
        pullContent.style.transform = `translateY(${currentPull}px)`;
        indicator.style.transform = `translateY(${currentPull}px)`;
        indicator.style.opacity = Math.min(currentPull / THRESHOLD, 1);
    }, { passive: true });

    scrollContainer.addEventListener('touchend', () => {
        if (!pulling || refreshing) { pulling = false; return; }
        pulling = false;
        if (currentPull >= THRESHOLD) {
            triggerRefresh();
        } else {
            resetPull();
        }
    });

    function resetPull() {
        setTransition(true);
        pullContent.style.transform = '';
        indicator.style.transform = 'translateY(0)';
        indicator.style.opacity = 0;
        currentPull = 0;
    }

    function triggerRefresh() {
        refreshing = true;
        indicator.classList.add('is-refreshing');
        setTransition(true);
        pullContent.style.transform = `translateY(${THRESHOLD}px)`;
        indicator.style.transform = `translateY(${THRESHOLD}px)`;
        indicator.style.opacity = 1;

        setTimeout(() => {
            reloadDashboardWidgets();
            indicator.classList.remove('is-refreshing');
            indicator.classList.add('is-done');
            setTimeout(() => {
                indicator.classList.remove('is-done');
                resetPull();
                refreshing = false;
            }, 550);
        }, 900);
    }

    function reloadDashboardWidgets() {
        document.querySelectorAll('#dashboardCards .tradingview-widget-container').forEach(container => {
            const oldScript = container.querySelector('script');
            if (!oldScript) return;
            const newScript = document.createElement('script');
            newScript.type = 'text/javascript';
            newScript.async = true;
            newScript.src = oldScript.src;
            newScript.textContent = oldScript.textContent;
            container.innerHTML = '';
            container.appendChild(newScript);
        });
    }
}
