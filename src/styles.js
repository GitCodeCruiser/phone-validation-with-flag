export const STYLES = `
.pvf-wrapper {
  --pvf-accent: #6366f1;
  --pvf-border: #d1d5db;
  --pvf-bg: #ffffff;
  --pvf-bg-drop: #ffffff;
  --pvf-text: #111827;
  --pvf-muted: #6b7280;
  --pvf-hover: #f3f4f6;
  --pvf-radius: 10px;
  --pvf-shadow: 0 10px 40px rgba(0,0,0,0.12);
  --pvf-flag-w: 24px;
  --pvf-flag-h: 18px;
  position: relative;
  display: inline-flex;
  align-items: stretch;
  font-family: inherit;
  font-size: 15px;
  width: 100%;
  box-sizing: border-box;
}

/* Dark mode */
.pvf-wrapper[data-theme="dark"],
@media (prefers-color-scheme: dark) { .pvf-wrapper[data-theme="auto"] } {
  --pvf-border: #374151;
  --pvf-bg: #1f2937;
  --pvf-bg-drop: #1f2937;
  --pvf-text: #f9fafb;
  --pvf-muted: #9ca3af;
  --pvf-hover: #374151;
}
.pvf-wrapper[data-theme="dark"] {
  --pvf-border: #374151;
  --pvf-bg: #1f2937;
  --pvf-bg-drop: #1f2937;
  --pvf-text: #f9fafb;
  --pvf-muted: #9ca3af;
  --pvf-hover: #374151;
}

/* Input row */
.pvf-input-row {
  display: flex;
  align-items: stretch;
  width: 100%;
  border: 1.5px solid var(--pvf-border);
  border-radius: var(--pvf-radius);
  background: var(--pvf-bg);
  overflow: hidden;
  transition: border-color 0.15s;
}
.pvf-input-row:focus-within {
  border-color: var(--pvf-accent);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
}

/* Flag button */
.pvf-flag-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px 0 12px;
  cursor: pointer;
  border: none;
  background: transparent;
  border-right: 1.5px solid var(--pvf-border);
  color: var(--pvf-text);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.15s;
  flex-shrink: 0;
  min-width: 80px;
}
.pvf-flag-btn:hover { background: var(--pvf-hover); }
.pvf-flag-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.pvf-flag-img {
  width: var(--pvf-flag-w);
  height: var(--pvf-flag-h);
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
}
.pvf-dial { color: var(--pvf-muted); font-size: 12.5px; }
.pvf-chevron {
  margin-left: 2px;
  color: var(--pvf-muted);
  font-size: 10px;
  transition: transform 0.2s;
}
.pvf-wrapper.pvf-open .pvf-chevron { transform: rotate(180deg); }

/* Phone number input */
.pvf-number-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: var(--pvf-text);
  font-size: 15px;
  padding: 11px 14px;
  width: 0;
  min-width: 0;
}
.pvf-number-input::placeholder { color: var(--pvf-muted); }

/* Dropdown */
.pvf-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 280px;
  max-width: 100%;
  background: var(--pvf-bg-drop);
  border: 1.5px solid var(--pvf-border);
  border-radius: var(--pvf-radius);
  box-shadow: var(--pvf-shadow);
  z-index: 9999;
  display: none;
  flex-direction: column;
  overflow: hidden;
}
.pvf-wrapper.pvf-open .pvf-dropdown { display: flex; }

/* Search */
.pvf-search-wrap {
  padding: 10px 10px 8px;
  border-bottom: 1px solid var(--pvf-border);
}
.pvf-search {
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid var(--pvf-border);
  border-radius: 7px;
  padding: 7px 12px;
  font-size: 13.5px;
  background: var(--pvf-bg);
  color: var(--pvf-text);
  outline: none;
  transition: border-color 0.15s;
}
.pvf-search:focus { border-color: var(--pvf-accent); }
.pvf-search::placeholder { color: var(--pvf-muted); }

/* Country list */
.pvf-list {
  overflow-y: auto;
  max-height: 240px;
  padding: 6px 0;
}
.pvf-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  cursor: pointer;
  transition: background 0.1s;
}
.pvf-item:hover, .pvf-item.pvf-active { background: var(--pvf-hover); }
.pvf-item.pvf-selected {
  background: rgba(99,102,241,0.08);
  color: var(--pvf-accent);
}
.pvf-item-flag {
  width: var(--pvf-flag-w);
  height: var(--pvf-flag-h);
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
}
.pvf-item-name {
  flex: 1;
  font-size: 14px;
  color: var(--pvf-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pvf-item-dial {
  font-size: 12px;
  color: var(--pvf-muted);
  flex-shrink: 0;
}
.pvf-no-results {
  padding: 16px;
  text-align: center;
  color: var(--pvf-muted);
  font-size: 13px;
}

/* Validation states */
.pvf-input-row.pvf-invalid {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.12) !important;
}
.pvf-input-row.pvf-valid {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 3px rgba(16,185,129,0.12) !important;
}
.pvf-error {
  display: none;
  margin-top: 5px;
  font-size: 12px;
  color: #ef4444;
  padding-left: 2px;
}
`;
