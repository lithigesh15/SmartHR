document.getElementById('perksForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const employeeId = document.getElementById('employeeId').value;
    const giftType = document.getElementById('giftType').value;
    const description = document.getElementById('description').value;

    if (employeeId && giftType && description) {
        alert(`Gift sent successfully!\n\nEmployee ID: ${employeeId}\nGift Type: ${giftType}\nDescription: ${description}`);
        this.reset(); // Clear form fields
    } else {
        alert('Please fill out all fields before submitting.');
    }
});
