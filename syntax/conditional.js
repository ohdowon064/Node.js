var args = process.argv;
console.log(args);

if(args[2] === '1') { // cmd pramater는 문자열로 받는다.
    console.log('A');
}else {
    console.log('B');
}