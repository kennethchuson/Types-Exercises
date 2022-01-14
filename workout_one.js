var solve1 = function (arr) {
    var store_number = [];
    var store_string = [];
    var sum = 0;
    arr.map(function (x) {
        if (typeof (x) === "number") {
            sum += x;
            store_number.push(sum);
        }
        if (typeof (x) === "string") {
            if (x.indexOf("ing") !== -1) {
                store_string.push(x);
            }
        }
    });
    return [store_number, store_string];
};
var arr1 = ["test", 1, 2, "testing2", undefined, 3];
var output1 = solve1(arr1);
console.log(output1);
