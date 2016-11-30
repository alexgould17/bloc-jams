var points = document.getElementsByClassName('point');
var animatePoints = function() {
  var revealPoint = function(i) {
    points[i].style.opacity = 1;
    points[i].style.transform = "scaleX(1) translateY(0)";
    points[i].style.msTransform = "scaleX(1) translateY(0)";
    points[i].style.WebkitTransform = "scaleX(1) translateY(0)";
  };
  for(var j = 0; j < points.length; j++) {
    revealPoint(j);
  }
};

window.onload = function () {
  if (window.innerHeight > 950) {
    animatePoints(points);
  }
  var sellingPoints = document.getElementsByClassName('selling-points')[0];
  var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
  alert('The window has loaded!');
  window.addEventListener('scroll', function(event) {
    if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
      animatePoints(points);   
    }
  });
}