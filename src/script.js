//GameSounds
function playHarvestSound() {
  var audio = document.getElementById("harvestSound");
  audio.play();
}

function playPlantSound() {
  var audio = document.getElementById("plantSound");
  audio.play();
}

//RESET LOCAL STORAGE
$(document).on("click", "#resetAll", function() {
  localStorage.clear();
  console.log("All LocalStorage Items Clear");
});
//END RESET LOCAL STORAGE

//Set Game Variables
var NumPlots = 0; //a reset for the number of plots a user has
var Money = 160; //the amount of money to start
var PlotCost = 100; //Cost of a Plot of land

var SeedCostT1 = 30; //Cost of seeds to plant
var SeedCostT2 = 50; //Cost of seeds to plant
var SeedCostT3 = 120; //Cost of seeds to plant

var counterLimitT1 = 32; //Time it takes to grow to corn \ MUST BE DIVISIBLE BY 4
var counterLimitT2 = 64; //X amount of the counter limit for other crops
var counterLimitT3 = 120; //X amount of the counter limit for other crops

var ProfitT1 = 55; //Profit per harvest
var ProfitT2 = 95; //Profit modifier for other crops
var ProfitT3 = 180; //Profit modifier for other crops

var coopProfit = 150; //Profit from the purchased coop

//Get DOM elements
var cropChooserWrapper = $("#cropChooserWrapper");
var cropChooserOptions = $("#cropChooserWrapper > .footer > .crop-type-option");
var plotWrapper = $("#plotWrapper");
var plot = $(".plotBox");
var MoneyBox = $("#moneyBox");
var MoneyBoxMessage = $("#MoneyBoxMessage");
var BottomMessageUI = $("#UIMessageWrapper");
var ConfirmWrapper = $("#ConfirmWrapper");
var ConfirmWrapperOptions = $("#ConfirmWrapper > .buttons > .button");
var tutorialFloaty = $("#tutorialFloat");
var seedSelection = ".seed-selection";

//Purchase Coop
var coopBuyOption = $("#CoopBuyOption");
var coopBuyOptions = $("#CoopExpansionWrapper > .buttons > .button");
var CoopExpansionWrapper = $("#CoopExpansionWrapper");
var Coop = $("#Coop");

//Grab code for spaner plots & remove when done
var spawnSavedPlot = $(".plotBoxSaved").html();
$(".plotBoxSaved").remove();
//Grab code for new plot
var spawnNewPlot = $("<div />")
  .append($(".plotBox").clone())
  .html();

//LOCAL STORAGE VARIABLES
//NUMBER OF PRE-PURCHASED PLOTS
var NumPlotsFromStorage = localStorage.getItem("NumPlots");
if (NumPlotsFromStorage == null || NumPlotsFromStorage == "NaN") {
  //if no saved plots then reset to variable
  NumPlots = NumPlots;
} else {
  //otherwise set the number to what is in storage
  NumPlots = parseInt(NumPlotsFromStorage);
}
console.log("you have " + NumPlots + " purchased plots");

//AMOUNT OF MONEY
var MoneyFromStorage = localStorage.getItem("NumMoney");
if (MoneyFromStorage == null || MoneyFromStorage == "NaN") {
  //same as above
  Money = Money;
} else {
  //same as above
  Money = parseInt(MoneyFromStorage);
}
console.log("you have R" + Money);

//SET STUFF
$("#moneyBox").html(Money);

//GET COOP INFO
var CoopFromStorage = localStorage.getItem("CoopPurchased");
if (CoopFromStorage == null || CoopFromStorage == "NaN") {
  //same as above
  //Money = Money;
  console.log("you don't own the coop!");
} else if (CoopFromStorage == "true") {
  //Show the Coop
  showTheCoop();
  //Start the Counter
  runTheCoop();
  //Update Money Stuff
  disableCoopPurchase();
  console.log("you own the coop!");
} else if (CoopFromStorage == "false") {
  console.log("you don't own the coop!");
}

//SET STUFF
$("#moneyBox").html(Money);

//Set HTML on starting elements (cost, time, and profit)
cropChooserWrapper
  .find(".corn")
  .find(".cost")
  .html("Cost: R" + SeedCostT1);
cropChooserWrapper
  .find(".corn")
  .find(".time")
  .html("Time: " + counterLimitT1 + "s");
cropChooserWrapper
  .find(".corn")
  .find(".profit")
  .html("Profit: R" + ProfitT1);

cropChooserWrapper
  .find(".blueberry")
  .find(".cost")
  .html("Cost: R" + SeedCostT2);
cropChooserWrapper
  .find(".blueberry")
  .find(".time")
  .html("Time: " + counterLimitT2 + "s");
