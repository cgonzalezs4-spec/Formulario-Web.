const authCard = document.querySelector("#auth-card");
const form = document.querySelector("#registration-form");
const formMessage = document.querySelector("#form-message");
const formContent = document.querySelector("#form-content");
const welcomeContent = document.querySelector("#welcome-content");
const password = document.querySelector("#password");
const passwordToggle = document.querySelector("#password-toggle");
const passwordStrength = document.querySelector("#password-strength");
const strengthFill = document.querySelector("#strength-fill");
const strengthLabel = document.querySelector("#strength-label");
const forgotLink = document.querySelector("#forgot-link");
const registerOnly = [...document.querySelectorAll("[data-register-only]")];
let isRegisterMode = true;
let modeTransitionTimer;

const fields = [
  { input: document.querySelector("#name"), error: document.querySelector("#name-error"), registerOnly: true },
  { input: document.querySelector("#email"), error: document.querySelector("#email-error") },
  { input: password, error: document.querySelector("#password-error") },
  { input: document.querySelector("#age"), error: document.querySelector("#age-error"), registerOnly: true },
  { input: document.querySelector("#phone"), error: document.querySelector("#phone-error"), registerOnly: true },
  { input: document.querySelector("#country"), error: document.querySelector("#country-error"), registerOnly: true },
  { input: document.querySelector("#terms"), error: document.querySelector("#terms-error"), registerOnly: true },
];

