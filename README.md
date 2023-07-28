<p align="center">
  <img width="400" height="400" src="https://raw.githubusercontent.com/therealnv6/catcord/main/.assets/kitty.png">
</p>

## CatCord

CatCord is a minimal and lightweight Discord client designed to support
platforms that are not natively supported by the official Discord client.

### Why CatCord?

The main motivation behind creating CatCord was to provide support for platforms
that are typically unsupported by Discord. One such platform is
[FreeBSD](https://www.freebsd.org/), which is not officially supported by
Discord.

Issues with the native Discord client on various platforms include:

- On [FreeBSD](https://www.freebsd.org/), the official client doesn't work
  natively.
- Discord under [Wayland](https://wayland.freedesktop.org/) does not support
  screensharing.
- Using [Electron](https://www.electronjs.org/) (while a versatile framework)
  consumes significant resources for a Discord client.

### Features

- **Themes:** CatCord provides two ways to setup and override themes: rules and
  CSS. Rules allow for individual updates to elements by tag, setting properties
  inline. CSS, on the other hand, appends the CSS file to the document as a
  child element.
- **GluonJS:** CatCord utilizes GluonJS to keep it simple, eliminating the need
  for Electron's memory usage and build times. Check out
  [Gluon's benchmarks](https://github.com/gluon-framework/gluon#benchmark--stats)
  for more information.

### Credits

#### Inspiration

- [ArmCord](https://github.com/ArmCord/ArmCord)
- [Legcord](https://github.com/ArmCord/Legcord)
- [Discord-BSD](https://github.com/z-ffqq/Discord-BSD)

#### Other

- [GluonJS](https://gluonjs.org/)
- [Discord](https://discord.com/)

## FAQ

### Is CatCord affiliated with Discord?

- No. CatCord is not affiliated with Discord in any way. Sadly, using clients
  such as CatCord is against Discord's
  [terms of service](https://discord.com/terms#software-in-discord%E2%80%99s-services).
  Nobody has been banned as of yet, but using CatCord is considered risky
  regardless.

### How?

- This is just a simple wrapper around the offical web app
  (https://discord.com/app). Is it lame? Yes. Is it easy? Perhaps. Has it been
  done before? Many times. But, does it work? Definitely.

---

For more details, usage instructions, and contribution guidelines, please refer
to the [CatCord repository](https://github.com/therealnv6/catcord).

Feel free to reach out if you have any questions or need further assistance!
