// Game Sounds
function playHarvestSound() {
  var audio = document.getElementById("harvestSound");
  audio.play();
}

function playPlantSound() {
  var audio = document.getElementById("plantSound");
  audio.play();
}

//Set Game Variables
var NumShoes = 0; // The number of products/orders
var Points = 1600; // The starting amount of points
var PlotCost = 100; // Cost to speed up manufacturing

// Time Reduction
var TimeReduction500Points = 1; // 1 week reduction for 500 points
var TimeReduction1000Points = 2; // 2 weeks reduction for 1000 points

// Time Constants
var StandardManufacturingTime = 4; // weeks

// Get DOM elements
var productChooserWrapper = $("#productChooserWrapper");
var productOptions = $("#productChooserWrapper > .footer > .product-type-option");
var manufacturingWrapper = $("#manufacturingWrapper");
var manufacturingSlot = $(".manufacturingSlot");
var PointsBox = $("#pointsBox");
var PointsBoxMessage = $("#PointsBoxMessage");
var BottomMessageUI = $("#UIMessageWrapper");
var ConfirmWrapper = $("#ConfirmWrapper");
var ConfirmWrapperOptions = $("#ConfirmWrapper > .buttons > .button");
var tutorialFloaty = $("#tutorialFloat");
var ItemSelection = ".ItemSelection-selection";

// Remove reset button


// Set Points and Factory from storage
var NumPlotsFromStorage = localStorage.getItem("NumPlots");
if (NumPlotsFromStorage == null || NumPlotsFromStorage == "NaN") {
  NumPlots = NumPlots;
} else {
  NumPlots = parseInt(NumPlotsFromStorage);
}
console.log("You have " + NumPlots + " purchased plots");

var PointsFromStorage = localStorage.getItem("NumPoints");
if (PointsFromStorage == null || PointsFromStorage == "NaN") {
  Points = Points;
} else {
  Points = parseInt(PointsFromStorage);
}
console.log("You have " + Points + " points");

$("#pointsBox").html(Points);

// Get Factory info
var FactoryFromStorage = localStorage.getItem("FactoryPurchased");
if (FactoryFromStorage == null || FactoryFromStorage == "NaN") {
  console.log("You don't own the factory!");
} else if (FactoryFromStorage == "true") {
  showTheFactory();
  runTheFactory();
  disableFactoryPurchase();
  console.log("You own the factory!");
} else {
  console.log("You don't own the factory!");
}

// Set HTML for product types
productChooserWrapper.find(".corn").find(".cost").html("Cost: " + SeedCostT1 + " points");
productChooserWrapper.find(".corn").find(".time").html("Time: " + counterLimitT1 + "s");
productChooserWrapper.find(".corn").find(".profit").html("Profit: " + ProfitT1 + " points");

productChooserWrapper.find(".blueberry").find(".cost").html("Cost: " + SeedCostT2 + " points");
productChooserWrapper.find(".blueberry").find(".time").html("Time: " + counterLimitT2 + "s");
productChooserWrapper.find(".blueberry").find(".profit").html("Profit: " + ProfitT2 + " points");

productChooserWrapper.find(".watermelon").find(".cost").html("Cost: " + SeedCostT3 + " points");
productChooserWrapper.find(".watermelon").find(".time").html("Time: " + counterLimitT3 + "s");
productChooserWrapper.find(".watermelon").find(".profit").html("Profit: " + ProfitT3 + " points");

// Create saved plots
function spawnSavedPlots() {
  var reqPlotsForSpawn = NumPlots;
  if (reqPlotsForSpawn >= 1 && NumPlots <= 16) {
    plot.remove();
    tutorialFloaty.hide();
    for (var i = 0; i < NumPlots; i++) {
      plotWrapper.append(spawnSavedPlot);
    }
  }
}
spawnSavedPlots();
makePlotAvailable();

// Clicking on a plot
$(document).on("click", ".plotBox", function(event) {
  if ($(this).hasClass("available")) {
    currentPlot = $(this);
    hideConfirmMenu();
    setTimeout(showConfirmMenu, 100);
  } else if ($(this).hasClass("ready-to-harvest")) {
    var cropType = checkCropType($(this));
    harvestPlot($(this), cropType);
  } else if ($(this).hasClass("ready")) {
    hideSeedSelectionMenu();
    setTimeout(function() {
      showSeedSelectionMenu();
      playPlantSound();
    }, 100);
    currentPlot = $(this);
  }
});

// Purchase Factory
coopBuyOption.click(function() {
  showFactoryMenu();
});

function buyTheFactory() {
  if (Points >= 10000) {
    showTheFactory();
    runTheFactory();
    Points = Points - 10000;
    SavePointsAmount(Points);
    PointsBox.html(Points);
    PointsBoxMessage.html("- 10,000 points");
    animatePointsTooltip();
    localStorage.setItem("FactoryPurchased", true);
    disableFactoryPurchase();
  } else {
    console.log("You don't have enough points!");
    BottomMessageUI.html("You don't have enough points!");
    animateBottomUITooltip();
  }
}

function runTheFactory() {
  setInterval(function() {
    Points = Points + factoryProfit;
    PointsBox.html(Points);
    PointsBoxMessage.html("+ " + factoryProfit + " points");
    animatePointsTooltip();
  }, 60 * 1000);
}

function showTheFactory() {
  Coop.addClass("show");
}

function disableFactoryPurchase() {
  coopBuyOption.hide();
}

