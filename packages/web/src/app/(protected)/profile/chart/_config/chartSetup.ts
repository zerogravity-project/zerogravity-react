/**
 * [Chart.js configuration]
 * Registers only the required Chart.js components for tree-shaking optimization
 * Instead of importing from 'chart.js/auto' which loads everything
 */

import {
  Chart,
  // Controllers
  BarController,
  LineController,
  ScatterController,
  // Elements
  BarElement,
  LineElement,
  PointElement,
  // Scales
  CategoryScale,
  LinearScale,
  // Plugins
  Tooltip,
  Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

/** Register required Chart.js components */
Chart.register(
  // Controllers
  BarController,
  LineController,
  ScatterController,
  // Elements
  BarElement,
  LineElement,
  PointElement,
  // Scales
  CategoryScale,
  LinearScale,
  // Plugins
  Tooltip,
  Legend,
  annotationPlugin
);

export { Chart };
