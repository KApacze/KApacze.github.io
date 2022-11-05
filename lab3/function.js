var btn = document.querySelector('.add');
var remove = document.querySelector('.draggable');
 
function dragStart(e) {
  this.style.opacity = '0.4';
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
};
 
function dragEnter(e) {
  this.classList.add('over');
}
 
function dragLeave(e) {
  e.stopPropagation();
  this.classList.remove('over');
}
 
function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}
 
function dragDrop(e) {
  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  return false;
}
 
function dragEnd(e) {
  var listItens = document.querySelectorAll('.draggable');
  [].forEach.call(listItens, function(item) {
    item.classList.remove('over');
  });
  this.style.opacity = '1';
}
 
function addEventsDragAndDrop(el) {
  el.addEventListener('dragstart', dragStart, false);
  el.addEventListener('dragenter', dragEnter, false);
  el.addEventListener('dragover', dragOver, false);
  el.addEventListener('dragleave', dragLeave, false);
  el.addEventListener('drop', dragDrop, false);
  el.addEventListener('dragend', dragEnd, false);
}
 
var listItens = document.querySelectorAll('.draggable');
[].forEach.call(listItens, function(item) {
  addEventsDragAndDrop(item);
});

function createDiv() {
  var shape = document.createElement("div");
  shape.className = "draggable butNotHere";
  shape.style.height = "150px";
  shape.style.width = "150px";
  shape.style.backgroundColor = "#" + ((1<<24)*Math.random() | 0).toString(16);
  shape.style.position = "absolute";
  shape.style.top ="20%";
  shape.style.left ="20%";
  $(shape).draggable({
      obstacle:".butNotHere",
      preventCollision: true,
      containment: "#board",
      start: function(event,ui) {$(this).removeClass('butNotHere');},
      stop: function(event,ui) {$(this).addClass('butNotHere');}
   });
  document.querySelector("#blockgen").appendChild(shape);
};