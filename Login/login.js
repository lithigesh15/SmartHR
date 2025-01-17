document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");
  
    // Check credentials
    if (username === "admin" && password === "admin") {
      message.style.display = "block";
      message.className = "alert success";
      message.innerText = "Login successful!";
      setTimeout(() => {
        window.location.href = "./dashboard.html"; // Redirect to dashboard
      }, 1000);
    } else {
      message.style.display = "block";
      message.className = "alert";
      message.innerText = "Incorrect username or password.";
    }
  });