cropChooserWrapper
  .find(".blueberry")
  .find(".profit")
  .html("Profit: R" + ProfitT2);

cropChooserWrapper
  .find(".watermelon")
  .find(".cost")
  .html("Cost: R" + SeedCostT3);
cropChooserWrapper
  .find(".watermelon")
  .find(".time")
  .html("Time: " + counterLimitT3 + "s");
cropChooserWrapper
  .find(".watermelon")
  .find(".profit")
  .html("Profit: R" + ProfitT3);

//CREATE SAVED PLOTS
function spawnSavedPlots() {
  var reqPlotsForSpawn = NumPlots; //get number of plots minus 1
  if (reqPlotsForSpawn >= 1 && NumPlots <= 16) {
    //if 1 or more AND less than 16 then spawn purchased plots
    //console.log("you have enough plots to spawn");
    plot.remove();
    tutorialFloaty.hide(); //hide tutorial if player has already played the game
    for (var i = 0; i < NumPlots; i++) {
      plotWrapper.append(spawnSavedPlot); //add the plots the user owns
      //console.log("1 plot appended");
    }
  } else {
    //console.log("NOTHING was spawned");
  }
  //plotWrapper.append(spawnNewPlot);
}
spawnSavedPlots();
makePlotAvailable();
//END CREATE SAVED PLOTS

//RUN STUFF
//TURN OFF TUTORIAL
$(document).on("click", ".tutorialOne", function() {
  tutorialFloaty.fadeOut();
  $(this).removeClass("tutorialOne");
});
//END TURN OFF TUTORIAL

$("#closeChooser").click(function() {
  hideSeedSelectionMenu();
});

$("#closeConfirm").click(function() {
  hideConfirmMenu();
});

$("#closeCoopConfirm").click(function() {
  hideCoopMenu();
});

var currentPlot = "";

//CLICK ON A PLOT
$(document).on("click", ".plotBox", function(event) {
  //console.log("clicked on plot");
  if ($(this).hasClass("available")) {
    //IF PLOT IS AVAILABLE
    currentPlot = $(this);
    hideConfirmMenu();
    function HideShowConfirmMenu() {
      showConfirmMenu();
    }
    // use setTimeout() to execute
    setTimeout(HideShowConfirmMenu, 100);
    //convertPlot($(this));
    //makePlotAvailable();
    //IF PLOT IS READY TO HARVEST
  } else if ($(this).hasClass("ready-to-harvest")) {
    //IF PLOT IS SEEDED
    var cropType = checkCropType($(this));
    harvestPlot($(this), cropType);
  } else if ($(this).hasClass("ready")) {
    hideSeedSelectionMenu();
    function HideShowSelectionMenu() {
      showSeedSelectionMenu();
      playPlantSound();
    }
    // use setTimeout() to execute
    setTimeout(HideShowSelectionMenu, 100);

    //setUpSeed($(this));
    currentPlot = $(this);
  } else {
    //do nothing
  }
});

function checkCropType(plotInfo) {
  var cropType = "";
  if (plotInfo.hasClass("corn")) {
    return "corn";
  } else if (plotInfo.hasClass("blueberry")) {
    return "blueberry";
  } else if (plotInfo.hasClass("watermelon")) {
    return "watermelon";
  } else {
    return "none";
  }
}

function checkCropCost(plotType) {
  if (plotType == "corn") {
    return SeedCostT1;
    //console.log("crop is type corn and the cost is: " + SeedCost);
  } else if (plotType == "blueberry") {
    return SeedCostT2;
    //console.log("crop is type strawberry and the cost is: " + SeedCost * SeedCostModifier);
  } else if (plotType == "watermelon") {
    return SeedCostT3;
    //console.log("crop is type blueberry and the cost is: " + SeedCost * SeedCostModifier);
  } else {
    //do nothing
  }
}

function checkCropProfit(plotType) {
  if (plotType == "corn") {
    return ProfitT1;
  } else if (plotType == "blueberry") {
    return ProfitT2;
  } else if (plotType == "watermelon") {
    return ProfitT3;
  } else {
    //do nothing
  }
}

function checkPlotCounterLimit(plotType) {
  if (plotType == "corn") {
    return counterLimitT1;
  } else if (plotType == "blueberry") {
    return counterLimitT2;
  } else if (plotType == "watermelon") {
    return counterLimitT3;
  } else {
    //do nothing
  }
}

//RUN TIMER
function setUpSeed(plot) {
  //console.log("plot is ready");
  plot.removeClass("ready");
  plot.addClass("seeded");
  startTimer(plot);
  hideSeedSelectionMenu();
}

