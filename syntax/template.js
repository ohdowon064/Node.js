var name = 'k8895';
var letter = 'Dear' + name + '\n\n\alskdfjlkasjdflkasjdflkasdjflka' + name + 'alsdfjlkasdjflkasd' + name;

console.log(letter);

// literal = 정보를 표현하는 기호, 방법
// 그레이브 액센트 `

var letter2 = `Dear ${name}

alskdfjlkasjdflkasjdflkasdjflka' + name + 'alsdfjlkasdjflkasd' ${name}`;

console.log(letter2);

// ``로 감싸고, ${}안에 변수나 값을 넣는다.