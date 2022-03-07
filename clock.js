const clockEl = document.getElementById('clock');
const timeSpan = clockEl.children[0];
const periodSpan = clockEl.children[1];

// Update clock element strings for US format
const updateClock = () => {
  const today = new Date();
  const h = today.getHours();
  const m = today.getMinutes();
  const s = today.getSeconds();
  const n = h >= 12 ? 'PM' : 'AM';
  timeSpan.innerText = getTimeString(h, m, s);
  periodSpan.innerText = n;
};

// Return a concatenated, formatted time string
const getTimeString = (h, m, s) => {
  h = h > 12 ? h - 12 : h === 0 ? 12 : h; // We're demilitarizing these hours, heny
  m = getTwoDigits(m);
  s = getTwoDigits(s);
  return `${h}:${m}:${s}`;
};

// Add a zero when in single digits
const getTwoDigits = n => {
  return n < 10 ? `0${n}` : n;
};

// Set initial clock data then update it every second
const initClock = () => {
  updateClock();
  setInterval(() => updateClock(), 1000);
};

export { initClock };
