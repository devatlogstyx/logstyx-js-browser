//@ts-check
const { attachGlobalEventListeners, getDeviceParams, sendFn } = require("../lib/browser");
const useLogstyx = require("logstyx-js-core")

const defaultDevice = getDeviceParams()
let instance;

if (typeof window !== "undefined") {
    if (window.LogstyxConfig && !window.Logstyx) {
        instance = useLogstyx({
            ...window.LogstyxConfig,
            sendFunc: sendFn,
            device: window.LogstyxConfig.device || defaultDevice,
        });
        window.Logstyx = instance;
        attachGlobalEventListeners(instance);
        if (window?.LogstyxConfig?.captureUncaught === true) {
            try {
                if (typeof window !== "undefined") {
                    window.onerror = (msg, src, lineno, colno, err) => {
                        instance.critical({
                            title: err?.name || "Unknown Error",
                            message: msg || err?.message,
                            stack: err?.stack || null
                        });
                    };
                }
            } catch (e) {
                console.error(e)
            }
        }

        if (window?.LogstyxConfig?.captureUnhandledRejections === true) {
            try {
                const handler = (reason) => {
                    const message = reason instanceof Error ? reason.message : String(reason);
                    const stack = reason instanceof Error ? reason.stack : undefined;
                    const title = reason instanceof Error ? reason.name : "Unhandled Rejection";

                    instance.critical({ title, message, stack });
                };

                window.onunhandledrejection = (e) => handler(e.reason);
            } catch (e) {
                console.error(e)
            }
        }
    } else if (window.Logstyx) {
        instance = window.Logstyx;
    }
}