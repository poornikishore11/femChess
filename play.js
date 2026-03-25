let vehicle = {
  wheels: "4",
  fuelType: "Gasoline",
  color: "Green",
};
let carProps = {
  type: {
    value: "mini",
  },
  model: {
    value: "acemen",
  },
};
var obj = Object.create(vehicle, carProps);
//function contructor
function Person(name, age) {
  this.name = name;
  this.age = age;
}

let abby = new Person("abby", 30);

function Person(name) {
  this.name = name;
}
Person.prototype.sayHello = function () {
  console.log("Hello" + this.name); //construction function,
};

const p = new Person("Neo"); //object
//internally

p.__proto = Person.prototype;

//obj.assign

const org = { company: "xyz" };
const car = { name: "bff" };
const bh = Object.assign({}, org, car);
//singleton pattern
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    this.value = Math.random();
    Singleton.instance = this;
  }
}

const a = new Singleton();
const b = new Singleton();
/*
1.object literal
2.object constructor
3.object.create
4.function constructor
5function constructor with prototype
6.object.assign
7.es6 classes
8:singleton pattern
*/
//2. MyObject.__proto__ = CoonstructorFunction.prototype.__proto__ = Object.prototype__proto__ = null;
//used to control the context of the this value in which the function is executed
//The call() method invokes a function immediately, allowing you to specify the value of this and pass arguments individually.
var employee1 = { first: "John", last: "Doe" };
var employee2 = { first: "lilly", last: "Potter" };
function invite(greet1, greet2) {
  console.log(greet1 + this.first + this.last + greet2);
}

invite.call(employee1, "hello", "how are you?");
invite.call(employee2, "hello", "how are you?");

// same with apply but
invite.call(employee1, ["hello", "how are you?"]);
//the bind method creates a new function with a specific this, optionally preset initial arguments. Unlike call and apply , which is invoked immediately, bind returns a  function which we can call later
var inviteemployee = invite.bind(employee1);
inviteemployee("Hello", "how are you");
//javascript object notation
//slice does not mutate the original array but returns a new array
//Splice is used to add, remove and replace elements iin the array and modifies the original array in place and returns the new array
let arrayOriginal = [1, 2, 3, 4, 5];
let arrInt = arrayOriginal.splice[(3, 1, "a", "b", "c")];
arrInt = [4];
arrayOriginal = [1, 2, 3, "a", "b", "c", 5];
/*
key types,key order,size,iteration,prototype, performance, serialization
 */
//null or undefined are not strictly equal
//arrow functions do not have their own this, arguments, super or new.target. they inherit from the surrounding(lexical) context
/*
functions are treated like any other variable
1. you can assign a function to a variable
2.you can pass a function as an argument to another function
3.you can return a  function from another function
*/

const handler = () => console.log("This is click handler function");
document.addEventListener("click", handler);
//higher order function used for creaating modular reusable and expressive code
const FirstOrderFunc = () => {
  console.log("Hello iam a first order function");
};
const HigherOrder = (callback) => callback();
HigherOrder(FirstOrderFunc);
//unary function accepts exactly one argument
//currying is the process of transforming a function with multiple arguments into a sequence of nested functions, each accepting only one argument at a time
const curryUnaryFunction = (a) => (b) => (c) => a + b + c;

function add(a) {
  return function (b) {
    return a + b;
  };
}
add(2)(3);
//a pure function is a function whose output depends only on its input arguments and produces no side effects and does not modify any external state of data.
function userDetail(username) {
  if (username) {
    console.log(salary); //undefined
    console.log(age); //reference error
    let age = 12;
    var salary = 100;
  }
  console.log(salary); //100
  console.log(age); //error:age not defined
}
userDetail("john");
//iife is immediately invoked expression is a javascript function that runs as soon as it is defined
(function () {})();
// the main reason for using the iife is to obtain data privacy because any variables declared in the IIFe can not be accessed  by the outside world
//memoization is a functional programming technique which attempts tto increase a function's performance by caching its previously computed results

const memoizeAddition = () => {
  let cache = {};
  return (value) => {
    if (value in cache) {
      return cache[value];
    } else {
      console.log("caching results");
      let result = value + 20;
      cache[value] = result;
      return result;
    }
  };
};

//es6 classes
function Bike(model, color) {
  this.model = model;
  this.color = color;
}
Bike.prototype.getDetails = function () {
  console.log(this.model + this.color);
};

class Bike {
  constructor(color, model) {
    this.color = color;
    this.model = model;
  }
  getDetails() {
    console.log(this.model + this.color);
  }
}
//it is an inner function that has access to the outer or enclosing  function's variables,functions and other data even after the outer function has finished the execution
/*
it has access to the outer variables defined between its curly brackets
outer function variables,global variables
 */

function welocome(name) {
  var greeetingInfo = function (message) {
    console.log(message + name);
  };
  return greeetingInfo;
}

var myFunc = welocome("john");
myFunc("welcoeme");
