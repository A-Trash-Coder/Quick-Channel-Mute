const { Plugin } = require('powercord/entities');
const { Icon } = require('powercord/components')
const { getModule, getModuleByDisplayName, React } = require('powercord/webpack')
const { inject, uninject } = require('powercord/injector')

module.exports = class QuickMute extends Plugin {
    async startPlugin() {
        const classes = await getModule(['iconItem'])
        const Tooltip = await getModuleByDisplayName('Tooltip')
        const ChannelItem = await getModule(m => m.default && m.default.displayName == 'ChannelItem')
        const mod = getModule(['updateChannelOverrideSettings'], false)

        inject('quick-mute-at-channel', ChannelItem, 'default', args => {
            args[0].children.unshift(React.createElement(
                'div', { className: classes.iconItem }, React.createElement(
                    Tooltip, { text: args[0]['muted'] ? 'Quick Un-Mute Channel' : 'Quick Mute Channel' }, props => React.createElement(Icon, {
                        ...props,
                        name: 'Close',
                        className: classes.actionIcon,
                        width: 16,
                        height: 16,
                        onClick: () => {
                            if (!args[0]['muted']) {
                                mod.updateChannelOverrideSettings(args[0]['channel']['guild_id'], args[0]['channel']['id'], this.getMuteConfig(10000, 0, true))
                            } else {
                                mod.updateChannelOverrideSettings(args[0]['channel']['guild_id'], args[0]['channel']['id'], this.getMuteConfig(0, 0, false))
                            }
                        }
                    })
                )
            ))
            return args
        }, true)
        ChannelItem.default.displayName = 'ChannelItem'
    }

    getMuteConfig(h, m, muted) {
        const s = h * 3600 + m * 60
        return {
            muted: muted, mute_config: {
                end_time: new Date(Date.now() + s * 1000).toISOString(), selected_time_window: s
            }
        }
    }

    pluginWillUnload() {
        uninject('quick-mute-at-channel')
    }
}