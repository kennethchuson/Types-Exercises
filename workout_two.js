var infoPerson = /** @class */ (function () {
    function infoPerson(name, age) {
        this.area = function (width, height) { return (width * height); };
        this.stack_users = [];
        this.stack_users_size = 0;
        this.name = name;
        this.age = age;
        this.stack_users.push(name);
        this.id = this.stack_users.push(name);
    }
    infoPerson.prototype.getId = function () {
        console.log("your id is ", this.id);
    };
    infoPerson.prototype.getName = function () {
        console.log("your name is ", this.name);
    };
    infoPerson.prototype.getAge = function () {
        console.log("your age is ", this.age);
    };
    infoPerson.prototype.getWeight = function () {
        console.log("your weight is ", this.area);
    };
    return infoPerson;
}());
var user = {
    name: "hes980jes",
    age: 10
};
var class_Person = new infoPerson(user.name, user.age);
class_Person.getId();
class_Person.getName();
class_Person.getAge();
class_Person.getWeight();
