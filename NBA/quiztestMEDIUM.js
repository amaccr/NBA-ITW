const questions = [
    {
      question: "Which player is known for his signature 'Sky Hook' shot?",
      options: ["Kareem Abdul-Jabbar", "Hakeem Olajuwon", "Shaquille O'Neal", "David Robinson"],
      answer: "A"
    },
    {
      question: "In what year did the NBA introduce the three-point line?",
      options: ["1976", "1980", "1985", "1990"],
      answer: "C"
    },
    {
      question: "Who holds the record for the most steals in a single NBA game?",
      options: ["Allen Iverson", "Chris Paul", "Michael Jordan", "Larry Kenon"],
      answer: "D"
    },
    {
      question: "Which team did Michael Jordan play for when he made his famous 'Flu Game' in the NBA Finals?",
      options: ["Chicago Bulls", "Los Angeles Lakers", "Houston Rockets", "Boston Celtics"],
      answer: "A"
    },
    {
      question: "Who is the only player in NBA history to have scored 100 points in a single game?",
      options: ["Wilt Chamberlain", "Kobe Bryant", "LeBron James", "Kevin Durant"],
      answer: "A"
    },
    {
      question: "Which NBA team was formerly known as the New Jersey Nets?",
      options: ["Brooklyn Nets", "Orlando Magic", "Charlotte Hornets", "Toronto Raptors"],
      answer: "A"
    },
    {
      question: "Who is the NBA's all-time leading scorer?",
      options: ["LeBron James", "Kareem Abdul-Jabbar", "Kobe Bryant", "Karl Malone"],
      answer: "B"
    },
    {
      question: "What is the nickname of the NBA team based in Utah?",
      options: ["Jazz", "Mavericks", "Grizzlies", "Thunder"],
      answer: "A"
    },
    {
      question: "Which player is known as 'The Dream'?",
      options: ["Hakeem Olajuwon", "Kevin Durant", "Dirk Nowitzki", "Tim Duncan"],
      answer: "A"
    },
    {
      question: "In what year did the NBA merge with the ABA (American Basketball Association)?",
      options: ["1973", "1976", "1980", "1985"],
      answer: "B"
    }
  ];

  /* Função para baralhar as perguntas */
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  /* Função para preencher o quiz com as 5 peguntas aleatórias */
  function populateQuizForm() {
    shuffleArray(questions);
    for (let i = 0; i < 5; i++) {
      const questionDiv = document.getElementById(`q${i + 1}`);
      const questionObj = questions[i];
      questionDiv.innerHTML = `<p>${i + 1}. ${questionObj.question}</p>`;
      questionObj.options.forEach((option, index) => {
        questionDiv.innerHTML += `
          <label>
            <input type="radio" name="q${i + 1}" value="${String.fromCharCode(65 + index)}" required>
            ${option}
          </label>
          <br>
        `;
      });
    }
  }

  /* Função para calcular o resultado do quiz */
  function submitQuiz() {
    const form = document.getElementById("quizForm");
    const result = document.getElementById("result");
    const totalQuestions = 5;
    let correctAnswers = 0;

    for (let i = 0; i < totalQuestions; i++) {
      const selectedOption = form.elements[`q${i + 1}`].value;
      if (selectedOption === questions[i].answer) {
        correctAnswers++;
      }
    }

    const percentage = (correctAnswers / totalQuestions) * 100;
    result.textContent = `You scored ${correctAnswers} out of ${totalQuestions}. Your percentage: ${percentage.toFixed(2)}%`;
    alert(`You scored ${correctAnswers} out of ${totalQuestions}. (${percentage.toFixed(2)}%)`);
  }
  // After populating the quiz form
  document.getElementById('quizForm').addEventListener('submit', function (event) {
    if (!event.target.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      alert('Please answer all questions!')
    } else {
      submitQuiz();
    }
    event.target.classList.add('was-validated');
  }, false);

  window.onload = populateQuizForm;