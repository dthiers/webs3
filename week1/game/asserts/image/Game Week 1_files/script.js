function getCenter(){
  var width = $(window).innerWidth();
  var height = $(window).innerHeight();

  xCenter = $width / 2;
  yCenter = $height / 2;

  console.log(xCenter yCenter);
}

$(window).resize(function() {
  getCenter();
})
