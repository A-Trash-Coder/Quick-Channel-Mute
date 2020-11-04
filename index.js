const { Plugin } = require('powercord/entities');
const { Icon } = require('powercord/components')
const { getModule, getModuleByDisplayName, React, i18n: { Messages } } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')

module.exports = class QuickMute extends Plugin {
    async startPlugin() {
        const classes = await getModule(['iconItem'])
        const Tooltip = await getModuleByDisplayName('Tooltip')
        const ChannelItem = await getModule(m => m.default && m.default.displayName == 'ChannelItem')
        const mod = getModule(['updateChannelOverrideSettings'], false)

        inject('quick-mute-at-channel', ChannelItem, 'default', args => {
            if (args[0]['channel']['type'] == 2) { return args; };
            args[0].children.unshift(React.createElement(
                'div', { className: classes.iconItem }, React.createElement(
                    Tooltip, { text: args[0]['muted'] ? Messages["UNMUTE_CHANNEL_GENERIC"] : Messages["MUTE_CHANNEL_GENERIC"] }, props => React.createElement(Icon, {
                        ...props,
                        name: args[0]['muted'] ? 'BellOff' : 'Bell',
                        className: classes.actionIcon,
                        width: 16,
                        height: 16,
                        onClick: () => {
                            if (!args[0]['muted']) {
                                mod.updateChannelOverrideSettings(args[0]['channel']['guild_id'], args[0]['channel']['id'], { muted: true })
                            } else {
                                mod.updateChannelOverrideSettings(args[0]['channel']['guild_id'], args[0]['channel']['id'], { muted: false })
                            }
                        }
                    })
                )
            ))
            return args
        }, true)
        ChannelItem.default.displayName = 'ChannelItem'
    }

    pluginWillUnload() {
        uninject('quick-mute-at-channel')
    }
}