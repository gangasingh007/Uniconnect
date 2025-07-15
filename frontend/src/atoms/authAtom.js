import { atom, selector } from 'recoil';

export const authAtom = atom({
    key: 'authAtom',
    default: {
        token: null,
        user : null,
    }
})

export const authSelector = selector({
    key: 'authSelector',
    get: ({get}) => {
        const auth = get(authAtom);
        return localStorage.getItem('token') ? auth : null;
    }
})