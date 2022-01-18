var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var function_solve1 = function (dataUser, addUser) {
    var adding_object = [
        __assign(__assign({}, dataUser), { addUser: addUser })
    ];
    return adding_object;
};
var User = {
    id: 1,
    name: "test",
    age: 10,
    tall: {
        width: 100,
        height: 200
    },
    score: [10, 40, 50, 60]
};
var User2 = {
    id: 2,
    name: "test2",
    age: 18,
    tall: {
        width: 300,
        height: 40
    },
    score: [4, 3, 4, 2, 4]
};
var User3 = {
    id: 3,
    name: "test3",
    age: 17,
    tall: {
        width: 17,
        height: 10
    },
    score: [4, 9, 17, 3, 2]
};
var dataUser = [
    User,
    User2,
    User3
];
var addUser = {
    id: 4,
    name: "test4",
    age: 17,
    tall: {
        width: 90,
        height: 89
    },
    score: [9, 7, 4, 8, 4]
};
var output = function_solve1(dataUser, addUser);
console.log(output);
