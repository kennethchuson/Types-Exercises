
const solve1 = (arr: (number | string | undefined)[]): (number | string)[][] => {
    let store_number: number[] = [] 
    let store_string: string[] = [] 

    let sum: number = 0 

    arr.map((x) => {
        if (typeof(x) === "number") {
            sum += x
            store_number.push(sum) 
        }
        if (typeof(x) === "string") {
            if (x.indexOf("ing") !== -1) {
                store_string.push(x) 
            }
        }
    })
    return [store_number, store_string]

}

let arr1: (number | string | undefined)[] = ["test", 1, 2, "testing2", undefined, 3]

let output1: (number | string)[][] = solve1(arr1) 
console.log(output1) 

