---
published: 2026-11-22
title: "notify v9 is out"
tags: [rust, notify, oss, english]
description: "Release announcement for notify (notify-rs) v9"
category: "release"
image: ""
draft: false
lang: "en"
---

I've released v9 of notify (notify-rs), a Rust library for monitoring filesystem changes.
The first v9 prerelease was back in January, so it's been a long ten months.

## What is notify?

Basically, it's a crate that detects changes to files and lets you know about them.
You might be familiar with inotify or FSEvents. notify wraps APIs like those so you can use them without worrying too much about which OS you're on.

As more software is written in Rust, notify has found its way into quite a few projects.
If you count projects that use a fork, the list includes Zed, Codex CLI, Rolldown (Vite), and rust-analyzer. It's nice to see.

## What's new in v9?

Here are the highlights of this release.

Performance was my main focus this time. The release also includes some bug fixes that involved breaking changes.
The benchmarks below come from individual PRs during v9 development. They compare local runs before and after each change, so take the numbers as a rough guide (though I do think the improvements should be noticeable).

For details, see the [migration guide](https://github.com/notify-rs/notify/blob/main/docs/UPGRADING_V8_TO_V9.md).

## Faster individual file watches on Windows

When you watch a single file on Windows, notify requests change notifications for the file's parent directory.
In v8, registering `assets/a.png` and `assets/b.png` separately meant opening `assets` twice, with a separate set of handles and a read buffer each time.
In v9, files registered with the same watcher share an OS watch if they have the same parent directory.

We got the following results on Windows.

| Total for 1,000 files               |   Before |    After |
| ----------------------------------- | -------: | -------: |
| Registration time                   |  42.8 ms |  24.3 ms |
| Removal time                        |  20.8 ms |   9.9 ms |
| Additional handles                  |    2,000 |        2 |
| Additional private committed memory | 17.4 MiB | 0.96 MiB |

The nice thing here is that we get rid of the overhead of keeping separate handles for each file.
Editors, for example, watch individual files this way, so I think they stand to benefit quite a bit.

## Registering and removing watches on large directory trees with inotify and kqueue

On Linux, when you watch a directory recursively with inotify, notify walks the tree and registers each directory with the kernel.
It used to look up file types again and recalculate paths to include in events. It now reuses both values from the walk.
For example, the time to set up a recursive watch on 10,000 directories dropped from roughly 173–230 ms to 55–59 ms.

The kqueue backend also used to scan all existing watches each time it registered a file or directory. We used a similar approach there.
In a release build, generating just the metadata for one root and its 100,000 entries took 10.5 seconds before the change and 30 ms after it.

When removing a watch (`unwatch` in notify), inotify and kqueue can now use an index to look up watches under the target path.
For example, if you're watching a whole project and `cargo clean` removes `target`, cleaning up those watches no longer involves checking the watches under `src` one by one.

## Streams and batch updates to watched paths

The API for adding and removing watches in a batch has changed from `paths_mut()` and `commit()` in v8 to `Watcher::update_paths` across all backends.
We added batch updates fairly quickly in v8. The API design wasn't ideal, so we cleaned it up when we revisited the implementation.

Here's an example.

```rust
use notify::{PathOp, UpdatePathsError, Watcher};

fn watch_project(watcher: &mut impl Watcher) -> Result<(), UpdatePathsError> {
    watcher.update_paths(vec![
        PathOp::watch_recursive("src"),
        PathOp::watch_recursive("assets"),
        PathOp::watch_non_recursive("Cargo.toml"),
    ])
}
```

The operations take effect in the order you list them.
If registering `assets` fails in this example, `src` is already registered and the watcher hasn't tried `Cargo.toml` yet.
The returned `UpdatePathsError` carries the failed `assets` operation in `origin` and the pending `Cargo.toml` operation in `remaining`, so you can decide where to resume.

Internally, backends such as inotify and FSEvents now batch the changes from a single `update_paths` call, however many independent roots you add.
FSEvents rebuilds its stream at most once for the whole batch, and inotify needs just one request to its watcher thread.

## Matching events to watched paths on Linux and Windows

In v8 on Linux and Windows, you could register `src` as a relative path and still get absolute paths in events.
In v9, event paths use the same format as the path you registered.
On Linux, for example, watching `src` gives you `src/lib.rs` in `Event.paths`, while watching `/repo/src` gives you `/repo/src/lib.rs`.
If your cache uses absolute paths as keys, make the path absolute before passing it to `watch`, for example with `std::env::current_dir()?.join("src")`.

We've also made events a little easier to work with.
If one watcher monitors several projects, you can now use `watch_with` and `WatchPathConfig::with_user_data` to attach a project ID (`u64`) when you register each watch.
You can read that ID from events and errors associated with the watch using `Event::user_data()` and `Error::user_data()`.
That makes it easy to tell which project an incoming event belongs to.

## File save events and the 0.8 debouncers

Alongside notify, we released version 0.8.0 of `notify-debouncer-mini` and `notify-debouncer-full`, which group events that arrive close together.
There are three highlights here.

We fixed a bug in the full debouncer that could cause it to report events out of order when Blender saved a backup.
Blender renames the original `scene.blend` to `scene.blend1`, then puts the new file at `scene.blend`.
The rename event for the old file could arrive last. When Bevy processed the events in that order, it would conclude that the new `scene.blend` had disappeared too.
In 0.8, the debouncer reports the rename before the create event that reuses the original path.

The full debouncer uses a file ID cache called `FileIdMap` to match renames. The cache now uses a hash map to look up IDs by path and a separate index to find child entries during removal.
The time for 100,000 ID lookups by absolute path went from 57.13 ms to 4.94 ms. That's a big improvement.

The mini debouncer's handler receives `DebouncedEventBatch::Events` for ordinary changes and `DebouncedEventBatch::Rescan` when the OS may have missed events.
Rescan notifications arrive without the usual debounce delay. If you cache file listings, for example, that's the signal to rescan all watched roots.

## Wrapping up

Thank you to everyone who's tested v9 in their own projects and opened issues or submitted PRs since the first RC in January!
The release is in much better shape thanks to you.

If you notice any unexpected behavior after upgrading to v9, please report it on the [notify issue tracker](https://github.com/notify-rs/notify/issues).

Finally, I'm the only person maintaining notify at the moment.
A star on the repository or support through Open Collective or GitHub Sponsors would mean a lot to me! 🙏

- [repository](https://github.com/notify-rs/notify)
- [Open Collective](https://opencollective.com/notify-rs)
- [GitHub Sponsors](https://github.com/sponsors/JohnTitor)
