import { create } from 'zustand';

export const passwordStore = create((set, get) => ({
    password: '',
    form: {
        passwordLen: 15,
        isLowercase: true,
        isUppercase: true,
        isNumbers: false,
        isSymbols: false,
    },
    strength: null,
    alert: {
        message: '',
        open: false,
        type: '',
    },
    changeFieldForm: (name, value) => set(state => {
        return {
            form: {
                ...state.form,
                [name]: value
            }
        }
    }),
    setAlert: (alert) => set({ alert }),
    setPassword: (password) => set({ password }),
    setStrength: (strength) => set({ strength }),
}))