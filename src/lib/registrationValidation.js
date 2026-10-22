export function validateRegistration({ name, email, password, confirmation, accepted }) {
  const errors = {};
  if (name.trim().length < 2 || name.trim().length > 100 || !/^[\p{L}\p{M} .'-]+$/u.test(name.trim())) errors.name = "Ingresa un nombre de 2 a 100 caracteres, sin números ni símbolos.";
  if (email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Ingresa un correo electrónico válido.";
  if (password.length > 128 || !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!_-]).{8,}$/s.test(password)) errors.password = "Usa entre 8 y 128 caracteres, mayúscula, minúscula, número y un símbolo: @ # $ % ^ & + = ! _ -";
  if (!confirmation || password !== confirmation) errors.confirmation = "Las contraseñas deben coincidir.";
  if (!accepted) errors.accepted = "Lee y acepta los términos para continuar.";
  return errors;
}
