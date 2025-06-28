# Frame Display Troubleshooting Guide

## Overview
This guide helps diagnose and fix issues when frames are not displaying changes properly in web applications, particularly in development environments like StackBlitz, CodeSandbox, or local development servers.

## 🔍 Step 1: Check Frame Element Initialization

### 1.1 Verify Frame is in DOM
```javascript
// Check if frame element exists
const frame = document.getElementById('preview-frame');
console.log('Frame element:', frame);
console.log('Frame visibility:', window.getComputedStyle(frame).visibility);
console.log('Frame display:', window.getComputedStyle(frame).display);
```

### 1.2 Check Frame Loading State
```javascript
// Monitor frame load events
const frame = document.querySelector('iframe');
frame.addEventListener('load', () => {
  console.log('Frame loaded successfully');
});

frame.addEventListener('error', (e) => {
  console.error('Frame loading error:', e);
});
```

### 1.3 Verify Frame Source
```javascript
// Check frame source URL
const frame = document.querySelector('iframe');
console.log('Frame src:', frame.src);
console.log('Frame contentWindow:', frame.contentWindow);
```

## 🎯 Step 2: Verify Frame Dimensions and Positioning

### 2.1 Check Frame Dimensions
```css
/* Ensure frame has proper dimensions */
iframe {
  width: 100%;
  height: 100vh;
  min-height: 500px;
  border: none;
}

/* Debug frame boundaries */
iframe.debug {
  border: 2px solid red !important;
  background: yellow !important;
}
```

### 2.2 Check Positioning Properties
```javascript
// Get frame computed styles
const frame = document.querySelector('iframe');
const styles = window.getComputedStyle(frame);

console.log('Frame dimensions:', {
  width: styles.width,
  height: styles.height,
  position: styles.position,
  top: styles.top,
  left: styles.left,
  zIndex: styles.zIndex,
  visibility: styles.visibility,
  display: styles.display
});
```

### 2.3 Fix Common Positioning Issues
```css
/* Fix zero height/width issues */
.frame-container {
  width: 100%;
  height: 100%;
  position: relative;
}

iframe {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

/* Fix z-index issues */
iframe {
  z-index: 1;
}

/* Fix overflow issues */
.frame-wrapper {
  overflow: hidden;
}
```

## 🔄 Step 3: Confirm Content Updates Are Triggered

### 3.1 Check Hot Module Replacement (HMR)
```javascript
// For Vite/React applications
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('HMR update triggered');
    // Force frame refresh if needed
    window.location.reload();
  });
}
```

### 3.2 Monitor File Changes
```javascript
// Check if file watcher is working
const checkFileChanges = () => {
  const timestamp = new Date().getTime();
  console.log('File change check:', timestamp);
  
  // Add timestamp to force refresh
  const frame = document.querySelector('iframe');
  if (frame) {
    const currentSrc = frame.src.split('?')[0];
    frame.src = `${currentSrc}?t=${timestamp}`;
  }
};

// Call every 5 seconds for debugging
setInterval(checkFileChanges, 5000);
```

### 3.3 Force Content Refresh
```javascript
// Manual refresh function
const refreshFrame = () => {
  const frame = document.querySelector('iframe');
  if (frame) {
    // Method 1: Reload frame content
    frame.contentWindow.location.reload();
    
    // Method 2: Reset src attribute
    const src = frame.src;
    frame.src = '';
    setTimeout(() => {
      frame.src = src;
    }, 100);
  }
};

// Add refresh button for debugging
const addRefreshButton = () => {
  const button = document.createElement('button');
  button.textContent = 'Refresh Frame';
  button.onclick = refreshFrame;
  button.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  document.body.appendChild(button);
};

// Add button in development mode
if (process.env.NODE_ENV === 'development') {
  addRefreshButton();
}
```

## 🎨 Step 4: Inspect CSS Styles and Classes

### 4.1 Check for CSS Conflicts
```css
/* Reset frame styles */
iframe {
  border: none !important;
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
}

/* Check for hidden elements */
iframe[style*="display: none"],
iframe[style*="visibility: hidden"],
iframe.hidden {
  display: block !important;
  visibility: visible !important;
}
```

### 4.2 Debug CSS Classes
```javascript
// Check applied CSS classes
const frame = document.querySelector('iframe');
console.log('Frame classes:', frame.className);
console.log('Frame classList:', Array.from(frame.classList));

// Remove potentially problematic classes
const problematicClasses = ['hidden', 'invisible', 'd-none'];
problematicClasses.forEach(cls => {
  frame.classList.remove(cls);
});
```

### 4.3 Check Parent Container Styles
```javascript
// Check parent container styles
const frameParent = frame.parentElement;
const parentStyles = window.getComputedStyle(frameParent);

console.log('Parent container styles:', {
  width: parentStyles.width,
  height: parentStyles.height,
  overflow: parentStyles.overflow,
  position: parentStyles.position
});
```

