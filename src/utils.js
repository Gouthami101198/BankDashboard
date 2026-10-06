export const initials = (name) =>
  name ? name.split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase() : '?';

export const txStyle = {
  Shopping: { icon: 'card', tone: 'amber' },
  Transfer: { icon: 'dollar', tone: 'sky' },
  Service: { icon: 'paypal', tone: 'teal' },
};

export const go = (page) => {
  window.location.hash = page;
};
