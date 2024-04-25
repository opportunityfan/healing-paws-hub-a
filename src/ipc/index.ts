import {BrowserWindow, ipcMain} from "electron";

const InitIpcMain = (win : BrowserWindow) => {
    ipcMain.on('window-close', () => {
        win.close();
    })
    ipcMain.on('window-minimize', () => {
        win.minimize();
    })
    ipcMain.on('window-max',function () {
        if(win.isMaximized()){ // 为true表示窗口已最大化
            win.restore();// 将窗口恢复为之前的状态.
        }else{
            win.maximize();
        }
    })
}

export default InitIpcMain
