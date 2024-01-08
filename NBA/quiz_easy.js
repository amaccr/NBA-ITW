/*function validateQuiz(event) {
    var form = document.getElementById("nbaQuizForm");

    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        alert('Please answer all questions')
    } else {

        // Redirect to the results page
        window.location.href = "quiz_easy_results.html";
    }

    form.classList.add('was-validated');
}

// Attach the validateQuiz function to the form's submit event
document.getElementById("nbaQuizForm").addEventListener("submit", validateQuiz);*/

document.getElementById("nbaQuizForm").addEventListener("submit", function(event) {
    event.preventDefault(); // prevent the form from submitting normally

    var form = document.getElementById("nbaQuizForm");

    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        alert('Please answer all questions');
    } else {
        form.classList.add('was-validated');
        // Redirect to the results page
        window.location.href = "quiz_easy_results.html"; // replace "quiz_easy_results.html" with the path to your results page
    }

    
});
