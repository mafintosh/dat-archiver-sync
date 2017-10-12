# dat-archiver-sync

Sync all dats stored by a hypercore-archiver instance as normal Dats.

```
npm install -g dat-archiver-sync
```

## Usage

First run a hypercored instance on a server somewhere

``` sh
hypercored
```

This will print out the archiver key. Now add a couple of dats
to the hypercored `./feeds` file and have them sync.

Copy the archiver key and run `dat-archiver-sync` with that key.

``` sh
dat-archiver-sync <key-from-above>
```

## License

MIT
