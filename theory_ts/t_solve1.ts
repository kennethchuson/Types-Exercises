









const function_solve1 = (dataUser: userInterface[], addUser: userInterface) => {
    const adding_object = [
        {
            ...dataUser, 
            addUser
        }
    ]

    return adding_object
}    



interface tallInterface {
    width: number, 
    height: number
}


interface userInterface {
    id: number | null 
    name: string | undefined 
    age?: number
    tall: tallInterface
    score: number[] 
}


const User: userInterface = {
    id: 1, 
    name: "test", 
    age: 10, 
    tall: {
        width: 100, 
        height: 200 
    },
    score: [10, 40, 50, 60]

}


const User2: userInterface = {
    id: 2, 
    name: "test2", 
    age: 18, 
    tall: {
        width: 300, 
        height: 40
    },
    score: [4,3,4,2,4]

}

const User3: userInterface = {
    id: 3, 
    name: "test3", 
    age: 17, 
    tall: {
        width: 17, 
        height: 10
    },
    score: [4,9,17,3,2]

}

const dataUser: userInterface[] = [
    User, 
    User2, 
    User3
]


const addUser: userInterface = {
    id: 4, 
    name: "test4", 
    age: 17, 
    tall: {
        width: 90, 
        height: 89
    },
    score: [9,7,4,8,4]
}   

let output = function_solve1(dataUser, addUser) 

console.log(output) 
