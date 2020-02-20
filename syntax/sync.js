var fs = require('fs');

// readFileSync

// console.log('A');
// var result = fs.readFileSync('syntax/sample.txt', 'utf8');
// console.log(result);
// console.log('C');


console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', (err, result) => {
    console.log(result);
});
/**
 * 함수를 세번째 인자로 주어서, 파일을 다 읽으면 세번째 인자로 준 함수를 실행시키면서
 * 첫번째 인자에는 error를 인자로 제공하고 두번째 파라미터에는 파일의 내용을 인자로써 제공한다.
*/
console.log('C');

// 파일을 읽어오는 동안 다음 코드를 수행한다. 이것이 비동기이다. 