const questions = [
  {
    question: "Who is the only player to have won an NBA MVP, NBA Finals MVP, and Olympic Gold Medal in the same year?",
    options: ["Michael Jordan", "LeBron James", "Kobe Bryant", "Magic Johnson"],
    answer: "A"
  },
  {
    question: "Which player holds the record for the highest points per game average in a single NBA season?",
    options: ["Wilt Chamberlain", "Michael Jordan", "Kobe Bryant", "James Harden"],
    answer: "A"
  },
  {
    question: "Who is the shortest player to ever play in the NBA?",
    options: ["Tyrone 'Muggsy' Bogues", "Earl Boykins", "Nate Robinson", "Spud Webb"],
    answer: "A"
  },
  {
    question: "Which coach has the most NBA Championships?",
    options: ["Phil Jackson", "Red Auerbach", "Pat Riley", "Gregg Popovich"],
    answer: "B"
  },
  {
    question: "What is the longest winning streak in NBA history?",
    options: ["33 games", "27 games", "20 games", "18 games"],
    answer: "A"
  },
  {
    question: "Who was the first foreign-born player to be selected first overall in the NBA Draft?",
    options: ["Yao Ming", "Pau Gasol", "Andrea Bargnani", "Dirk Nowitzki"],
    answer: "C"
  },
  {
    question: "Which player has the most career triple-doubles in NBA history?",
    options: ["Magic Johnson", "LeBron James", "Russell Westbrook", "Oscar Robertson"],
    answer: "C"
  },
  {
    question: "What is the only NBA team to have gone an entire season undefeated at home?",
    options: ["Chicago Bulls", "Boston Celtics", "Los Angeles Lakers", "Golden State Warriors"],
    answer: "A"
  },
  {
    question: "Who was the first player to record a quadruple-double in an NBA game?",
    options: ["Hakeem Olajuwon", "David Robinson", "Nate Thurmond", "Alvin Robertson"],
    answer: "D"
  },
  {
    question: "Which player scored the most points in a single NBA game?",
    options: ["Wilt Chamberlain", "Kobe Bryant", "David Thompson", "Devin Booker"],
    answer: "A"
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