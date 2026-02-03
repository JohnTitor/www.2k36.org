---
published: 2025-10-03
title: "Migration to Void Linux Memo 2025"
tags: [diary, english]
description: "A memo of my migration to Void Linux in 2025"
category: "diary"
image: ""
draft: false
lang: "en"
---

> [!WARNING]
> This article is translated by AI and may contain a serious mistake.

I took the plunge and migrated from Windows to Void Linux.

The setup basically follows the guides available online, but as of the time of writing, some parts don't work as-is, so I'm recording what I did for future reference.

## Environment

My environment is roughly as follows:

- CPU: AMD
- GPU: Nvidia
- OS: Void Linux
- DE: KDE Plasma 6
- Graphics Platform: Wayland

As of the time of writing, Wayland and Nvidia GPUs don't play well together, or so it seems—carelessly installing it causes graphics to break after login, which was a struggle.

## Setting up the Desktop Environment

Starting from the state after running `void-installer`.

I referenced the following:

https://gist.github.com/inscapist/83fd43b49c17e46059eb4fe0c1ae8bea

https://github.com/asifakonjee/Void-Linux-KDE

Add optional repos:

```bash
sudo xbps-install void-repo-nonfree void-repo-multilib void-repo-multilib-nonfree
sudo xbps-install -Su
```

Add necessary packages (adjust as needed):

```bash
sudo xbps-install kde-prisma kde-baseapps xorg-minimal xorg-server-devel xrdb xbacklight nvidia xdg-user-dirs xdg-utils xtools micro NetworkManager git vim kate preload rsync
```

I have no particular ideology, so I want to install proprietary drivers, but just installing the `nvidia` package isn't enough—some additional configuration is needed.

```bash
sudo vim /etc/default/grub
```

Add `nvidia-drm.modeset=1` to `GRUB_CMDLINE_LINUX_DEFAULT`. After editing, update GRUB:

```bash
sudo update-grub
```

Next, add the following to `/etc/dracut.conf.d/nvidia.conf`:

```bash
add_drivers+=" nvidia nvidia_modeset nvidia_uvm nvidia_drm "
```

Regenerate initramfs:

```bash
sudo dracut -f
```

Enable SDDM and D-Bus services:

```bash
sudo ln -s /etc/sv/dbus /var/service/
sudo ln -s /etc/sv/sddm /var/service/
```

After rebooting, you should be able to use KDE + Wayland.

```bash
sudo reboot
```

The Nvidia setup worked without special configuration on X11, but it's 2025—using X11 instead of Wayland felt wrong, so I went through a lot of trial and error.

## Audio Issues

For audio, use PipeWire instead of PulseAudio.

PipeWire was already installed when I set up the environment above, but if it's not there, install it as needed:

```bash
sudo xbps-install pipewire wireplumber
```

The following documentation has detailed information on the subsequent setup.

https://docs.voidlinux.org/config/media/pipewire.html

Set up the session manager and configuration for PipeWire-incompatible applications:

```bash
mkdir -p /etc/pipewire/pipewire.conf.d
ln -s /usr/share/examples/wireplumber/10-wireplumber.conf /etc/pipewire/pipewire.conf.d/
mkdir -p /etc/pipewire/pipewire.conf.d
ln -s /usr/share/examples/pipewire/20-pipewire-pulse.conf /etc/pipewire/pipewire.conf.d/
```

Register PipeWire applications as autostart applications on the KDE side, and you're done.

## Japanese Environment

Set up fonts and Japanese input environment.

Choose fonts as you like. Here, I went with the safe choice of Noto fonts.

```bash
sudo xbps-install noto-fonts-cjk noto-fonts-emoji
```

For Japanese input, you'll likely use fcitx or ibus with mozc, but in my environment, fcitx wouldn't properly load the input method no matter how much I fiddled with it, so I used ibus.

```bash
sudo xbps-install -S ibus ibus-mozc
```

Set up the usual stuff:

```bash
cat > ~/.config/plasma-workspace/env/ibus.sh << 'EOF'
#!/bin/sh
export GTK_IM_MODULE=ibus
export QT_IM_MODULE=ibus
export XMODIFIERS=@im=ibus
EOF

chmod +x ~/.config/plasma-workspace/env/ibus.sh
```

Also address the Chinese font issue (`etc/fonts/local.conf`):

```xml
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
    <alias>
        <family>serif</family>
        <prefer>
            <family>Noto Serif CJK JP</family>
        </prefer>
    </alias>
    <alias>
        <family>sans-serif</family>
        <prefer>
            <family>Noto Sans CJK JP</family>
        </prefer>
    </alias>
    <alias>
        <family>monospace</family>
        <prefer>
            <family>Noto Sans Mono CJK JP</family>
        </prefer>
    </alias>
</fontconfig>
```

## Done

Now just use it however you like.

This time I went with Void Linux based on DistroWatch's ranking, but if I get bored, I'd like to try Garuda or Endeavour.

I haven't fully set up my development environment yet, so I'll write more if anything comes up.
