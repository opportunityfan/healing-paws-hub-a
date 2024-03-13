import router from "@/router";
import store from "@/store"

export const changeTheme = (theme : string) => {
    window.document.documentElement.setAttribute("data-theme", theme);
}

export const goto = async (path : string) => {
    await router.push(path);
}

export const signIn = () => {
    store.state.sidebar_unlock = true
    goto('/main').then()
}

export const signOut = () => {
    store.state.sidebar_unlock = false
    goto('/login').then()
}
