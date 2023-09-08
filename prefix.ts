import { ExpandRecursively } from "./expand";

export type PrefixString<
    Prefix extends string,
    Value extends string
> = `${Prefix}${Value}`;

export type UnprefixString<
    Prefix extends string,
    PrefixedValue extends string
> = PrefixedValue extends `${Prefix}${infer Value}` ? Value : never;

type MapKeyToPrefixedKey<
    T extends object,
    Prefix extends string
> = { [P in Exclude<keyof T,symbol | number>]: PrefixString<Prefix,P> }

type MapPrefixKeyToKey<
    T extends object,
    Prefix extends string
> = { [P in MapKeyToPrefixedKey<T,Prefix>[keyof MapKeyToPrefixedKey<T,Prefix>]]: UnprefixString<Prefix,P> }

type PrefixObjectHelper<
    T extends object,
    Prefix extends string,
    M extends MapPrefixKeyToKey<T,Prefix>
> = { [P in keyof M]: T[M[P]] }

export type PrefixObject<
    T extends object,
    Prefix extends string,
> = ExpandRecursively<PrefixObjectHelper<T,Prefix,MapPrefixKeyToKey<T,Prefix>>>

export function prefixObject<
    T extends object,
    Prefix extends string,
>(obj: T, prefix: Prefix): 
    PrefixObject<T,Prefix>
{
    const result: any = {};
    for (const key in obj){
        result[`${prefix}${key}`] = obj[key];
    }
    return result;
}