## 🔄 Step 5: Test Frame Refresh/Reload Mechanisms

### 5.1 Implement Auto-Refresh
```javascript
// Auto-refresh mechanism
class FrameRefresher {
  constructor(frameSelector, interval = 5000) {
    this.frame = document.querySelector(frameSelector);
    this.interval = interval;
    this.lastModified = null;
    this.refreshTimer = null;
  }

  start() {
    this.refreshTimer = setInterval(() => {
      this.checkForUpdates();
    }, this.interval);
  }

  stop() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  checkForUpdates() {
    // Check if content has changed
    fetch(this.frame.src, { method: 'HEAD' })
      .then(response => {
        const lastModified = response.headers.get('last-modified');
        if (lastModified && lastModified !== this.lastModified) {
          this.lastModified = lastModified;
          this.refresh();
        }
      })
      .catch(console.error);
  }

  refresh() {
    if (this.frame) {
      console.log('Refreshing frame...');
      this.frame.contentWindow.location.reload();
    }
  }
}

// Usage
const refresher = new FrameRefresher('iframe');
refresher.start();
```

### 5.2 WebSocket-Based Refresh
```javascript
// WebSocket connection for live reload
class LiveReload {
  constructor(wsUrl = 'ws://localhost:3001') {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.connect();
  }

  connect() {
    try {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = () => {
        console.log('Live reload connected');
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'reload') {
          this.reloadFrame();
        }
      };

      this.ws.onclose = () => {
        console.log('Live reload disconnected, retrying...');
        setTimeout(() => this.connect(), 1000);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }

  reloadFrame() {
    const frame = document.querySelector('iframe');
    if (frame) {
      frame.contentWindow.location.reload();
    }
  }
}

// Initialize live reload
const liveReload = new LiveReload();
```

## 🐛 Step 6: Common Frame Display Issues and Solutions

### 6.1 Issue: Frame Shows Blank/White Screen
```javascript
// Solution: Check for JavaScript errors in frame
const frame = document.querySelector('iframe');
frame.onload = () => {
  try {
    const frameDoc = frame.contentDocument || frame.contentWindow.document;
    const errors = frameDoc.querySelectorAll('.error, .exception');
    if (errors.length > 0) {
      console.error('Frame contains errors:', errors);
    }
  } catch (e) {
    console.error('Cannot access frame content (CORS):', e);
  }
};
```

### 6.2 Issue: Frame Not Updating After Code Changes
```javascript
// Solution: Force cache bypass
const bypassCache = () => {
  const frame = document.querySelector('iframe');
  if (frame) {
    const url = new URL(frame.src);
    url.searchParams.set('_t', Date.now());
    frame.src = url.toString();
  }
};

// Call when changes detected
bypassCache();
```

### 6.3 Issue: Frame Dimensions Incorrect
```css
/* Solution: Responsive frame sizing */
.frame-container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.frame-container iframe {
  width: 100%;
  height: 100%;
  border: none;
  position: absolute;
  top: 0;
  left: 0;
}

/* For mobile responsiveness */
@media (max-width: 768px) {
  .frame-container {
    height: calc(100vh - 60px); /* Account for mobile browser UI */
  }
}
```

### 6.4 Issue: CORS Errors Preventing Frame Access
```javascript
// Solution: Handle CORS restrictions
const handleCORSFrame = (frameElement) => {
  frameElement.onload = () => {
    try {
      // Try to access frame content
      const frameDoc = frameElement.contentDocument;
      console.log('Frame content accessible');
    } catch (error) {
      console.warn('CORS restriction detected:', error);
      // Implement alternative monitoring
      monitorFrameExternally(frameElement);
    }
  };
};

const monitorFrameExternally = (frame) => {
  // Monitor frame URL changes
  let lastUrl = frame.src;
  setInterval(() => {
    try {
      const currentUrl = frame.contentWindow.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        console.log('Frame navigated to:', currentUrl);
      }
    } catch (e) {
      // CORS prevents access, use alternative methods
    }
  }, 1000);
};
```

## 🔧 Step 7: Development Environment Specific Fixes

### 7.1 Vite Development Server
```javascript
// vite.config.js
export default {
  server: {
    hmr: {
      overlay: false // Disable error overlay that might block frame
    },
    cors: true,
    headers: {
      'X-Frame-Options': 'SAMEORIGIN'
    }
  }
};
```

