// public/js/login.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const identifier = document.getElementById("identifier");
  const password = document.getElementById("password");
  const alertBox = document.getElementById("alertBox");
  const submitBtn = document.getElementById("submitBtn");
  const showPassword = document.getElementById("showPassword");

  showPassword.addEventListener("click", (e) => {
    password.type = password.type === "password" ? "text" : "password";
    showPassword.textContent = password.type === "password" ? "Show" : "Hide";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    alertBox.classList.add("hidden");
    submitBtn.disabled = true;

    const idVal = identifier.value.trim();
    const pwd = password.value;
    if (!idVal || !pwd) {
      showAlert("Please fill all fields");
      submitBtn.disabled = false;
      return;
    }

    // backend accepts email OR username — send one of them
    const payload = idVal.includes("@") ? { email: idVal, password: pwd } : { username: idVal, password: pwd };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        // store token + user (optional)
        if (data?.data?.accessToken) {
          localStorage.setItem("token", data.data.accessToken);
        }
        if (data?.data) localStorage.setItem("user", JSON.stringify(data.data));
        window.location.href = "/dashboard";
      } else {
        showAlert(data?.message || "Login failed");
      }
    } catch (err) {
      showAlert("Network error");
    } finally {
      submitBtn.disabled = false;
    }
  });

  function showAlert(msg) {
    alertBox.textContent = msg;
    alertBox.classList.remove("hidden");
  }
});
