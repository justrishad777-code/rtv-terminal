let chartState = {
    symbol: "OANDA:XAUUSD",
    interval: "D",
    style: "1",      
    showDraw: false  
};

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
        "autosize": true,
        "symbol": chartState.symbol,
        "interval": chartState.interval,
        "timezone": "Asia/Dhaka",
        "theme": "dark",
        "style": chartState.style,
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "#000000",
        "gridColor": "rgba(255, 255, 255, 0.04)",
        "hide_top_toolbar": true,
        "hide_side_toolbar": !chartState.showDraw, 
        "hide_legend": true,
        "allow_symbol_change": false,
        "save_image": false,
        "container_id": "tv_dynamic_container",
        // WEBULL CANDLE DESIGN (GREEN & RED OVERRIDES)
        "studies_overrides": {},
        "overrides": {
            "mainSeriesProperties.candleStyle.upColor": "#00C873",
            "mainSeriesProperties.candleStyle.downColor": "#FF2E50",
            "mainSeriesProperties.candleStyle.borderUpColor": "#00C873",
            "mainSeriesProperties.candleStyle.borderDownColor": "#FF2E50",
            "mainSeriesProperties.candleStyle.wickUpColor": "#00C873",
            "mainSeriesProperties.candleStyle.wickDownColor": "#FF2E50"
        }
    });
}

// SEARCH ICON LOGIC
function changeSymbol() {
    let newSymbol = prompt("Enter Symbol (e.g., BINANCE:BTCUSDT, NASDAQ:AAPL):", chartState.symbol);
    if (newSymbol && newSymbol.trim() !== "") {
        chartState.symbol = newSymbol.trim().toUpperCase();
        document.getElementById("chart-title").innerText = chartState.symbol.split(':').pop(); // Update Title
        renderDynamicChart();
    }
}

function toggleTimeframeMenu() {
    document.getElementById('tf-dropdown').classList.toggle('is-visible');
}

function applyTimeframe(intervalCode, label, element) {
    chartState.interval = intervalCode;
    document.getElementById('current-tf-label').innerText = label;
    document.querySelectorAll('.tf-option').forEach(opt => opt.classList.remove('is-active'));
    element.classList.add('is-active');
    document.getElementById('tf-dropdown').classList.remove('is-visible');
    renderDynamicChart();
}

function updateChartSetting(actionType, value, element) {
    if (actionType === 'style') {
        chartState.style = chartState.style === "1" ? "3" : "1";
        element.classList.toggle('is-selected');
    }
    else if (actionType === 'draw') {
        chartState.showDraw = !chartState.showDraw;
        element.classList.toggle('is-selected');
    }
    renderDynamicChart();
}

function routeTo(viewId, headerTitle, triggerElement) {
    document.querySelectorAll('.view-module').forEach(view => {
        view.classList.remove('is-active');
    });
    document.getElementById(viewId).classList.add('is-active');

    document.querySelectorAll('.nav-action').forEach(btn => {
        btn.classList.remove('is-active');
    });
    triggerElement.classList.add('is-active');
    
    const globalHeader = document.getElementById('globalHeader');
    const mainWorkspace = document.getElementById('mainWorkspace');

    if (viewId === 'view-terminal') {
        globalHeader.style.display = 'none';
        mainWorkspace.style.padding = '0';
        mainWorkspace.style.overflowY = 'hidden'; 
        
        if (!isChartInitialized) {
            renderDynamicChart();
            isChartInitialized = true;
        }
    } else {
        globalHeader.style.display = 'flex';
        document.getElementById('header-title').innerText = headerTitle;
        mainWorkspace.style.padding = '10px 15px 120px 15px';
        mainWorkspace.style.overflowY = 'auto'; 
    }
}

function toggleBranding(element) {
    element.classList.toggle('is-expanded');
    if(element.classList.contains('is-expanded')) {
        setTimeout(() => {
            element.classList.remove('is-expanded');
        }, 3000);
    }
}

function performSystemCleanup() {
    if (window.confirm("Perform cache purge? This clears temporary system buffers.")) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload(true);
    }
}

// REGISTER SERVICE WORKER FOR APP INSTALL (PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(reg => {
            console.log('SW registered');
        }).catch(err => console.log('SW error', err));
    });
}
