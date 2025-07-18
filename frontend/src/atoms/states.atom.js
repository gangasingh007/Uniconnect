import { atom } from "recoil";

export const loadingAtom = atom({
    key : "loadingAtom",
    default : false
})

export const errorAtom = atom({
    key : "errorAtom",
    default : false
})