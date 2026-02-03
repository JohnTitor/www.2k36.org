---
published: 2025-10-03
title: "Void Linuxに移住したときの備忘録 2025"
tags: [diary, japanese]
description: "Void Linuxに移住したときの備忘録 2025"
category: "diary"
image: ""
draft: false
lang: "ja"
---

一念発起してWindowsからVoid Linuxに移住した。

セットアップは基本世に残されているガイド通りなのだが、執筆時点だとそのままではうまくいかない部分もあったので後で見返せるようやったことを記録として残しておく。

## 環境

環境は大体以下の通り：

- CPU: AMD
- GPU: Nvidia
- OS: Void Linux
- DE: KDE Plasma 6
- Graphics Platform: Wayland

執筆時点だとWaylandとNvidia GPUの相性が悪いのか、雑に入れるとlogin以降グラフィックが壊れるので苦戦した。

## デスクトップ環境構築まで

`void-installer` 実行後の状態から始める。

以下を参考にした：

https://gist.github.com/inscapist/83fd43b49c17e46059eb4fe0c1ae8bea

https://github.com/asifakonjee/Void-Linux-KDE

optionalになっているreposを追加：

```bash
sudo xbps-install void-repo-nonfree void-repo-multilib void-repo-multilib-nonfree
sudo xbps-install -Su
```

必要なパッケージを追加（必要に応じて適宜調整すること）：

```bash
sudo xbps-install kde-prisma kde-baseapps xorg-minimal xorg-server-devel xrdb xbacklight nvidia xdg-user-dirs xdg-utils xtools micro NetworkManager git vim kate preload rsync
```

特に思想もないのでプロプライエタリドライバーを入れたいのだが、 `nvidia` パッケージを入れるだけだとダメで、いくつか追加設定が必要。

```bash
sudo vim /etc/default/grub
```

`GRUB_CMDLINE_LINUX_DEFAULT` に `nvidia-drm.modeset=1` を追加する。追記後、GRUBを更新：

```bash
sudo update-grub
```

次に `/etc/dracut.conf.d/nvidia.conf` に以下を追記：

```bash
add_drivers+=" nvidia nvidia_modeset nvidia_uvm nvidia_drm "
```

initramfsを再生成：

```bash
sudo dracut -f
```

SDDMとD-Busを常駐させる：

```bash
sudo ln -s /etc/sv/dbus /var/service/
sudo ln -s /etc/sv/sddm /var/service/
```

再起動してあげればKDE + Waylandを使えるようになっているはず。

```bash
sudo reboot
```

NvidiaまわりはX11だと特に設定せず使えたのだが、さすがに2025年にWaylandを使わないのはアレなので色々試行錯誤した。

## 音声問題

音声まわりはPulseAudioではなくPipeWireを使う。

上記環境構築を行った際すでにPipeWireはインストールされていたが、ない場合は適宜インストールする：

```bash
sudo xbps-install pipewire wireplumber
```

以降の設定は以下のドキュメントに詳しい。

https://docs.voidlinux.org/config/media/pipewire.html

session managerとPipeWire非対応アプリケーションのための設定を入れる：

```bash
mkdir -p /etc/pipewire/pipewire.conf.d
ln -s /usr/share/examples/wireplumber/10-wireplumber.conf /etc/pipewire/pipewire.conf.d/
mkdir -p /etc/pipewire/pipewire.conf.d
ln -s /usr/share/examples/pipewire/20-pipewire-pulse.conf /etc/pipewire/pipewire.conf.d/
```

PipeWireアプリケーションをKDE側でautostart applicationとして登録すれば終わり。

## 日本語環境

フォントの導入と日本語入力環境のセットアップを行う。

フォントはお好みで。ここでは無難にNoto系を入れた。

```bash
sudo xbps-install noto-fonts-cjk noto-fonts-emoji
```

日本語入力環境はfcitx or ibusにmozcを添える形になると思うが、自分の環境ではfcitxをどうこねくり回してもinput methodがうまく読み込まれなかったのでibusを使った。

```bash
sudo xbps-install -S ibus ibus-mozc
```

おなじみのやつも設定：

```bash
cat > ~/.config/plasma-workspace/env/ibus.sh << 'EOF'
#!/bin/sh
export GTK_IM_MODULE=ibus
export QT_IM_MODULE=ibus
export XMODIFIERS=@im=ibus
EOF

chmod +x ~/.config/plasma-workspace/env/ibus.sh
```

中華フォントになっちゃう問題への対応も入れておく(`etc/fonts/local.conf`)：

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

## 完成

あとは好きなように使うだけ。

今回はDistroWatchの評価基準でVoid Linuxにしてみたが、飽きたらGarudaとかEndeavourとか試してみたい。

まだ完全に開発環境を整えられていないので、何かあったらまた書こうと思う。
