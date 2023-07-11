# Spicetify Queue Panel

Open the queue in your right side panel in your Spotify client.

![preview](/assets/preview.gif)

Interact with the queue by dragging and dropping, adding to queue, like songs just like you would in the queue.

You can always visit the original Spotify queue page by clicking on the panel header.

![route](/assets/route.gif)

Access by clicking on the queue icon in the player like you normally would.

## Install

Copy `queuePanel.js` into your [Spicetify](https://github.com/spicetify/spicetify-cli) extensions directory:
| **Platform** | **Path** |
|------------|------------------------------------------------------------------------------------------|
| **Linux** | `~/.config/spicetify/Extensions` or `$XDG_CONFIG_HOME/.config/spicetify/Extensions/` |
| **MacOS** | `~/.config/spicetify/Extensions` or `$SPICETIFY_CONFIG/Extensions` |
| **Windows** | `%appdata%/spicetify/Extensions/` |

After putting the extension file into the correct folder, run the following command to install the extension:

```
spicetify config extensions queuePanel.js
spicetify apply
```

Note: Using the `config` command to add the extension will always append the file name to the existing extensions list. It does not replace the whole key's value.

Or you can manually edit your `config-xpui.ini` file. Add your desired extension filenames in the extensions key, separated them by the | character.
Example:

```ini
[AdditionalOptions]
...
extensions = autoSkipExplicit.js|shuffle+.js|trashbin.js|queuePanel.js
```

Then run:

```sh
spicetify apply
```