function startTimer(plot) {
  //console.log("Timer Started");
  var cropType = checkCropType(plot);
  var CounterLimit = checkPlotCounterLimit(cropType);
  var CropProfit = checkCropProfit(cropType);
  var Counter = 0;
  var Timer = setInterval(function() {
    Counter++;
    plot.find(".crop-info").html(Counter);
    if (Counter >= CounterLimit) {
      //console.log("STOP TIMER");
      clearInterval(Timer);
      //console.log("TIMER STOPPED");
      plot.removeClass("seeded");
      plot.addClass("ready-to-harvest");
      plot.find(".crop-info").html("Ready!");
      //HARVEST THIS CROP & ADD TO BANK
    }
  }, 1000);
}

//HARVEST PLOT
function harvestPlot(plot, cropType) {
  playHarvestSound();
  var cropProfit = checkCropProfit(cropType);
  Money += cropProfit;
  MoneyBox.html(Money);
  MoneyBoxMessage.html("You made R" + cropProfit);
  plot.removeClass("ready-to-harvest corn blueberry watermelon");
  plot.addClass("ready");
}

//Purchase a Plot of land
$("#purchasePlot").click(function() {
  if (Money >= PlotCost) {
    if (NumPlots < 16) {
      Money -= PlotCost;
      NumPlots++;
      MoneyBox.html(Money);
      MoneyBoxMessage.html("You purchased 1 plot of land for R" + PlotCost);
      addPlot();
      makePlotAvailable();
      localStorage.setItem("NumMoney", Money);
      localStorage.setItem("NumPlots", NumPlots);
    } else {
      alert("You own all the land available!");
    }
  } else {
    MoneyBoxMessage.html("Not enough money. You need R" + PlotCost);
  }
});

function addPlot() {
  plotWrapper.append(spawnNewPlot);
}

//MAKE PLOT AVAILABLE
function makePlotAvailable() {
  $(".plotBox").each(function() {
    //console.log("Checking plots!");
    if (!$(this).hasClass("available")) {
      if (!$(this).hasClass("ready")) {
        if (!$(this).hasClass("seeded")) {
          if (!$(this).hasClass("ready-to-harvest")) {
            $(this).addClass("available ready");
            $(this).find(".crop-info").html("Available");
            //console.log("1 plot made available");
            return false;
          }
        }
      }
    }
  });
}

//PURCHASE COOP
$("#purchaseCoop").click(function() {
  if (Money >= 500) {
    Money -= 500;
    MoneyBox.html(Money);
    hideCoopMenu();
    disableCoopPurchase();
    MoneyBoxMessage.html("You purchased the Coop for R500");
    localStorage.setItem("NumMoney", Money);
    showTheCoop();
    runTheCoop();
    localStorage.setItem("CoopPurchased", "true");
  } else {
    MoneyBoxMessage.html("Not enough money. You need R500");
  }
});

function showTheCoop() {
  Coop.show();
}

function hideCoopMenu() {
  CoopExpansionWrapper.hide();
}

function disableCoopPurchase() {
  coopBuyOption.hide();
}

//RUN THE COOP
function runTheCoop() {
  //console.log("coop running");
  var Counter = 0;
  var Timer = setInterval(function() {
    Counter++;
    if (Counter >= 60) {
      //console.log("STOP TIMER");
      clearInterval(Timer);
      //console.log("TIMER STOPPED");
      Money += coopProfit;
      MoneyBox.html(Money);
      MoneyBoxMessage.html("The chickens made you R" + coopProfit);
      runTheCoop();
      localStorage.setItem("NumMoney", Money);
    }
  }, 1000);
}

//Show and Hide the Crop Selection Menus
function showSeedSelectionMenu() {
  cropChooserWrapper.show();
}

function hideSeedSelectionMenu() {
  cropChooserWrapper.hide();
}

function showConfirmMenu() {
  ConfirmWrapper.show();
}

function hideConfirmMenu() {
  ConfirmWrapper.hide();
}

function hideCoopMenu() {
  CoopExpansionWrapper.hide();
}

//BUY CROPS
//Buy Corn
cropChooserOptions.click(function() {
  var selectedSeedType = $(this).attr("data-seed-type");
  var seedCost = checkCropCost(selectedSeedType);
  if (Money >= seedCost) {
    Money -= seedCost;
    setUpSeed(currentPlot);
    MoneyBox.html(Money);
    MoneyBoxMessage.html(
      "You planted " + selectedSeedType + " for R" + seedCost
    );
    currentPlot.addClass(selectedSeedType);
    localStorage.setItem("NumMoney", Money);
  } else {
    MoneyBoxMessage.html("Not enough money. You need R" + seedCost);
  }
});
