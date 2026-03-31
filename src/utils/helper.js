export const validateName = (name) => {
  return /^[a-zA-Z\s]*$/.test(name);
};

export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
