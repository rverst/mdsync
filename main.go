package main

import (
	b64 "encoding/base64"
	"fmt"
	"github.com/fsnotify/fsnotify"
	"github.com/gorilla/websocket"
	"github.com/integrii/flaggy"
	"github.com/shurcooL/github_flavored_markdown"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
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
	Title    string
	GfmCss   template.CSS
	PrintCss template.CSS
	ReloadJs template.JS
	Content  template.HTML
}

var (
	version   = "unknown"
	port      = uint16(5000)
	noBrowser = false
	raw       = false

	mdFile        string
	cssFile       string
	jsFile        string
	wsConnections Connections
	upgrader      = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func init() {

	var path, style, script string

	flaggy.SetName("markdown sync")
	flaggy.SetDescription("A simple markdown renderer with live reload.")
	flaggy.DefaultParser.AdditionalHelpPrepend = "Extended help can be found on github: https://github.com/rverst/markdownsync"
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
	fmt.Printf("listening at: %s\n", url)
	http.HandleFunc("/", handleRequest)
	if !noBrowser {
		openBrowser(url)
	}
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		log.Fatal(err)
	}
}

func handleRequest(w http.ResponseWriter, r *http.Request) {

	if r.URL.Path == "/robots.txt" {
		_, _ = w.Write([]byte("User-agent: *\nDisallow: /"))
		return
	}

	if r.URL.Path == "/custom.js" {
		var js []byte
		if jsFile == "" && !raw {
			js, _ = b64.StdEncoding.DecodeString(customJs)
		} else {
			js, _ = ioutil.ReadFile(jsFile)
		}

		if len(js) == 0 {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
		_, _ = w.Write(js)
		return
	}

	if r.URL.Path == "/custom.css" {
		var css []byte
		if cssFile == "" && !raw {
			css, _ = b64.StdEncoding.DecodeString(customCss)
		} else {
			css, _ = ioutil.ReadFile(jsFile)
		}

		if len(css) == 0 {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		w.Header().Set("Content-Type", "text/css; charset=utf-8")
		_, _ = w.Write(css)
		return
	}
	if r.URL.Path == "/ws" {
		err := handleWebSocket(w, r)
		if err != nil {
			fmt.Printf("error handling ws: %v\n", err)
		}
		return
	}

	if r.URL.Path == "/" {

		w.Header().Set("Content-Type", "text/html")
		content := Content{
			Title:    filepath.Base(mdFile),
			ReloadJs: reloadJs,
		}
		if !raw {
			content.GfmCss = gfmCss
			content.PrintCss = printCss
		}
		md, err := ioutil.ReadFile(mdFile)
		if err != nil {
			content.Content = template.HTML(err.Error())
		}
		content.Content = template.HTML(github_flavored_markdown.Markdown(md))

		err = htmlTemplate.Execute(w, content)
		if err != nil {
			fmt.Printf("error parsing template: %v\n", err)
		}

		return
	}

	w.WriteHeader(http.StatusNotFound)
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) error {
	c, errUpgrade := upgrader.Upgrade(w, r, nil)
	if errUpgrade != nil {
		return errUpgrade
	}
	defer c.Close()

	wsConnections.Lock()
	if len(wsConnections.cs) == 0 {
		wsConnections.cs = make(map[string]*websocket.Conn)
	}
	wsConnections.cs[c.RemoteAddr().String()] = c
	wsConnections.Unlock()
	defer func() {
		wsConnections.Lock()
		delete(wsConnections.cs, c.RemoteAddr().String())
		wsConnections.Unlock()
	}()

	var p Payload
	for {
		err := c.ReadJSON(&p)
		if err != nil {
			break
		}
	}
	return nil
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
	f, err := os.Stat(path)
	if os.IsNotExist(err) || f.IsDir() {
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
