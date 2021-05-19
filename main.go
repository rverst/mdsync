package main

import (
	"fmt"
	"github.com/fsnotify/fsnotify"
	"github.com/gorilla/websocket"
	"github.com/integrii/flaggy"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
  "path"
  "path/filepath"
	"runtime"
	"strings"
	"sync"
	"time"
)

//go:generate go run embedded/generate.go
//go:generate go fmt embedded.go

const envStyle = "MDSYNC_STYLE"
const envScript = "MDSYNC_SCRIPT"

type Payload struct {
	Message string `json:"message"`
}

type Connections struct {
	cs map[string]*websocket.Conn
	sync.RWMutex
}

type Content struct {
	AppVersion   string
	Title        string
	Raw          bool
	Content      template.HTML
	CustomCss    string
	CustomScript string
}

var (
	version   = "dev"
  commit    = "none"
  date      = "unknown"
  builtBy   = "unknown"
	port      = uint16(5000)
	noBrowser = false
	raw       = false

	mdFile        string
	cssFile       string
	jsFile        string
	wsConnections Connections
	upg           = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func init() {

	var path, style, script string

	flaggy.SetName("mdsync")
	flaggy.SetDescription("A simple markdown renderer with live reload.")
	flaggy.DefaultParser.AdditionalHelpPrepend = "Extended help can be found on github: https://github.com/rverst/mdsync"
	flaggy.SetVersion(version)

	flaggy.AddPositionalValue(&path, "path", 1, false, "The markdown file to render.")
	flaggy.String(&style, "c", "css", "A custom css path to style the output.")
	flaggy.String(&script, "s", "script", "A custom script path to manipulate the output.")
	flaggy.UInt16(&port, "p", "port", "The port to server.")
	flaggy.Bool(&noBrowser, "", "no-browser", "Prevents the browser from being opened.")
	flaggy.Bool(&raw, "", "raw", "No embedded scripts and styles, custom files will work though.")

	flaggy.Parse()
	if path == "" {
		path = "."
	}
	if style == "" {
		style = os.Getenv(envStyle)
	}
	if script == "" {
		script = os.Getenv(envScript)
	}

	var err error
	mdFile, err = loadFile(path)
	if err != nil {
		log.Fatal(err)
	}

	cssFile = loadAsset(style)
	jsFile = loadAsset(script)
}

func main() {

	go watchFileSystem()
	url := fmt.Sprintf("http://localhost:%d", port)
	fmt.Printf("serving '%s' at: %s\n", path.Base(mdFile),  url)
	http.HandleFunc("/css/", handleAssetRequest)
	http.HandleFunc("/font/", handleAssetRequest)
	http.HandleFunc("/script/", handleAssetRequest)
	http.HandleFunc("/image/", handleAssetRequest)
	http.HandleFunc("/", handleRequest)
	if !noBrowser {
		openBrowser(url)
	}
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		log.Fatal(err)
	}
}

func loadFile(path string) (string, error) {
	f, err := os.Stat(path)
	if os.IsNotExist(err) {
		return "", fmt.Errorf("cannot find the path specified: %s", path)
	}

	if f.IsDir() {
		// look for the first markdown file in the directory
		files, err := ioutil.ReadDir(path)
		if err != nil {
			return "", err
		}

		for _, x := range files {
			ext := strings.ToLower(filepath.Ext(x.Name()))
			if ext == ".md" || ext == ".markdown" {
				fn, err := filepath.Abs(x.Name())
				if err != nil {
					return "", err
				}
				return fn, nil
			}
		}

	} else {
		fn, err := filepath.Abs(path)
		if err != nil {
			return "", err
		}
		return fn, nil
	}
	return "", nil
}

func loadAsset(path string) string {
  if path == "" {
    return ""
  }

	f, err := os.Stat(path)
	if os.IsNotExist(err) || f.IsDir() {
	  fmt.Printf("file not found: %s\n", path)
		return ""
	}
	fn, err := filepath.Abs(path)
	if err != nil {
		return ""
	}
	return fn
}

func openBrowser(url string) {
	var err error
	switch runtime.GOOS {
	case "darwin":
		err = exec.Command("open", url).Start()
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	default:
		err = fmt.Errorf("platform not supported")
	}
	if err != nil {
		fmt.Printf("error open browser: %v\n", err)
	}
}

func watchFileSystem() {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		fmt.Printf("error: %v\n", err)
		return
	}
	defer watcher.Close()

	lastEvent := time.Now()

	done := make(chan bool)
	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				_, f := filepath.Split(event.Name)
				if time.Since(lastEvent).Nanoseconds() > (50*time.Millisecond).Nanoseconds() &&
					!strings.HasPrefix(f, ".") && !strings.HasSuffix(f, "~") {
					lastEvent = time.Now()
					fmt.Printf("[%s] reloading after: %s | %s\n", lastEvent.Format("15:04:05.000"), strings.ToLower(event.Op.String()), f)
					wsConnections.Lock()
					for c := range wsConnections.cs {
						_ = wsConnections.cs[c].WriteJSON(Payload{Message: "reload"})
					}
					wsConnections.Unlock()
				}

			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				fmt.Printf("error: %v\n", err)
			}
		}
	}()

	err = watcher.Add(mdFile)
	if err != nil {
		fmt.Printf("error adding watcher: %v", err)
	}
	if cssFile != "" {
		err := watcher.Add(cssFile)
		if err != nil {
			fmt.Printf("error adding watcher: %v", err)
		}
	}
	if jsFile != "" {
		err := watcher.Add(jsFile)
		if err != nil {
			fmt.Printf("error adding watcher: %v", err)
		}
	}
	<-done
}
