window.onload = function () {
  var $menuButton = document.getElementById('menu');
  var $sidebar = document.getElementById('sidebar');
  var $mask = document.getElementById('mask');
  $menuButton.onclick = function () {
    $sidebar.className = 'sidebar show';
    $mask.className = 'show';
  };
  $mask.onclick = function () {
    $sidebar.className = 'sidebar';
    $mask.className = '';
  };
};
