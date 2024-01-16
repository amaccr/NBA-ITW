const questions = [
    {
      question: "Who holds the record for the most points scored in a single NBA game?",
      options: ["Michael Jordan", "Kobe Bryant", "Wilt Chamberlain", "LeBron James"],
      answer: "C"
    },
    {
      question: "Which team has won the most NBA championships?",
      options: ["Los Angeles Lakers", "Boston Celtics", "Chicago Bulls", "Golden State Warriors"],
      answer: "B"
    },
    {
      question: "Who is known as 'The Greek Freak' in the NBA?",
      options: ["Giannis Antetokounmpo", "Kevin Durant", "Kawhi Leonard", "James Harden"],
      answer: "A"
    },
    {
      question: "What is the regulation height of an NBA basketball hoop?",
      options: ["9 feet", "9.5 feet", "10 feet", "10.5 feet"],
      answer: "C"
    },
    {
      question: "Which player is often referred to as 'The Answer'?",
      options: ["Allen Iverson", "Shaquille O'Neal", "Tim Duncan", "Vince Carter"],
      answer: "A"
    },
    {
      question: "Which NBA team drafted Dirk Nowitzki in 1998 before trading him to the Dallas Mavericks?",
      options: ["Boston Celtics", "Milwaukee Bucks", "Los Angeles Clippers", "Dallas Mavericks"],
      answer: "B"
    },
    {
      question: "Who holds the record for the most assists in a single NBA game?",
      options: ["Magic Johnson", "John Stockton", "Chris Paul", "Steve Nash"],
      answer: "A"
    },
    {
      question: "Which NBA team is known as the 'Motor City' team?",
      options: ["Detroit Pistons", "Cleveland Cavaliers", "Indiana Pacers", "Chicago Bulls"],
      answer: "A"
    },
    {
      question: "What is the NBA shot clock set to?",
      options: ["20 seconds", "24 seconds", "30 seconds", "35 seconds"],
      answer: "B"
    },
    {
      question: "Who won the NBA MVP award for the 2020-2021 season?",
      options: ["LeBron James", "Giannis Antetokounmpo", "Nikola Jokic", "Stephen Curry"],
      answer: "C"
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