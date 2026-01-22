//@ts-check

const { safeParse } = require("../helper/function");

exports.getOSFromUserAgent = (ua) => {
    if (/Windows NT/.test(ua)) return "Windows";
    if (/Mac OS X/.test(ua)) return "MacOS";
    if (/Linux/.test(ua)) return "Linux";
    if (/Android/.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
    return "Unknown";
}

exports.getBrowserFromUserAgent = (ua) => {
    if (/Chrome/.test(ua) && !/Edg/.test(ua)) return "Chrome";
    if (/Edg/.test(ua)) return "Edge";
    if (/Firefox/.test(ua)) return "Firefox";
    if (/Safari/.test(ua) && !/Chrome/.test(ua)) return "Safari";
    return "Unknown";
}

exports.sendFn = (endpoint, { body, }) => {
    const blob = new Blob([body], { type: 'application/json' });
    return navigator.sendBeacon(endpoint, blob);
}

exports.getDeviceParams = () => {
    return {
        "type": "browser",
        origin: window.location.origin,
        os: this.getOSFromUserAgent(navigator?.userAgent),
        browser: this.getBrowserFromUserAgent(navigator?.userAgent),
        screen: `${window?.screen?.width}x${window?.screen?.height}`
    }
}

const __logstyxTrackerDefaultConfig = {
    events: [],
    context: [],
    data: [],
    selector: []
};

const __logstyxTrackerConfig = {
    ...__logstyxTrackerDefaultConfig,
    ...(window?.LogstyxConfig?.tracker || {})
};

function shouldTrackElement(el) {
    // Always track if element has data-logstyx-event
    if (el.closest("[data-logstyx-event]")) return true;

    // If selector is not set, track everything
    if (!__logstyxTrackerConfig.selector || __logstyxTrackerConfig.selector.length === 0) return true;

    // Otherwise, track only if it matches one of the selectors
    return __logstyxTrackerConfig.selector.some(sel => el.matches(sel));
}


// @ts-ignore
exports.getBrowserContextExtras = (eventType) => {
    const ctx = {};
    __logstyxTrackerConfig.context.forEach(key => {
        if (key === "event") ctx.event = eventType;
        else if (key === "url") ctx.url = location.href;
        else if (key === "referrer") ctx.referrer = document.referrer || null;
        else if (key === "pageTitle") ctx.title = document.title || null;
    });
    return ctx;
};


const buildFallbackPayload = (el) => {
    const payload = {};
    __logstyxTrackerConfig.data.forEach(key => {
        if (key === "tag") payload.tag = el.tagName;
        else if (key === "id" && el.id) payload.id = el.id;
        else if (key === "class" && el.className) payload.class = el.className;
        else if (key === "text") payload.text = (el.textContent || "").trim().slice(0, 100);
    });
    return payload;
};

exports.attachGlobalEventListeners = (instance) => {
    const dynamicEvents = new Set(__logstyxTrackerConfig.events);

    document.querySelectorAll("[data-logstyx-event]").forEach(el => {
        const types = el.dataset.logstyxEvent.split(/\s+/);
        types.forEach(type => dynamicEvents.add(type));
    });

    dynamicEvents.forEach(eventType => {
        document.addEventListener(eventType, (e) => {
            if (!e.target || e.target.closest("[data-logstyx-skip='true']")) return;
            if (!shouldTrackElement(e.target)) return;

            const target = e.target.closest(`[data-logstyx-event~='${eventType}']`);
            const isFallback = !target;

            const level = target?.dataset?.logstyxLevel || "info";
            const context = {
                ...safeParse(target?.dataset?.logstyxContext),
                ...this.getBrowserContextExtras(eventType),
                ...(isFallback ? { fallback: true } : {})
            };

            const payload = target?.dataset?.logstyxPayload
                ? safeParse(target.dataset.logstyxPayload)
                : buildFallbackPayload(e.target);
            instance.setContext(context)
            instance[level]?.(payload);
            instance.clearContext()
        });
    });

};