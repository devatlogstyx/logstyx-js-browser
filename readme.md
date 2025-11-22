# Logstyx JS Browser SDK

A lightweight JavaScript library for event tracking and monitoring in web applications. Logstyx collects device and browser information and logs events for analytics and debugging purposes.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
  - [Basic Configuration](#basic-configuration)
  - [Advanced Configuration](#advanced-configuration)
  - [Data Attributes](#data-attributes)
- [Reserved Fields](#reserved-fields)
- [Examples](#examples)
- [License](#license)

## Installation

1. Download the SDK from the [release page](https://github.com/devatlogstyx/logstyx-js-browser/releases)
2. Add the configuration and script to your HTML:

```html
<script>
  window.LogstyxConfig = {
    projectId: "your_logstyx_project_id",
    endpoint: 'https://your-domain.com/api/v1/logs' // Your self-hosted instance
  }
</script>
<script src="logstyx-browser.min.js"></script>
```

> **Note:** Replace `logstyx-browser.min.js` with the actual filename from the release, and set your own `projectId` and `endpoint`.

## Configuration

### Basic Configuration

The minimum required configuration:

```javascript
window.LogstyxConfig = {
  projectId: "your_logstyx_project_id",
  endpoint: 'https://your-domain.com/api/v1/logs'
}
```

### Advanced Configuration

Configure the SDK by setting `window.LogstyxConfig` before loading the script:

```javascript
window.LogstyxConfig = {
  projectId: "your_logstyx_project_id",
  endpoint: 'https://your-domain.com/api/v1/logs',
  
  // Automatic error capture
  captureUncaught: true,                // Capture uncaught exceptions
  captureUnhandledRejections: true,     // Capture unhandled promise rejections
  
  // Event tracking configuration
  tracker: {
    events: ['click', 'submit'],        // DOM events to track
    context: ['event', 'url', 'referrer', 'pageTitle'], // Context data to include
    data: ['tag', 'id', 'class', 'text'], // Element attributes to capture
    selector: ["a", ".some_class"]      // CSS selectors to monitor
  }
};
```

**Configuration Options:**

| Option | Type | Description |
|--------|------|-------------|
| `projectId` | string | Your Logstyx project identifier (required) |
| `endpoint` | string | Your self-hosted Logstyx API endpoint (required) |
| `captureUncaught` | boolean | Automatically capture uncaught JavaScript exceptions |
| `captureUnhandledRejections` | boolean | Automatically capture unhandled Promise rejections |
| `tracker.events` | array | DOM events to automatically track (e.g., 'click', 'submit', 'change') |
| `tracker.context` | array | Context fields to include: 'event', 'url', 'referrer', 'pageTitle' |
| `tracker.data` | array | Element attributes to capture: 'tag', 'id', 'class', 'text' |
| `tracker.selector` | array | CSS selectors for elements to monitor. If empty, tracks all elements |

**Tracking Behavior:**

- If `tracker.selector` is empty or not set, the SDK tracks all elements for the configured events
- If `tracker.selector` is specified, only matching elements are tracked (unless they have `data-logstyx-event`)
- Elements with `data-logstyx-event` are always tracked regardless of selector configuration
- Elements with `data-logstyx-skip="true"` are never tracked

**Fallback Payload:**

When an element doesn't have `data-logstyx-payload`, the SDK automatically creates a fallback payload based on `tracker.data`:

- `tag` - Element tag name (e.g., "BUTTON", "A")
- `id` - Element ID if present
- `class` - Element class names if present
- `text` - First 100 characters of element text content

### Data Attributes

You can add tracking to specific HTML elements using `data-logstyx-*` attributes:

```html
<button 
  data-logstyx-event="click" 
  data-logstyx-context='{"user":"userId", "item":"itemId"}' 
  data-logstyx-payload='{"amount":99.99, "discount":10}' 
  data-logstyx-level="info">
  Complete Purchase
</button>
```

**Available Attributes:**

| Attribute | Description | Example |
|-----------|-------------|---------|
| `data-logstyx-event` | DOM event to track (space-separated for multiple) | `"click"`, `"submit"`, `"click submit"` |
| `data-logstyx-context` | Context metadata as JSON object | `'{"user":"123", "page":"checkout"}'` |
| `data-logstyx-payload` | Event-specific data as JSON object | `'{"amount":99.99, "currency":"USD"}'` |
| `data-logstyx-level` | Log severity level (default: "info") | `"info"`, `"warn"`, `"error"` |
| `data-logstyx-skip` | Skip tracking this element | `"true"` |

> **Important:** The `data-logstyx-context` and `data-logstyx-payload` attributes must contain valid JSON with double quotes around keys and string values.

## Reserved Fields

These fields are automatically populated by the SDK when included in `tracker.context`:

| Field | Description | Example |
|-------|-------------|---------|
| `context.event` | The DOM event type that triggered the log | `"click"`, `"submit"` |
| `context.url` | Current page URL | `"https://example.com/pricing"` |
| `context.referrer` | Previous page URL (or null if none) | `"https://google.com"` |
| `context.pageTitle` | Page title (or null if none) | `"Pricing - Example"` |

**Additional Device Information:**

The SDK automatically includes device information with every event:

- `type` - Always "browser"
- `origin` - Window origin (e.g., "https://example.com")
- `os` - Operating system (Windows, MacOS, Linux, Android, iOS, Unknown)
- `browser` - Browser name (Chrome, Edge, Firefox, Safari, Unknown)
- `screen` - Screen resolution (e.g., "1920x1080")

## Examples

### Track Form Submissions

```html
<script>
  window.LogstyxConfig = {
    projectId: "proj_abc123",
    endpoint: 'https://logs.example.com/api/v1/logs',
    tracker: {
      events: ['submit'],
      context: ['event', 'url', 'pageTitle'],
      selector: ['form']
    }
  }
</script>
<script src="logstyx-browser.min.js"></script>

<form data-logstyx-context='{"form":"newsletter"}'>
  <input type="email" name="email" required>
  <button type="submit">Subscribe</button>
</form>
```

### Track Button Clicks with Custom Data

```html
<button 
  data-logstyx-event="click"
  data-logstyx-context='{"feature":"export", "format":"pdf"}'
  data-logstyx-payload='{"fileSize":2048, "pages":15}'
  data-logstyx-level="info">
  Export to PDF
</button>
```

### Track Specific Links

```html
<script>
  window.LogstyxConfig = {
    projectId: "proj_abc123",
    endpoint: 'https://logs.example.com/api/v1/logs',
    tracker: {
      events: ['click'],
      context: ['event', 'url'],
      data: ['tag', 'id', 'text'],
      selector: ['a.track-link', '.cta-button']
    }
  }
</script>

<a href="/pricing" class="track-link">View Pricing</a>
<a href="/signup" class="cta-button">Get Started</a>
```

### Skip Tracking on Specific Elements

```html
<!-- This button will be tracked -->
<button data-logstyx-event="click">Track Me</button>

<!-- This button will NOT be tracked -->
<button data-logstyx-skip="true">Don't Track Me</button>
```

### Capture Errors Automatically

```html
<script>
  window.LogstyxConfig = {
    projectId: "proj_abc123",
    endpoint: 'https://logs.example.com/api/v1/logs',
    captureUncaught: true,
    captureUnhandledRejections: true
  }
</script>
<script src="logstyx-browser.min.js"></script>

<!-- All uncaught errors and unhandled promise rejections will be logged -->
```

### Track Multiple Events on One Element

```html
<input 
  type="text"
  data-logstyx-event="focus blur change"
  data-logstyx-context='{"field":"email"}'
  data-logstyx-level="info"
  placeholder="Enter your email">
```