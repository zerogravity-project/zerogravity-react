/**
 * [Chart constants]
 * Shared constant values for chart components
 */

/** Chart grid line color */
export const CHART_GRID_COLOR = '#212225';

/** Default tooltip CSS styles (fixed position to escape overflow containers) */
export const TOOLTIP_STYLES = `
  position: fixed;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  padding: 10px 14px;
  pointer-events: none;
  z-index: 100;
  font-family: inherit;
  white-space: nowrap;
`;
