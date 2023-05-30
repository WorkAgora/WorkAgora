// Regex to validate a phone number (including European phone numbers)
export const phoneRegex =
  /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/gm;

// Regex to validate a location (allowing only the name of the city, country, or land)
export const locationRegex = /^[\w\s-]+,\s[\w\s-]+(?:,\s[\w\s-]+)?$/;

// Regex to validate an email address
export const emailRegex =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

// Regex to validate a URL
export const urlRegex =
  /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;

// Regex to validate wallet
export const walletRegex = /^0x[a-fA-F0-9]{40}$/;
