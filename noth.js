var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var unit = new Image();
var bg = new Image();
var platform = new Image();

var prompt = prompt('выберите персонажа за которого хотите играть. Ниндзя - 1, барашек - 2, кролик - 3, космонавт - 4')

var scrollSpeed = 3; // Скорость опускания экрана

// Функция для отрисовки изображений после их загрузки
function drawImagesOnLoad() {
  if (unit.complete && bg.complete && platform.complete) {
    initPlatforms();
    draw();
  }
}

// Обработчики событий загрузки и ошибки для изображений
unit.onload = drawImagesOnLoad;
bg.onload = drawImagesOnLoad;
platform.onload = drawImagesOnLoad;

// Пути к изображениям
bg.src = "GameModel/bg.png"
if (prompt == '1') {
unit.src = "GameModel/unit.png"
}
if (prompt == '2') {
  unit.src = "GameModel/unit2.png"
}
if (prompt == '3') {
  unit.src = "GameModel/unit3.png"
}
if (prompt == '4') {
  unit.src = "GameModel/unit4.png"
}
platform.src = "GameModel/platform.png"

var xPosition = canvas.width / 2;
var yPosition = canvas.height / 2;
var prevYPosition = yPosition; // Предыдущая позиция персонажа по оси Y
var gravity = 1;
var platformWidth = 100;
var platformY = canvas.height - 50; // Начальная позиция платформ
var platformX = (canvas.width - platformWidth) / 2; // Центр холста по горизонтали
var platforms = [];
var platformDropped = false; // Флаг для отслеживания опущенных платформ

// Функция для инициализации платформ
function initPlatforms() {
  platforms = [
    { x: platformX, y: platformY, image: platform },
    { x: platformX + 60, y: platformY - 110, image: platform },
    { x: platformX - 70, y: platformY - 220, image: platform },
    { x: platformX + 85, y: platformY - 330, image: platform },
    { x: platformX - 80, y: platformY - 440, image: platform },
    { x: platformX + 90, y: platformY - 550, image: platform }
  ];
}

function draw() {
  // Очищаем холст перед отрисовкой нового кадра
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Проверяем, нужно ли опустить платформы
  if (yPosition < canvas.height / 2 && prevYPosition >= canvas.height / 2) {
    platforms.forEach(function(platform) {
      platform.y += 100; // Опускаем платформы на 100 пикселей
    });
    platformDropped = true; // Устанавливаем флаг, чтобы сгенерировать новую платформу
    var score = document.getElementById('score');
    score.innerHTML = parseInt(score.innerHTML) + 1;
  }

  // Генерируем новую платформу, если платформы были опущены
  if (platformDropped) {
    var highestPlatform = platforms.reduce(function(prev, curr) {
      return (prev.y < curr.y) ? prev : curr;
    });
    var newPlatformY = highestPlatform.y - 100; // Позиция по оси Y для новой платформы
    var newPlatformX = Math.random() * (canvas.width - platformWidth); // Случайная позиция по оси X
    platforms.unshift({ x: newPlatformX, y: newPlatformY, image: platform }); // Добавляем новую платформу в начало массива
    platformDropped = true; // Сбрасываем флаг
  }

  platforms.forEach(function(platform) {
    ctx.drawImage(platform.image, platform.x, platform.y, platformWidth, 10);
  });

  ctx.drawImage(unit, xPosition - 25, yPosition, 90, 70);

  // Обновляем предыдущую позицию персонажа
  prevYPosition = yPosition;
  yPosition += gravity;

// Проверяем условие для перезагрузки страницы
if (yPosition >= canvas.height) {
  location.reload();
}

if (xPosition >= canvas.width) {
  xPosition -= canvas.width;
}
if (xPosition <= canvas.width - canvas.width){
  xPosition += canvas.width;
}

platforms.forEach(function(platform) {
  var centerOfCharacter = xPosition + 25; // Центральная точка персонажа (25 - половина ширины персонажа)
  if (centerOfCharacter >= platform.x && centerOfCharacter <= platform.x + platformWidth
      && yPosition + 70 >= platform.y && yPosition + 70 <= platform.y + 10) {
    yPosition -= 140; // высота прыжка
  }
});

  requestAnimationFrame(draw);
}

document.addEventListener('keydown', move);

function move(event) {
  const key = event.key;

  switch (key) {
    case 'ArrowLeft':
      xPosition -= 45;
      break;
    case 'ArrowRight':
      xPosition += 45;
      break;
  }
}

function instr(){
  alert('Персонаж управляется при помощи стрелочек влево и вправо. Новые платформы появляются только после того, как он отпрыгнет от второй снизу платформы. Удачи, дорогой игрок.');
}
