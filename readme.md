# Logstyx JS Browser SDK

Logstyx JS Browser SDK is a JavaScript library designed to facilitate event tracking and monitoring in web applications. This SDK collects device and browser information and logs events for analytics and debugging purposes.

## Table of Contents
- [Installation](#installation)
- [Configuration](#configuration)
- [License](#license)

## Installation

To install the Logstyx JS SDK, download from release page and then:

```html
<script>
  window.LogstyxConfig={
    projectId:"your_logstyx_project_id",
  }
  </script>
  <script src="js_file_from_release"></script>
```

## Configuration

To configure your Logstyx SDK instance, provide an object with necessary parameters like API keys, device information, and more when initializing the SDK.

You can configure the logging events and the data you want to collect by modifying the global LogstyxConfig:

```javascript
window.LogstyxConfig = {
  projectId: "your_logstyx_project_id",
  captureUncaught: true,
  captureUnhandledRejections: true,
  tracker: {
    events: ['click', 'submit'],
    context: ['url', 'referrer', 'title'],
    data: ['tag', 'id', 'text'],
    selector:["a",".some_class"]
  },
};
```
but you can also attach the element you want to monitor with data-logstyx* attribute 
```html
<button 
  data-logstyx-event="click" 
  data-logstyx-context='{user:userId, item:itemId}' 
  data-logstyx-payload='{amount:99.99, discount:10}' 
  data-logstyx-level="info">
  Complete Purchase
</button>
```

## Reserved Fields

These fields are automatically populated:

- `context.url` - Current page URL
- `context.event` - URL path
- `context.referrer` - Previous page
- `context.title` - Page title
## License

This project is licensed under the ISC License. See the LICENSE file for details. 
