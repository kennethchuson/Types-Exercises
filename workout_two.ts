



interface user_interface  {
    readonly id: number 
    name: ((number & string) | string | undefined | null)
    age?: number 
}

interface calculate {
    (width: number, height: number): number
}


class infoPerson implements user_interface {

    readonly id: number 
    name: ((number & string) | string | undefined | null)
    age?: number 
    
    readonly area: calculate = (width: number, height: number): number => (width * height) 


    stack_users: ((number & string) | string | undefined | null)[] = [] 



    constructor(name: ((number & string) | string | undefined | null), age?: number) {

        this.name = name 
        this.age = age

        this.stack_users.push(name)
    
        this.id = this.stack_users.push(name) - 1



    }  

    getId(): void {
        console.log("your id is ", this.id) 
    }

    getName(): void {
        console.log("your name is ", this.name) 
    }

    getAge(): void {
        console.log("your age is ", this.age) 
    }

    getWeight(): void {
        console.log("your weight is ", this.area)
    }
}





interface calculate {
    (width: number, height: number): number
}



const user = {
    name: "idk",
    age: 10
}

const class_Person = new infoPerson(user.name, user.age)

class_Person.getId() 
class_Person.getName() 
class_Person.getAge() 
class_Person.getWeight() 

