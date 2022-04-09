package main

import (
	"fmt"
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

	close         chan bool
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

	close = make(chan bool)
	defer func() {
		close <- true
	}()
	go watchFile()
	url := fmt.Sprintf("http://localhost:%d", port)
	fmt.Printf("serving '%s' at: %s\n", path.Base(mdFile), url)
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

func watchFile() {
	t := time.NewTicker(time.Millisecond * 100)
	ec := 0

	type lastChange struct {
		file string
		lc   time.Time
	}

	lastChanges := make([]lastChange, 1)
	lastChanges[0] = lastChange{file: mdFile}

	if cssFile != "" {
		lastChanges = append(lastChanges, lastChange{file: cssFile})
	}
	if jsFile != "" {
		lastChanges = append(lastChanges, lastChange{file: jsFile})
	}

	for i := range lastChanges {
		lc, err := getLastChange(lastChanges[i].file)
		if err != nil {
			log.Fatalf("watcher - cannot get last change for: %s - %v", lastChanges[i].file, err)
		}
		lastChanges[i].lc = lc
	}

	for {
		select {
		case <-t.C:
			reload := false
			for i := range lastChanges {
				file := lastChanges[i].file
				lc, err := getLastChange(file)
				if err != nil {
					ec++
					if ec > 15 {
						log.Fatalf("watcher - cannot get last change for: %s - %v", file, err)
					}
					log.Printf("watcher - cannot get last change (%d): %s - %v", ec, file, err)
					continue
				}
				if lc.After(lastChanges[i].lc) {
					lastChanges[i].lc = lc
					fmt.Printf("[%s] reloading: %s\n", lc.Format("15:04:05.000"), file)
					reload = true
				}
			}

			if reload {
				wsConnections.Lock()
				for i := range wsConnections.cs {
					err := wsConnections.cs[i].WriteJSON(Payload{Message: "reload"})
					if err != nil {
						log.Printf("error writing webSocket: %v", err)
					}
				}
				wsConnections.Unlock()
			}
		case <-close:
			return
		}
	}
}

func getLastChange(file string) (time.Time, error) {
	fi, err := os.Stat(file)
	if err != nil {
		return time.Time{}, err
	}
	return fi.ModTime(), nil
}
