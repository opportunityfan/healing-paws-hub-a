import {BrowserWindow, ipcMain} from "electron";

const InitIpcMain = (win : BrowserWindow) => {
    ipcMain.on('window-close', () => {
        win.close();
    })
    ipcMain.on('window-minimize', () => {
        win.minimize();
    })
}

export default InitIpcMain
