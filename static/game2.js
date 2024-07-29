const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const exitButton = document.getElementById("exit");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items array
const items = [
  { name: "bee", image: "static/image/bee.png" },
  { name: "crocodile", image: "static/image/crocodile.png" },
  { name: "macaw", image: "static/image/macaw.png" },
  { name: "gorilla", image: "static/image/gorilla.png" },
  { name: "tiger", image: "static/image/tiger.png" },
  { name: "monkey", image: "static/image/monkey.png" },
  { name: "chameleon", image: "static/image/chameleon.png" },
  { name: "piranha", image: "static/image/piranha.png" },
  { name: "anaconda", image: "static/image/anaconda.png" },
  { name: "sloth", image: "static/image/sloth.png" },
  { name: "cockatoo", image: "static/image/cockatoo.png" },
  { name: "toucan", image: "static/image/toucan.png" },
];

//Начальное время
let seconds = 0,
  minutes = 0;
//Начальное количество ходов и правильных пар
let movesCount = 0,
  winCount = 0;

//Для таймера
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //Форматируем время перед отображением
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Время:</span>${minutesValue}:${secondsValue}`;
};



//Для подсчета ходов
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Колличество шагов:</span>${movesCount}`;
};

//Выбрать случайные объекты из массива items
const generateRandom = (size = 4) => {
  //Временный массив
  let tempArray = [...items];
  //Инициализируем массив cardValues
  let cardValues = [];
  //Размер должен быть вдвое больше (4*4 матрица)/2, так как будут существовать пары объектов
  size = (size * size) / 2;
  //Случайный выбор объектов
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //После выбора удаляем объект из временного массива
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  // Простое перемешивание
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Создание карточек
        before => лицевая сторона (содержит вопросительный знак)
        after => обратная сторона (содержит реальное изображение)
        data-card-values - пользовательский атрибут, который хранит названия карточек для сопоставления
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  // Сетка
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  // Карточки
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
       // Если выбранная карточка еще не совпала, тогда запускаем (уже совпавшая карточка при клике будет проигнорирована)
      if (!card.classList.contains("matched")) {
        // Переворачиваем выбранную карточку
        card.classList.add("flipped");
        // Если это первая выбранная карточка (так как firstCard изначально ложно)
        if (!firstCard) {
          // Текущая карточка становится firstCard
          firstCard = card;
           // Значение текущей карточки становится firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          // Увеличиваем количество ходов, так как пользователь выбрал вторую карточку
          movesCounter();
          // Вторая карточка и ее значение
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
             // Если обе карточки совпали, добавляем им класс "matched", чтобы они игнорировались в следующий раз
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            // Устанавливаем firstCard в false, так как следующая карточка будет первой
            firstCard = false;
             // Увеличиваем winCount, так как пользователь нашел правильную пару
            winCount += 1;
            // Проверяем, если winCount равен половине длины cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
            // Форматируем время
            let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
            let minutesValue = minutes < 10 ? `0${minutes}` : minutes;

            // Выводим сообщение о победе с количеством шагов и временем
            result.innerHTML = `<h2>Ты победил!</h2>
                                <h4>Количество шагов: ${movesCount}</h4>
                                <h4>Время: ${minutesValue}:${secondsValue}</h4>`;
            saveGameData(movesCount, minutes, seconds);
            stopGame();
            }
          } else {
            // Если карточки не совпадают
            // Переворачиваем карточки обратно
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

function saveGameData(movesCount, minutes, seconds) {
  // Преобразование времени в формат "минуты:секунды"
  const timeString = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

  // Формирование объекта с данными для отправки
  const data = {
    moves: movesCount,
    time: timeString
  };

  // Отправка данных на сервер методом POST
  fetch('/save_game_data', {
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


//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls amd buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  exitButton.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Колличество шагов:</span> ${movesCount}`;
  initializer();
});

//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    startButton.classList.add("hide");
    stopButton.classList.remove("hide");
    exitButton.classList.remove("hide");
    clearInterval(interval);

  })
);

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};

const helpButton = document.getElementById("help-button");
const helpPopup = document.querySelector(".help-popup");
const closeButton = document.getElementById("close-button");

helpButton.addEventListener("click", function() {
  helpPopup.style.display = "block";
});

closeButton.addEventListener("click", function() {
  helpPopup.style.display = "none";
});
