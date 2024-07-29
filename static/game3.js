const questions = [
    {
        question: '<img src="static/image/mom1.png" alt="Question 1 Image">',
        answers: [
            {imgSrc: "static/image/kids1.png", correct: true},
            {imgSrc: "static/image/kids3.png", correct: false},
            {imgSrc: "static/image/kids5.png", correct: false},
        ]
    },
    {
        question: '<img src="static/image/mom2.png" alt="Question 2 Image">',
        answers: [
            {imgSrc: "static/image/kids5.png", correct: false},
            {imgSrc: "static/image/kids3.png", correct: false},
            {imgSrc: "static/image/kids2.png", correct: true},
        ]
    },
    {
        question: '<img src="static/image/mom3.png" alt="Question 3 Image">',
        answers: [
            {imgSrc: "static/image/kids3.png", correct: true},
            {imgSrc: "static/image/kids1.png", correct: false},
            {imgSrc: "static/image/kids4.png", correct: false},
        ]
    },
    {
        question: '<img src="static/image/mom4.png" alt="Question 4 Image">',
        answers: [
            {imgSrc: "static/image/kids2.png", correct: false},
            {imgSrc: "static/image/kids4.png", correct: true},
            {imgSrc: "static/image/kids1.png", correct: false},
        ]
    },
    {
        question: '<img src="static/image/mom5.png" alt="Question 5 Image">',
        answers: [
            {imgSrc: "static/image/kids5.png", correct: true},
            {imgSrc: "static/image/kids2.png", correct: false},
            {imgSrc: "static/image/kids4.png", correct: false},
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const exitButton = document.getElementById("exit");



let currentQuestionIndex =  0;
let score = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Далее";
    shuffleArray(questions);
    showQuestion();
    exitButton.style.display = "none";
}

function showQuestion(){
    resetState();

    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        const img = document.createElement("img");
        img.src = answer.imgSrc;
        button.appendChild(img);
        //button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;

        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e){
    const selectedBtn = e.target.closest("button");
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }else{
        selectedBtn.classList.add("incorrect");
    }

    nextButton.style.display = "block";

}

function showScore(){
    resetState();
    questionElement.innerHTML = `Твой результат ${score} из ${questions.length}!`;
    saveGameData(score);
    exitButton.style.display = "block";
}

function saveGameData(score) {
  const data = {
    score: score,
  };

  // Отправляем данные на сервер методом POST
  fetch('/save_game3_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      console.log('Данные игры сохранены успешно.');
    } else {
      console.error('Ошибка сохранения данных игры.');
    }
  })
  .catch(error => {
    console.error('Ошибка сети:', error);
  });
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", ()=>{
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
});

startQuiz();



const helpButton = document.getElementById("help-button");
const helpPopup = document.querySelector(".help-popup");
const closeButton = document.getElementById("close-button");

helpButton.addEventListener("click", function() {
  helpPopup.style.display = "block";
});

closeButton.addEventListener("click", function() {
  helpPopup.style.display = "none";
});