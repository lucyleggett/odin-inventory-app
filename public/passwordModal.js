const modal = document.getElementById("password-modal");
const modalForm = document.getElementById("password-form");
const forms = document.querySelectorAll(".pw-verifiable-form");
const input = document.getElementById("modal-password");
const error = document.getElementById("password-error");
let pendingForm = null;

function showError(msg) {
  error.textContent = msg;
  error.hidden = false;
  input.select();
}

forms.forEach((form) => {
  form.addEventListener("submit", (e) => {
    if (!form.matches("form[data-confirm-password]")) return;
    e.preventDefault();
    pendingForm = form;
    error.hidden = true;
    modal.showModal();
    input.focus();
  });
});

modalForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = input.value;
  try {
    const res = await fetch("/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ password }),
    });

    if (res.ok) {
      let hidden = pendingForm.querySelector('input[name="password"]');
      if (!hidden) {
        hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = "password";
        pendingForm.append(hidden);
      }
      hidden.value = password;
      modal.close();
      pendingForm.submit();
      return;
    }
    const data = await res.json().catch(() => ({}));
    showError(data.message || "Something went wrong.");
  } catch {
    showError("Could not reach the server.");
  }
});

document
  .getElementById("password-cancel")
  .addEventListener("click", () => modal.close());
modal.addEventListener("close", () => {
  input.value = "";
  pendingForm = null;
});
