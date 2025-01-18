document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");
  
    if (username === "admin" && password === "admin") {
      message.className = "alert success";
      message.textContent = "Login successful!";
      message.classList.remove("d-none");
      setTimeout(() => {
        window.location.href = "../dashboard/dashboard.html";
      }, 1000);
    } else {
      message.className = "alert error";
      message.textContent = "Incorrect username or password.";
      message.classList.remove("d-none");
    }
  });
  