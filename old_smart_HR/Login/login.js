document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  try {
      const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (data.success) {
          message.className = "alert alert-success";
          message.textContent = "Login successful!";
          message.classList.remove("d-none");
          setTimeout(() => {
              window.location.href = "../dashboard/dashboard.html";
          }, 1000);
      } else {
          message.className = "alert alert-danger";
          message.textContent = "Incorrect username or password.";
          message.classList.remove("d-none");
      }
  } catch (error) {
      message.className = "alert alert-danger";
      message.textContent = "Server error. Try again later.";
      message.classList.remove("d-none");
  }
});
