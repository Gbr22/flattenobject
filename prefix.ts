import { UnionToIntersection } from "./util";

export type PrefixString<
    Prefix extends string,
    Value extends string
> = `${Prefix}${Value}`;

export type UnprefixString<
    Prefix extends string,
    PrefixedValue extends string
> = PrefixedValue extends `${Prefix}${infer Value}` ? Value : never;

function _prefixObject<
    T extends object,
    Prefix extends string,
    MapKeyToPrefixedKey extends { [P in Exclude<keyof T,symbol | number>]: PrefixString<Prefix,P> },
    MapPrefiexKeyToKey extends { [P in MapKeyToPrefixedKey[keyof MapKeyToPrefixedKey]]: UnprefixString<Prefix,P> }
>(obj: T, prefix: Prefix): 
{ [P in keyof MapPrefiexKeyToKey]: T[MapPrefiexKeyToKey[P]] }
{
    const result: any = {};
    for (const key in obj){
        result[`${prefix}${key}`] = obj[key];
    }
    return result;
}

export function prefixObject<
    T extends object,
    Prefix extends string,
>(obj: T, prefix: Prefix) {
    return _prefixObject(obj,prefix);
}

export type PrefixObject<Obj extends object, Prefix extends string> = ReturnType<(typeof prefixObject<Obj,Prefix>)>

type ObjectValues<
    E extends object
> = E extends { [s: string]: infer T } ? T : never

export function flattenObject<
    T extends object,
>(obj: T): FlattenObject<T> {
    return undefined as any;
}

type FlattenObject<T extends object> = (UnionToIntersection<
    ObjectValues<
        { [P in Exclude<keyof T,symbol | number>]: T[P] extends object ? PrefixObject<T[P],`${P}_`> : { [Prop in P]: T[P] } }
    >
>)

const hasObjects = Symbol("has objects");
type HasObjectsAsValue<T extends object> = 
    ({
        [P in Exclude<keyof T,symbol | number>]:
            T[P] extends object
                ? typeof hasObjects
                : never
    }) [Exclude<keyof T,symbol | number>] extends never ? false : true;

type FlattenObjectRecursive<T extends object> =
    HasObjectsAsValue<FlattenObject<T> & object> extends true
        ? FlattenObjectRecursive<FlattenObject<T> & object>
        : FlattenObject<T>

export function flattenObjectRecursive<
    T extends object,
>(obj: T): FlattenObjectRecursive<T> {
    return undefined as any;
}

const b = prefixObject({
    alma: 1,
    data: {
        korte: 2
    }
},"alma_");

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