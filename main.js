
var COMMANDMENTS = [
  "COMMANDMENT CL Thou Shalt Not Have Been There From The Start.",
  "COMMANDMENT CXV Thou Shalt Not Be A Dick Loving Scooterer.",
  "COMMANDMENT CLXVII Thou Shalt Not Tweet People You Haven't Seen In Years.",
  "COMMANDMENT LVI Thou Shalt Not Steal.",
  "COMMANDMENT XCIII Thou Shalt Not Be Tryna Fuck W Me On Any Extra Type Of Level.",
  "COMMANDMENT LIX Thou Shalt Not Spend Thy Paycheck On Girl Scout Cookies.",
  "COMMANDMENT LXXV Thou Shalt Run Lint Frequently And Study Its Pronouncements With Care.",
  "COMMANDMENT XI Thou Shalt Not Speak Ever Again.",
  "COMMANDMENT CXLII Thou Shalt Not Be On Guys.",
  "COMMANDMENT CXCI Thou Shalt Not Listen To The Stories Of The Press.",
  "COMMANDMENT CXVIII Thou Shalt Not Have Stabbed Me In The Back.",
  "COMMANDMENT I Thou Shalt Shut Your Mouth.",
  "COMMANDMENT XIX Thou Shalt Not Fight Against It.",
  "COMMANDMENT V Thou Shalt Watch Gill Live On."
];
var COPY = [
  "Commandments is an installation piece that delivers commandments from above.",
  "It scrapes twitter for posts that instruct people how to act, and periodically delivers those instructions.",
  "The commandments are dropped from the heavens on consumer receipt paper.",
  "The diluge never stops as people are always ready to tell others how to live their lives."
];
var windowHeight, docHeight;
var timeAnimate = true;
var toSetupScrollControl = false;
var firstPrint = true;
var printDelay = 60000;
var printDestHeight = 0;
var receiptTemplate;
var footerHeight = 400;
var bottomReceiptPadding = 70;
var receiptFallDestination;

document.onreadystatechange = function(){
  if (document.readyState == "complete"){
    window.onresize = setPositions;
    document.onscroll = handleScroll;
    initCopy();
    setPositions();
    receiptTemplate = [
      Handlebars.compile(document.getElementById("receipt-template").innerHTML),
      Handlebars.compile(document.getElementById("receipt-template-2").innerHTML)
      ];
    triggerPrint("<p class='title'>Commandments</p>");
    requestAnimationFrame(update);
  }
};

var initCopy = function(){
  var cLen = COPY.length;
  var wrapper = document.getElementById("wrapper");
  var copyTemplate = Handlebars.compile("{{#each .}}<div class='copy'>{{.}}</div>{{/each}}");
  var markup = copyTemplate(COPY);
  document.getElementById("copy_placeholder").outerHTML = markup;
};

var triggerPrint = function(text){
  var context = {text:(text !== undefined ? text : COMMANDMENTS[Math.random()*COMMANDMENTS.length<<0])};
  document.getElementById("receipt_container").innerHTML = receiptTemplate[Math.random()*receiptTemplate.length<<0](context);
  timeAnimate = true;
  var printTracker = {value:-100};
  new TWEEN.Tween(printTracker)
    .to({value:printDestHeight}, 1000)
    .onUpdate(function(value){
      document.getElementById("receipt_fall_handle").style.top = ""+printTracker.value+"px";
    })
    .onComplete(function(){
      if (firstPrint){
        toSetupScrollControl = true;
        handleScroll();
      } else {
        setupScrollControl();
      }
    })
    .start();
};

var setNewReceipt = function(fallTracker){
  var currReceipt = document.getElementById("receipt");
  currReceipt.id = "";
  currReceipt.style.top = ""+(footerHeight-bottomReceiptPadding)+"px";
  var fallHandle = currReceipt.parentElement.parentElement;
  fallHandle.style.top = "";
  fallHandle.style.position = "";
  fallHandle.style.left = "";
  var footer = document.getElementById("receipt_anchor");
  footer.appendChild(currReceipt);
};

var setupScrollControl = function(){
  var duration;
  var handle = document.getElementById("receipt_fall_handle");
  var fallTracker = {tValue:printDestHeight, lValue:0};
  if (toSetupScrollControl){
    timeAnimate = false;
    toSetupScrollControl = false;
    duration = 1000;//we can't have variables here since the screen size may change. Math.max(docHeight - windowHeight, 1);
    handle.style.position = "fixed";
  } else {
    duration = Math.random()*5000+3000;
  }
  receiptFallDestination = {lValue:(fallTracker.lValue + (Math.random()-.5)*40)};
  setFallDestination();
  var receipt = document.getElementById("receipt");
  var repeats = Math.random()*2+2;
  new TWEEN.Tween(fallTracker)
    .to(receiptFallDestination, duration)
    .easing(TWEEN.Easing.Linear.None)
    .onComplete(function(obj){
      receiptFallDestination = undefined;
      setNewReceipt(fallTracker);
      setTimeout(triggerPrint, firstPrint ? 0 : printDelay);
      firstPrint = false;
      //triggerPrint();
    })
    .onUpdate(function(value){
      handle.style.top = ""+fallTracker.tValue+"px";
      var offset = Math.sin(value*repeats*2*Math.PI);
      receipt.style.marginLeft = "" + (-7.5 + offset*3 + fallTracker.lValue) +"em";
      receipt.style.webkitTransform = "rotate("+(-offset*25)+"deg)";
    })
    .delay(firstPrint ? 0 : 1000)
    .start(firstPrint ? 0 : undefined);
};

var setFallDestination = function(){
  if (receiptFallDestination === undefined){
    return;
  }
  if (firstPrint){
    receiptFallDestination.tValue = Math.max(windowHeight - bottomReceiptPadding, 1);
  } else {
    receiptFallDestination.tValue = Math.max(docHeight - bottomReceiptPadding, 1);
  }
};

var setPositions = function(){
  windowHeight = window.innerHeight;
  var currHeight = windowHeight;
  var list = document.getElementsByClassName("copy");
  var itemHeight;
  var currElem;
  for(var i = 0; i < list.length; i++){
    currElem = list[i];
    currElem.style.top = ""+currHeight+"px";
    currElem.style.opacity = 1;
    itemHeight = currElem.offsetHeight;
    currHeight += windowHeight/2;
  }
  docHeight = currHeight - windowHeight/2 + itemHeight;// = document.body.scrollHeight;//document.height was not returning the correct value
  document.getElementById("wrapper").style.height = ""+docHeight+"px";
  document.getElementById("footer").style.top = ""+(docHeight - footerHeight)+"px";
  setFallDestination();
  handleScroll();
};

var handleScroll = function(){
  if (toSetupScrollControl && window.pageYOffset == 0){
    setupScrollControl();
  }
  if (timeAnimate){return;}
  var lowest = Math.max(docHeight - windowHeight, 1);//avoid divide by zero error
  var currScroll = Math.min(Math.max(window.pageYOffset, 0), lowest);
  currScroll = currScroll/Math.max(docHeight - windowHeight, 1)*1000;
  TWEEN.update(currScroll);
};

var update = function(){
  if (timeAnimate){
    TWEEN.update();
  }
  requestAnimationFrame(update);
};