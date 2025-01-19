document.addEventListener("DOMContentLoaded", function () {
    const boxes = document.querySelectorAll(".box");
    
    boxes.forEach(box => {
        box.addEventListener("mouseenter", () => {
            box.classList.add("shadow-lg");
        });

        box.addEventListener("mouseleave", () => {
            box.classList.remove("shadow-lg");
        });
    });

    console.log("Training & Development page loaded successfully.");
});