function getErrorMessage(input) {
  const value = input.value.trim();

  if (input.required && (input.type === "checkbox" ? !input.checked : !value)) {
    return input.type === "checkbox"
      ? "Debes aceptar los términos para continuar."
      : "Este campo es obligatorio.";
  }

  if (!value) {
    return "";
  }

  if (input.id === "name" && value.length < 2) {
    return "Escribe al menos 2 caracteres.";
  }

  if (input.type === "email" && !input.validity.valid) {
    return "Ingresa un correo electrónico válido.";
  }

  if (input.id === "password" && isRegisterMode && value.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  if (input.id === "age") {
    const age = Number(value);
    if (!Number.isInteger(age) || age < 18 || age > 100) {
      return "Ingresa una edad válida entre 18 y 100 años.";
    }
  }

  if (input.id === "phone") {
    const digits = value.replace(/\D/g, "");
    if (!/^\+?[\d\s()-]+$/.test(value) || digits.length < 7 || digits.length > 15) {
      return "Ingresa un teléfono con entre 7 y 15 dígitos.";
    }
  }

  return "";
}

function validateField(field) {
  const message = getErrorMessage(field.input);
  field.error.textContent = message;
  field.input.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

function clearValidation() {
  fields.forEach(({ input, error }) => {
    error.textContent = "";
    input.removeAttribute("aria-invalid");
  });
  formMessage.textContent = "";
  formMessage.classList.remove("is-error");
}

function resetPasswordControl() {
  password.type = "password";
  passwordToggle.textContent = "Ver";
  passwordToggle.setAttribute("aria-label", "Mostrar contraseña");
  passwordToggle.setAttribute("aria-pressed", "false");
  strengthFill.style.width = "0";
  strengthFill.dataset.strength = "0";
  strengthLabel.textContent = "";
}

function updatePasswordStrength() {
  const value = password.value;
  const checks = [
    value.length >= 8,
    /[a-z]/.test(value) && /[A-Z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Débil", "Aceptable", "Buena", "Fuerte"];

  strengthFill.style.width = `${score * 25}%`;
  strengthFill.dataset.strength = String(score);
  strengthLabel.textContent = labels[score];
}

function setMode(registerMode) {
  if (isRegisterMode === registerMode) {
    return;
  }
  window.clearTimeout(modeTransitionTimer);
  isRegisterMode = registerMode;
  clearValidation();
  form.reset();
  resetPasswordControl();
  passwordStrength.classList.add("is-hidden");

  registerOnly.forEach((element) => {
    element.classList.toggle("is-hidden", !registerMode);
  });

  fields.forEach(({ input, registerOnly: onlyForRegister }) => {
    input.required = !onlyForRegister || registerMode;
  });
  password.minLength = registerMode ? 8 : 0;
  password.placeholder = registerMode ? "Mínimo 8 caracteres" : "Escribe tu contraseña";
  password.autocomplete = registerMode ? "new-password" : "current-password";

  formContent.classList.add("is-changing");
  welcomeContent.classList.add("is-changing");
  modeTransitionTimer = window.setTimeout(() => {
    document.querySelector("#form-eyebrow").textContent = registerMode ? "EMPIEZA ALGO NUEVO" : "QUÉ BUENO VERTE";
    document.querySelector("#form-title").textContent = registerMode ? "Crear una cuenta" : "Iniciar sesión";
    document.querySelector("#form-description").textContent = registerMode
      ? "Completa tus datos para unirte a nuestra comunidad."
      : "Ingresa tus datos para continuar.";
    document.querySelector("#submit-button").innerHTML = registerMode
      ? 'Crear cuenta <span aria-hidden="true">→</span>'
      : 'Iniciar sesión <span aria-hidden="true">→</span>';
    document.querySelector("#welcome-title").textContent = registerMode ? "¡Bienvenido!" : "¡Hola, de nuevo!";
    document.querySelector("#welcome-copy").textContent = registerMode
      ? "¿Ya tienes una cuenta? Inicia sesión y continúa donde lo dejaste."
      : "Inicia sesión para continuar y acceder a tu espacio personal.";
    document.querySelector("#mode-switch").textContent = registerMode ? "Iniciar sesión" : "Crear una cuenta";
    document.querySelector("#mobile-switch-copy").innerHTML = registerMode
      ? '¿Ya tienes una cuenta? <button type="button" data-switch-mode>Inicia sesión</button>'
      : '¿Aún no tienes cuenta? <button type="button" data-switch-mode>Regístrate</button>';
    document.querySelector("#forgot-link").classList.toggle("is-hidden", registerMode);
    authCard.classList.toggle("is-register", registerMode);
    welcomeContent.classList.remove("is-changing");
    formContent.classList.remove("is-changing");
    if (registerMode) {
      passwordStrength.classList.toggle("is-hidden", !password.value);
    }
  }, 180);
}

fields.forEach((field) => {
  field.input.addEventListener("blur", () => validateField(field));
  field.input.addEventListener("input", () => {
    if (field.input.getAttribute("aria-invalid") === "true") {
      validateField(field);
    }
    formMessage.textContent = "";
    formMessage.classList.remove("is-error");
    if (field.input === password && isRegisterMode) {
      passwordStrength.classList.toggle("is-hidden", !password.value);
      updatePasswordStrength();
    }
  });
  field.input.addEventListener("change", () => validateField(field));
});

document.querySelector("#mode-switch").addEventListener("click", () => {
  setMode(!isRegisterMode);
});

document.querySelector(".mobile-switch").addEventListener("click", (event) => {
  if (event.target.matches("[data-switch-mode]")) {
    setMode(!isRegisterMode);
  }
});

passwordToggle.addEventListener("click", () => {
  const showPassword = password.type === "password";
  password.type = showPassword ? "text" : "password";
  passwordToggle.textContent = showPassword ? "Ocultar" : "Ver";
  passwordToggle.setAttribute("aria-label", showPassword ? "Ocultar contraseña" : "Mostrar contraseña");
  passwordToggle.setAttribute("aria-pressed", String(showPassword));
});

forgotLink.addEventListener("click", (event) => {
  event.preventDefault();
  formMessage.textContent = "La recuperación de contraseña no está disponible en esta demostración.";
  formMessage.classList.remove("is-error");
  document.querySelector("#email").focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";
  formMessage.classList.remove("is-error");

  const activeFields = fields.filter(({ registerOnly: onlyForRegister }) => !onlyForRegister || isRegisterMode);
  const invalidFields = activeFields.filter((field) => !validateField(field));
  if (invalidFields.length > 0) {
    formMessage.textContent = "Revisa los campos señalados antes de continuar.";
    formMessage.classList.add("is-error");
    invalidFields[0].input.focus();
    return;
  }

  formMessage.textContent = isRegisterMode
    ? "¡Registro validado correctamente! Esta demostración no envía ni guarda tus datos."
    : "¡Inicio de sesión validado! Esta demostración no se conecta a un servidor.";
  form.reset();
  clearValidation();
  resetPasswordControl();
  formMessage.textContent = isRegisterMode
    ? "¡Registro validado correctamente! Esta demostración no envía ni guarda tus datos."
    : "¡Inicio de sesión validado! Esta demostración no se conecta a un servidor.";
  passwordStrength.classList.add("is-hidden");
});
