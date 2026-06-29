/**
 * RTV Market Terminal - Core Application Logic
 * Initializes charting widgets and handles UI routing.
 */

// Global Chart State
const chartState = {
    interval: "D",
    style: "1",      
    showDraw: false  
};

let isChartInitialized = false;

/**
 * Initializes or updates the TradingView dynamic widget.
 * Wipes the existing container to enforce new parameters.
 */
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
        "symbol": "OANDA:XAUUSD",
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
        "container_id": "tv_dynamic_container"
    });
}

/**
 * Controls visibility of the timeframe selection modal
 */
function toggleTimeframeMenu() {
    document.getElementById('tf-dropdown').classList.toggle('is-visible');
}

/**
 * Updates timeframe state and triggers re-render
 */
function applyTimeframe(intervalCode, label, element) {
    chartState.interval = intervalCode;
    
    document.getElementById('current-tf-label').innerText = label;
    
    document.querySelectorAll('.tf-option').forEach(opt => opt.classList.remove('is-active'));
    element.classList.add('is-active');
    
    document.getElementById('tf-dropdown').classList.remove('is-visible');
    renderDynamicChart();
}

/**
 * Updates charting tools (drawing & styles)
 */
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

/**
 * Core application router for View Modules
 */
function routeTo(viewId, headerTitle, triggerElement) {
    // Manage Views
    document.querySelectorAll('.view-module').forEach(view => {
        view.classList.remove('is-active');
    });
    document.getElementById(viewId).classList.add('is-active');

    // Manage Nav State
    document.querySelectorAll('.nav-action').forEach(btn => {
        btn.classList.remove('is-active');
    });
    triggerElement.classList.add('is-active');
    
    const globalHeader = document.getElementById('globalHeader');
    const mainWorkspace = document.getElementById('mainWorkspace');

    // View-specific adjustments
    if (viewId === 'view-terminal') {
        globalHeader.style.display = 'none';
        mainWorkspace.style.padding = '0';
        
        // Lazy load the chart widget to optimize initial app load
        if (!isChartInitialized) {
            renderDynamicChart();
            isChartInitialized = true;
        }
    } else {
        globalHeader.style.display = 'flex';
        document.getElementById('header-title').innerText = headerTitle;
        // Default workspace padding (accounts for bottom nav clearance)
        mainWorkspace.style.padding = '10px 15px 120px 15px';
    }
}

/**
 * Handles the RTV Monogram interactive branding
 */
function toggleBranding(element) {
    element.classList.toggle('is-expanded');
    
    if(element.classList.contains('is-expanded')) {
        setTimeout(() => {
            element.classList.remove('is-expanded');
        }, 3000);
    }
}
