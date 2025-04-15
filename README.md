# Stock Charting Library

A powerful JavaScript library for creating interactive stock charts with drawing tools and technical analysis features.

## Features

- Interactive candlestick charts
- Drawing tools for technical analysis
- Zoom and pan functionality
- Multiple chart types (Candlestick, Baseline, Heikin-Ashi, Renko)
- Line drawing with customizable styles
- Undo/Redo support for drawings
- Local storage persistence for drawings

## Installation

```bash
npm install
```

## Usage

### Basic Setup

```html
<!-- Import the charting library -->
<script src="dist/charting-library.min.js"></script>

<!-- Create a container for the chart -->
<div id="chart-container"></div>
```

### Creating a Chart

```javascript
import { candlestickData } from './data/data.js';

// Create and draw the candlestick chart
const chart = new ChartingLibrary.CandlestickChart('chart-container', candlestickData);
chart.draw();
```

### Drawing Tools

The library includes a comprehensive set of drawing tools for technical analysis:

```javascript
// Enable drawing mode
chart.drawLine(true, {
  color: '#1a73e8',    // Line color
  width: 2,            // Line width
  style: 'solid',      // Line style: 'solid', 'dashed', 'dotted'
  label: 'Trend Line'  // Optional label
});

// Disable drawing mode
chart.drawLine(false);

// Undo/Redo operations
chart.undo();
chart.redo();
```

### Customization

You can customize various aspects of the chart:

```javascript
// Update line style
chart.setLineStyle({
  color: '#ff0000',
  width: 3,
  style: 'dashed',
  label: 'Resistance'
});
```

### Interactive Features

The chart supports various interactive features:

- **Zoom**: Use mouse wheel to zoom in/out
- **Pan**: Click and drag to pan the chart
- **Line Drawing**: Toggle drawing mode to add trend lines
- **Line Selection**: Click on lines to select them

## Example

Check out the `example/index.html` file for a complete implementation example showing how to:

- Initialize the chart
- Add drawing controls
- Customize line styles
- Handle user interactions

## API Reference

### CandlestickChart

```javascript
const chart = new ChartingLibrary.CandlestickChart(container, data);
```

#### Methods

- `draw()`: Render the chart
- `drawLine(enabled, options)`: Toggle drawing mode
- `undo()`: Undo last drawing action
- `redo()`: Redo last undone action
- `setLineStyle(style)`: Update line style

### LineDrawingTool

```javascript
const lineDrawingTool = new LineDrawingTool(options, onUpdate);
```

#### Options

- `color`: Line color (default: '#1a73e8')
- `width`: Line width (default: 2)
- `style`: Line style (default: 'solid')
- `label`: Line label (optional)

## License

MIT
