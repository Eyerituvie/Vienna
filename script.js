(() => {
  const totalQuestions = 10;
  const questionCount = document.getElementById("question-count");
  const questionText = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const feedback = document.getElementById("feedback");
  const scoreElement = document.getElementById("score");
  const progressFill = document.getElementById("progress-fill");
  const progressBar = document.querySelector('[role="progressbar"]');
  const startButton = document.getElementById("start-button");
  const nextButton = document.getElementById("next-button");
  const restartButton = document.getElementById("restart-button");

  let questionNumber = 0;
  let score = 0;
  let correctAnswer = 0;
  let answered = false;

  function makeQuestion() {
    const operation = Math.random() < 0.5 ? "+" : "−";
    let first = Math.floor(Math.random() * 10) + 1;
    let second = Math.floor(Math.random() * 10) + 1;

    if (operation === "−" && second > first) {
      [first, second] = [second, first];
    }

    correctAnswer = operation === "+" ? first + second : first - second;
    questionText.textContent = `What is ${first} ${operation} ${second}?`;
    answersElement.replaceChildren();

    const options = new Set([correctAnswer]);
    while (options.size < 4) {
      const offset = Math.floor(Math.random() * 9) - 4;
      options.add(Math.max(0, correctAnswer + (offset === 0 ? 5 : offset)));
    }

    [...options]
      .sort(() => Math.random() - 0.5)
      .forEach((value) => {
        const button = document.createElement("button");
        button.className = "answer";
        button.type = "button";
        button.textContent = value;
        button.setAttribute("aria-label", `Answer ${value}`);
        button.addEventListener("click", () => chooseAnswer(button, value));
        answersElement.append(button);
      });
  }

  function chooseAnswer(button, value) {
    if (answered) return;
    answered = true;
    const answerButtons = answersElement.querySelectorAll(".answer");
    answerButtons.forEach((answerButton) => {
      answerButton.disabled = true;
      if (Number(answerButton.textContent) === correctAnswer) {
        answerButton.classList.add("correct");
      }
    });

    if (value === correctAnswer) {
      score += 1;
      scoreElement.textContent = score;
      feedback.textContent = ["Brilliant! 🌟", "You got it! 🎉", "Super maths! 🚀"][Math.floor(Math.random() * 3)];
      feedback.className = "feedback good";
    } else {
      button.classList.add("incorrect");
      feedback.textContent = `Nice try! The answer is ${correctAnswer}. You'll get the next one!`;
      feedback.className = "feedback try-again";
    }

    nextButton.disabled = false;
    nextButton.focus();
  }

  function updateProgress() {
    const progress = (questionNumber / totalQuestions) * 100;
    progressFill.style.width = `${progress}%`;
    progressBar.setAttribute("aria-valuenow", questionNumber);
  }

  function showQuestion() {
    questionNumber += 1;
    answered = false;
    questionCount.textContent = `Question ${questionNumber} of ${totalQuestions}`;
    feedback.textContent = "";
    feedback.className = "feedback";
    nextButton.classList.remove("hidden");
    nextButton.disabled = true;
    updateProgress();
    makeQuestion();

    if (questionNumber === totalQuestions) {
      nextButton.textContent = "See my score 🎉";
    } else {
      nextButton.innerHTML = 'Next question <span aria-hidden="true">→</span>';
    }
  }

  function finishQuiz() {
    questionText.textContent = score === totalQuestions
      ? "Perfect score! You're a Number Ninja! 🥷"
      : score >= 7
        ? "Amazing work, maths superstar! 🌟"
        : score >= 4
          ? "Great effort! You're getting stronger! 💪"
          : "Good try! Every puzzle helps you learn! 🌱";
    questionCount.textContent = "Quiz complete!";
    answersElement.replaceChildren();
    feedback.textContent = `You got ${score} out of ${totalQuestions} answers right.`;
    feedback.className = "feedback good";
    nextButton.classList.add("hidden");
    restartButton.classList.remove("hidden");
    updateProgress();
    restartButton.focus();
  }

  function startQuiz() {
    questionNumber = 0;
    score = 0;
    scoreElement.textContent = "0";
    startButton.classList.add("hidden");
    restartButton.classList.add("hidden");
    nextButton.classList.remove("hidden");
    progressFill.style.width = "0%";
    showQuestion();
  }

  startButton.addEventListener("click", startQuiz);
  restartButton.addEventListener("click", startQuiz);
  nextButton.addEventListener("click", () => {
    if (!answered) return;
    if (questionNumber === totalQuestions) {
      finishQuiz();
    } else {
      showQuestion();
    }
  });
})();