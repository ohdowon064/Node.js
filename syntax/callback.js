// function a() {
//     console.log('A');
// }

var a = function() {
    console.log('A');
} // 자바스크립트에서는 함수는 값이다. 왜? 변수에 할당할 수 있으니깐

function slowfunc(callback) {
    callback();
}

slowfunc(a);

// slowfunc가 실행이 되고, 