### 7.2 React Development
```javascript
// Add to React component
useEffect(() => {
  // Force re-render when in development
  if (process.env.NODE_ENV === 'development') {
    const interval = setInterval(() => {
      // Check for updates and force refresh if needed
      const frame = document.querySelector('iframe');
      if (frame && frame.contentWindow) {
        // Ping frame to ensure it's responsive
        try {
          frame.contentWindow.postMessage('ping', '*');
        } catch (e) {
          console.warn('Frame communication failed');
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }
}, []);
```

### 7.3 StackBlitz/CodeSandbox Specific
```javascript
// Handle online IDE environments
const isOnlineIDE = () => {
  return window.location.hostname.includes('stackblitz') || 
         window.location.hostname.includes('codesandbox') ||
         window.location.hostname.includes('webcontainer');
};

if (isOnlineIDE()) {
  // Implement IDE-specific frame handling
  const handleIDEFrame = () => {
    const frame = document.querySelector('iframe');
    if (frame) {
      // Add special handling for online IDEs
      frame.style.pointerEvents = 'auto';
      frame.style.userSelect = 'auto';
      
      // Monitor for IDE-specific events
      window.addEventListener('message', (event) => {
        if (event.data.type === 'PREVIEW_UPDATE') {
          console.log('IDE preview update detected');
          // Handle update
        }
      });
    }
  };
  
  handleIDEFrame();
}
```

## 🎯 Step 8: Debugging Tools and Utilities

### 8.1 Frame Debug Console
```javascript
// Create debug console for frame issues
const createFrameDebugger = () => {
  const debugPanel = document.createElement('div');
  debugPanel.id = 'frame-debugger';
  debugPanel.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    width: 300px;
    background: rgba(0,0,0,0.9);
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
    max-height: 200px;
    overflow-y: auto;
  `;

  const addLog = (message) => {
    const logEntry = document.createElement('div');
    logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
    debugPanel.appendChild(logEntry);
    debugPanel.scrollTop = debugPanel.scrollHeight;
  };

  // Monitor frame events
  const frame = document.querySelector('iframe');
  if (frame) {
    frame.addEventListener('load', () => addLog('Frame loaded'));
    frame.addEventListener('error', () => addLog('Frame error'));
    
    // Monitor frame dimensions
    const observer = new ResizeObserver(() => {
      addLog(`Frame resized: ${frame.offsetWidth}x${frame.offsetHeight}`);
    });
    observer.observe(frame);
  }

  document.body.appendChild(debugPanel);
  addLog('Frame debugger initialized');
};

// Enable in development
if (process.env.NODE_ENV === 'development') {
  createFrameDebugger();
}
```

### 8.2 Performance Monitoring
```javascript
// Monitor frame performance
const monitorFramePerformance = () => {
  const frame = document.querySelector('iframe');
  if (!frame) return;

  const startTime = performance.now();
  
  frame.onload = () => {
    const loadTime = performance.now() - startTime;
    console.log(`Frame load time: ${loadTime.toFixed(2)}ms`);
    
    // Check frame content performance
    try {
      const frameWindow = frame.contentWindow;
      if (frameWindow.performance) {
        const navigation = frameWindow.performance.getEntriesByType('navigation')[0];
        console.log('Frame navigation timing:', navigation);
      }
    } catch (e) {
      console.warn('Cannot access frame performance data');
    }
  };
};

monitorFramePerformance();
```

## 🚀 Quick Fix Checklist

When frame is not displaying changes:

1. **✅ Check browser console** for JavaScript errors
2. **✅ Verify frame src** attribute is correct
3. **✅ Confirm frame dimensions** are not zero
4. **✅ Check CSS display/visibility** properties
5. **✅ Test manual refresh** of frame content
6. **✅ Verify development server** is running
7. **✅ Check network tab** for failed requests
8. **✅ Clear browser cache** and hard refresh
9. **✅ Test in incognito mode** to rule out extensions
10. **✅ Check CORS headers** if accessing cross-origin content

## 🔧 Emergency Frame Reset

```javascript
// Nuclear option: Complete frame reset
const resetFrame = () => {
  const frame = document.querySelector('iframe');
  if (frame) {
    const parent = frame.parentNode;
    const src = frame.src;
    
    // Remove frame
    frame.remove();
    
    // Create new frame
    const newFrame = document.createElement('iframe');
    newFrame.src = src;
    newFrame.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
    `;
    
    // Add back to DOM
    parent.appendChild(newFrame);
    
    console.log('Frame reset completed');
  }
};

// Add reset button
const addResetButton = () => {
  const button = document.createElement('button');
  button.textContent = '🔄 Reset Frame';
  button.onclick = resetFrame;
  button.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 9999;
    padding: 10px 15px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  `;
  document.body.appendChild(button);
};

// Add in development mode
if (process.env.NODE_ENV === 'development') {
  addResetButton();
}
```

This troubleshooting guide should help you identify and resolve most frame display issues. Start with the basic checks and work your way through the more advanced debugging techniques as needed.