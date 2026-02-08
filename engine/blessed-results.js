'use strict';

/**
 * Results screen using blessed-contrib: stats text.
 * Call runBlessedResultsScreen(options, callback). When user presses a key,
 * the screen is destroyed and callback('retry'|'menu') is called.
 */

function runBlessedResultsScreen(options, callback) {
  const blessed = require('blessed');
  const contrib = require('blessed-contrib');
  const { stats, themeConfig, testMode, timeLimitSeconds, wordLimit } = options;
  const s = stats.getSnapshot();
  const testTypeLabel =
    testMode === 'zen' ? 'Zen' :
    testMode === 'custom' ? 'Custom' :
    testMode === 'time' && timeLimitSeconds != null ? `Time ${timeLimitSeconds}s` :
    testMode === 'words' && wordLimit != null ? `Words ${wordLimit}` :
    testMode || 'Test';

  const screen = blessed.screen({ smartCSR: true, fullUnicode: true });
  const grid = new contrib.grid({ rows: 12, cols: 12, screen, hideBorder: true });

  const textContent = [
    `Test complete`,
    ``,
    `WPM:          ${s.wpm}`,
    `Raw WPM:      ${Math.round(s.rawWpm)}`,
    `Accuracy:     ${s.accuracy}%`,
    `Errors:       ${s.errorsIncludingCorrected ?? s.totalErrors}`,
    `Test:         ${testTypeLabel}`,
    `Duration:     ${s.timeFormatted}`,
    ``,
    `[ Enter / R ] Retry    [ Esc / Q ] Main menu`,
  ].join('\n');

  grid.set(0, 0, 12, 12, contrib.log, {
    label: ' Results ',
    border: { type: 'line', fg: 'cyan' },
    tags: true,
  }).log(textContent);

  function done(action) {
    try {
      screen.destroy();
    } catch (_) {}
    if (typeof callback === 'function') callback(action);
  }

  screen.key(['enter', 'r'], () => done('retry'));
  screen.key(['escape', 'q', 'C-c'], () => done('menu'));
  screen.render();
}

module.exports = { runBlessedResultsScreen };
