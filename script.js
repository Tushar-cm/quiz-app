const questionContainer = document.querySelector("h2");
const option1 = document.querySelector("#option1");
const option2 = document.querySelector("#option2");
const option3 = document.querySelector("#option3");
const option4 = document.querySelector("#option4");
const submitButton = document.querySelector("button");
const usersAnswer = document.querySelectorAll(".answer");
const scoreArea = document.querySelector("#ShowScore");
const timerElement = document.querySelector("#time");

let questionCount = 0;
let score = 0;
let timeLeft = 120;
let timerInterval;
let userAnswers = [];
let questionDataBase = []; // Corrected variable name

const fetchQuestionsFromAPI = async () => {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=24&difficulty=medium&type=multiple"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    const data = await response.json();
    return data.results.map((question) => ({
      question: question.question,
      option1: question.incorrect_answers[0],
      option2: question.incorrect_answers[1],
      option3: question.incorrect_answers[2],
      option4: question.correct_answer,
      ans: "option4", // Assuming correct_answer is always in option4
    }));
  } catch (error) {
    console.error("Error fetching questions:", error);
    return []; // Return empty array or handle error as needed
  }
};

const mainFunc = async () => {
  try {
    const questions = await fetchQuestionsFromAPI();
    questionDataBase.push(...questions); // Corrected spelling here
    displayQuestion();
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    alert("Failed to fetch questions. Please try again later.");
  }
};

const displayQuestion = () => {
  const question = questionDataBase[questionCount];
  if (!question) {
    return; // Handle case where there are no more questions
  }
  questionContainer.innerText = question.question;
  option1.innerText = question.option1;
  option2.innerText = question.option2;
  option3.innerText = question.option3;
  option4.innerText = question.option4;
};

const startTimer = () => {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.innerText = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      showScore();
    }
  }, 1000);
};

const goCheckAnswer = () => {
  let selectedAnswer;
  usersAnswer.forEach((data) => {
    if (data.checked) {
      selectedAnswer = data.nextElementSibling.innerText; // Get the text of the selected option
    }
  });
  userAnswers.push(selectedAnswer || "No answer"); // Store the user's answer or "No answer" if none selected
  return selectedAnswer;
};

const deselectAll = () => {
  usersAnswer.forEach((data) => {
    data.checked = false;
  });
};

const showScore = () => {
  scoreArea.style.display = "block";
  let scoreContent = `<h3>Your score is ${score} / ${questionDataBase.length}</h3>`;
  questionDataBase.forEach((q, index) => {
    const userAnswer = userAnswers[index];
    const correctAnswer = q[q.ans];
    scoreContent += `<div>
        <h4>${q.question}</h4>
        <p>Your answer: <span style="color: ${userAnswer === correctAnswer ? 'green' : 'red'}">${userAnswer}</span></p>
        ${userAnswer !== correctAnswer ? `<p>Correct answer: <span style="color: green">${correctAnswer}</span></p>` : ''}
      </div>`;
  });
  scoreContent += `<button class='btn' onclick='location.reload()'>Play Again</button>`;
  scoreArea.innerHTML = scoreContent;
};

submitButton.addEventListener("click", () => {
  const checkAnswer = goCheckAnswer();
  if (checkAnswer === questionDataBase[questionCount].option4) {
    score++;
  }
  questionCount++;
  deselectAll();
  if (questionCount < questionDataBase.length) {
    displayQuestion();
  } else {
    clearInterval(timerInterval);
    showScore();
  }
});

mainFunc();
startTimer();
