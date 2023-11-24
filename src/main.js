import { createApp } from "petite-vue"
import { MODULE_NAME, TEMPLATE_PATH } from "./constants.js";
import "./avbar.css"


function createAppData() {
    const userId = game.userId;
    const settings = game.webrtc.settings
    return {
        canUserBroadcastVideo: game.webrtc.canUserBroadcastVideo(userId),
        canUserBroadcastAudio: game.webrtc.canUserBroadcastAudio(userId),
        canUserShareVideo: game.webrtc.canUserShareVideo(userId),
        canUserShareAudio: game.webrtc.canUserShareAudio(userId),
        canDisconnect: game.webrtc.client?._liveKitClient != null,
        isConnected: true,
        mounted() {
            Hooks.on('rtcSettingsChanged', () => {
                this.refreshContext();
            })
            Hooks.on('updateUser', () => {
                this.refreshContext();
            })
            Hooks.on('userConnected', () => {
                this.refreshContext();
            })
        },
        get userSettings() {
            const userSettings = settings.getUser(userId);
            return userSettings;
        },
        get canEnableAudio() {
            return this.userSettings.muted && !this.userSettings.canBroadcastAudio
        },
        get canEnableVideo() {
            return this.userSettings.hidden && !this.userSettings.canBroadcastVideo
        },
        refreshContext() {
            this.canUserBroadcastVideo = game.webrtc.canUserBroadcastVideo(userId);
            this.canUserBroadcastAudio = game.webrtc.canUserBroadcastAudio(userId);
            this.canUserShareVideo = game.webrtc.canUserShareVideo(userId);
            this.canUserShareAudio = game.webrtc.canUserShareAudio(userId);
            this.isConnected = game.webrtc.client?._liveKitClient?.connectionState ? game.webrtc.client?._liveKitClient?.connectionState === 'connected' : true;
        },
        refreshView() {
            ui.webrtc._refreshView(userId);
            this.refreshContext();
        },
        async toggleAudio() {
            if (this.canEnableAudio) {
                return ui.notifications.warn("WEBRTC.WarningCannotEnableAudio", { localize: true });
            }
            await settings.set("client", `users.${userId}.muted`, !this.userSettings.muted);
            this.refreshView();
        },
        async toggleVideo() {
            if (this.canEnableVideo) {
                return ui.notifications.warn("WEBRTC.WarningCannotEnableVideo", { localize: true });
            }
            await settings.set("client", `users.${userId}.hidden`, !this.userSettings.hidden);
            this.refreshView();
        },
        async disconnect() {
            await game.webrtc.client.disconnect();
            this.refreshContext();
            ui.webrtc.render();
        },
        async connect() {
            await game.webrtc.client.connect();
            this.refreshContext();
            ui.webrtc.render();
        }
    }
}

Hooks.on('ready', async () => {
    const uiBottom = $('#ui-bottom')
    if ((game.webrtc.mode === AVSettings.AV_MODES.DISABLED) || !uiBottom.length) {
        return
    };
    const content = await renderTemplate(`${TEMPLATE_PATH}/avbar.html`, {})
    uiBottom.append(content)
    createApp(createAppData()).mount("#avbar-control")
});
