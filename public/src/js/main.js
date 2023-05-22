const infoContainer = document.querySelector('.info-container');
let isMovable = false;
let offsetX = 0;
let offsetY = 0;

infoContainer.addEventListener('mousedown', function (e) {
    isMovable = true;
    offsetX = e.clientX - infoContainer.offsetLeft;
    offsetY = e.clientY - infoContainer.offsetTop;
});
document.addEventListener('mousemove', function (e) {
    if (isMovable) {
        let x = e.clientX - offsetX + 'px';
        let y = e.clientY - offsetY + 'px';
        infoContainer.style.left = x;
        infoContainer.style.top = y;
    }
});
document.addEventListener('mouseup', function () {
    isMovable = false;
});