triggerPrint()
printDelay = 1000

Utils.cleanNewLines("hello\nthere\n\nHow are you?\n")

var testWrap = function(){
  var ctx = document.createElement("canvas").getContext("2d");
  var font = "24px Oswald";
  console.log(Utils.wrapCanvasLines(ctx, "hello\nthere\n\nHow are you?\n", 100, font));

}
  var ctx = document.createElement("canvas").getContext("2d");
  var font = "24px Oswald";
  Utils.wrapCanvasLines(ctx, "hellothereIwouldlikeTOMeetyou\n\nHow are you?\n", 100, font);