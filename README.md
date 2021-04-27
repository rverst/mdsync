# mdsync

This tool is a simple markdown renderer with live reload. As default
github-flavoured markdown including code highlighting is rendered. Page breaks
(`<hr>`) are inserted by css to produce nicer print results (print page as PDF).

CSS and scripts for styling and code-highlighting can be extended or replaced by
your own. The inspiration for this project comes from
[browsersync](https://github.com/schollz/browsersync).

## Installation

```shell
> go get -u github.com/rverst/mdsync
```

## Usage

```shell
> mdsync examlpe.md
```
This opens the default browser on `http://localhost:5000` to display the rendered output.

```text
  Usage:
    markdown sync [path]

  Positional Variables:
    path   The markdown file to render

  Flags:
       --version      Displays the program version string.
    -h --help         Displays this help.
    -c --css          A custom css path to style the output.
    -s --script       A custom script path to manipulate the output.
    -p --port         The port to server (default: 5000).
       --no-browser   Prevents the browser from being opened.
       --raw          No embedded scripts and styles, custom files will
                      work though.
```

With no arguments provided, the first markdown file in the current directory will be loaded.

With the switches `--css` and `--script` own styles or scripts can be loaded. These will then replace
the embedded [style.css](embedded/css/custom.css) or [custom.js](embedded/scripts/custom.js).
With the switch -raw this css can also be switched off.

## Embedded styles/scripts
