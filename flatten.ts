import { PrefixObject } from "./prefix";
import { UnionToIntersection } from "./util";

type ObjectValues<
    E extends object
> = E extends { [s: string]: infer T } ? T : never

function isObject(value: any){
    return typeof value == "object" && !(value instanceof Array);
}

function canFlatten<T extends object>(obj: T): CanFlatten<T> {
    return !!Object.values(obj).find(e=>isObject(e)) as any;
}

export function flattenObject<
    T extends object,
>(obj: T): FlattenObject<T> {
    const newObj: any = {};

    for (let key in obj){
        const value = obj[key];
        if (isObject(value)){
            for (let innerKey in value){
                newObj[`${key}_${innerKey}`] = value[innerKey];
            }
        } else {
            newObj[key] = value;
        }
    }

    return newObj;
}

export type FlattenObject<T extends object> = (UnionToIntersection<
    ObjectValues<
        { [P in Exclude<keyof T,symbol | number>]: T[P] extends object ? PrefixObject<T[P],`${P}_`> : { [Prop in P]: T[P] } }
    >
>)

const hasObjects = Symbol("has objects");
type CanFlatten<T extends object> = 
    ({
        [P in Exclude<keyof T,symbol | number>]:
            T[P] extends object
                ? typeof hasObjects
                : never
    }) [Exclude<keyof T,symbol | number>] extends never ? false : true;

export type FlattenObjectDeep<T extends object> =
    CanFlatten<FlattenObject<T> & object> extends true
        ? FlattenObjectDeep<FlattenObject<T> & object>
        : FlattenObject<T>

export function flattenObjectDeep<
    T extends object,
>(obj: T): FlattenObjectDeep<T> {
    let newObj: any = {...obj};

    while (canFlatten(newObj)){
        newObj = flattenObject(newObj);
    }

    return newObj;
}