//GameSounds
function playOrderConfirmedSound() {
  var audio = document.getElementById("orderConfirmedSound");
  audio.play();
}

function playSpeedUpSound() {
  var audio = document.getElementById("speedUpSound");
  audio.play();
}

//RESET LOCAL STORAGE
$(document).on("click", "#resetAll", function() {
  localStorage.clear();
  console.log("All LocalStorage Items Cleared");
});

//Set Game Variables
var Money = 160; //initial money
var Points = 0; //initial points
var ProductCost = 500; //example cost of a product in points
var ManufacturingTime = 4 * 7 * 24 * 60 * 60 * 1000; //4 weeks in milliseconds
var SpeedUpCost1 = 500; //500 points to reduce time by 1 week
var SpeedUpCost2 = 1000; //1000 points to reduce time by 2 weeks

//Get DOM elements
var MoneyBox = $("#moneyBox");
var PointsBox = $("#pointsBox");
var OrderProgress = $("#orderProgress");
var BottomMessageUI = $("#UIMessageWrapper");
var ConfirmWrapper = $("#ConfirmWrapper");
var ConfirmWrapperOptions = $("#ConfirmWrapper > .buttons > .button");

//Local Storage Setup
//MONEY
var MoneyFromStorage = localStorage.getItem("NumMoney");
if (MoneyFromStorage == null || MoneyFromStorage == "NaN") {
  Money = Money;
} else {
  Money = parseInt(MoneyFromStorage);
}
$("#moneyBox").html(Money);

//POINTS
var PointsFromStorage = localStorage.getItem("NumPoints");
if (PointsFromStorage == null || PointsFromStorage == "NaN") {
  Points = Points;
} else {
  Points = parseInt(PointsFromStorage);
}
$("#pointsBox").html(Points);

//PRODUCT SELECTION
function selectProduct(product) {
  if (Money >= ProductCost) {
    Money -= ProductCost;
    Points += calculatePoints(ProductCost);
    SaveMoneyAmount(Money);
    SavePointsAmount(Points);
    $("#moneyBox").html(Money);
    $("#pointsBox").html(Points);
    startManufacturing(product);
  } else {
    BottomMessageUI.html("You DO NOT have enough money!");
    animateBottomUITooltip();
  }
}

//START MANUFACTURING PROCESS
function startManufacturing(product) {
  playOrderConfirmedSound();
  var timeRemaining = ManufacturingTime; // Set to 4 weeks initially
  var interval = setInterval(function() {
    timeRemaining -= 1000; // Reduce time every second
    updateProgress(timeRemaining);
    if (timeRemaining <= 0) {
      clearInterval(interval);
      completeOrder(product);
    }
  }, 1000);
}

//UPDATE PROGRESS BAR
function updateProgress(timeRemaining) {
  var percentage = 100 - (timeRemaining / ManufacturingTime) * 100;
  OrderProgress.css("width", percentage + "%");
}

//SPEED UP ORDER
function speedUpOrder(weeks) {
  if (weeks == 1 && Points >= SpeedUpCost1) {
    Points -= SpeedUpCost1;
    ManufacturingTime -= 1 * 7 * 24 * 60 * 60 * 1000; // Reduce by 1 week
    playSpeedUpSound();
  } else if (weeks == 2 && Points >= SpeedUpCost2) {
    Points -= SpeedUpCost2;
    ManufacturingTime -= 2 * 7 * 24 * 60 * 60 * 1000; // Reduce by 2 weeks
    playSpeedUpSound();
  } else {
    BottomMessageUI.html("You DO NOT have enough points!");
    animateBottomUITooltip();
  }
  SavePointsAmount(Points);
  $("#pointsBox").html(Points);
}

//ORDER COMPLETION
function completeOrder(product) {
  BottomMessageUI.html("Your " + product + " is ready for collection!");
  animateBottomUITooltip();
}

//CALCULATE POINTS BASED ON PURCHASE VALUE
function calculatePoints(value) {
  return value * 0.1; //1 point = 10c
}

//SAVE MONEY AMOUNT
function SaveMoneyAmount(moneyAmount) {
  localStorage.setItem("NumMoney", moneyAmount);
}

//SAVE POINTS AMOUNT
function SavePointsAmount(pointsAmount) {
  localStorage.setItem("NumPoints", pointsAmount);
}

//ANIMATE THE BOTTOM MESSAGE TIP
function animateBottomUITooltip() {
  BottomMessageUI.animate(
    {
      opacity: "1"
    },
    1000,
    "linear",
    function() {
      BottomMessageUI.animate({
        opacity: "0"
      });
    }
  );
}
