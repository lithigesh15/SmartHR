// Onboarding form submission
document.getElementById("onboarding-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const applicantID = document.getElementById("applicantID").value.trim();
    const department = document.getElementById("department").value.trim();
    const salary = document.getElementById("salary").value.trim();

    alert("Employee onboarded successfully!");

    document.getElementById("onboarding-form").reset();
});
