var member = ['egoing', 'k8805', 'ohdowon'];
console.log(member[1]);
var i = 0;
while(i < member.length) {
    console.log('array loop ' + member[i]);
    i = i + 1;
}


var roles = { // key : value
    'programmer' : 'dowon',
    'desinger' : 'k8805',
    'manager' : 'hoya'
};


for(var name in roles) {
    console.log('object loop => ' + name, 'vlaue => ', roles[name]);
}