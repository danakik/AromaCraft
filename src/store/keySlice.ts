import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface KeyState {
    key: string | null
}

const initialState: KeyState = {
    key: null,
}

const keySlice = createSlice({
    name: 'key',
    initialState,
    reducers: {
        setKey(state, action: PayloadAction<string>) {
            state.key = action.payload // Сохраняем ключ
        },
        clearKey(state) {
            state.key = null // Очищаем ключ
        },
    },
})

export const { setKey, clearKey } = keySlice.actions
export default keySlice.reducer
