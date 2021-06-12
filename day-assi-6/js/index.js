let arr = [1, 2, 3, 4, 5, 6];

console.log(arr);

var arr1 = arr.map(function multi(num) {
  return num * 10;
});
console.log("After using map");
console.log(arr1);

let v=5;
console.log("After filter it printing value greater then 3 ");
var arr2= arr.filter(function fil(num){
    if(3<num)
        return num;
});
console.log(arr2);

console.log("After using find ");

function check(a){
  return a ===5;
}

console.log(arr.find(check));

let element =5;
const index= arr.findIndex(arr=>arr===element);
console.log(index);

