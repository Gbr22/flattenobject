import { FlattenObjectRecursive, flattenObject, flattenObjectRecursive } from "./index"

type A = FlattenObjectRecursive<{
    alma: 1,
    korte: 1,
    data: {
        alma: 2,
        korte: 2,
        inner: {
            alma: 3,
            korte: 3
        }
    }
}>

const a = flattenObject({
    alma: 1,
    korte: 1,
    data: {
        alma: 2,
        korte: 2,
        inner: {
            alma: 3,
            korte: 3
        }
    }
})

const c = flattenObjectRecursive({
    alma: 1,
    korte: 1,
    data: {
        alma: 2,
        korte: 2,
        inner: {
            alma: 3,
            korte: 3
        }
    }
})

console.log(c);