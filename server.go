package main

import (
  b64 "encoding/base64"
  "fmt"
  "github.com/gorilla/websocket"
  "github.com/shurcooL/github_flavored_markdown"
  "html/template"
  "io/ioutil"
  "net/http"
  "path"
  "path/filepath"
  "strings"
)

var mimeTypes  = map[string]string {
  "js": "application/javascript; charset=utf-8",
  "css": "text/css; charset-utf-8",
  "ttf": "application/x-font-truetype",
  "ico": "image/x-icon",
  "png": "image/png",
  "jpg": "image/jpg",
  "svg": "image/svg+xml",
  "jpeg": "image/jpeg",
  "woff": "application/font-woff",
  "woff2": "application/font-woff2",
}

func getMimeType(r *http.Request) string {
  ext := path.Ext(r.URL.Path)
  if strings.HasPrefix(ext, ".") {
    ext = ext[1:]
  }
  t, ok := mimeTypes[ext]
  if ok {
    return t
  }
  return ""
}

func handleRequest(w http.ResponseWriter, r *http.Request) {

  if r.URL.Path == "/robots.txt" {
    _, _ = w.Write([]byte("User-agent: *\nDisallow: /"))
    return
  }

  if r.URL.Path == "/favicon.ico" || r.URL.Path == "/site.webmanifest" {
    handleAssetRequest(w, r)
    return
  }

  if r.URL.Path == "/ws" {
    err := handleWebSocket(w, r)
    if err != nil {
      fmt.Printf("error handling ws: %v\n", err)
    }
    return
  }

  if r.URL.Path == jsFile {
    serveFile(jsFile, w, r)
    return
  }

  if r.URL.Path == cssFile {
    serveFile(cssFile, w, r)
    return
  }

  if r.URL.Path == "/" {

    w.Header().Set("Content-Type", "text/html")
    content := Content{
      AppVersion:   version,
      Title:        filepath.Base(mdFile),
      Raw:          raw,
      CustomCss:    cssFile,
      CustomScript: jsFile,
    }
    md, err := ioutil.ReadFile(mdFile)
    if err != nil {
      content.Content = template.HTML(err.Error())
    }
    content.Content = template.HTML(github_flavored_markdown.Markdown(md))

    // htmlTemplate from embedded.go, if you get an 'unresolved reference' error,
    // run `go generate`
    err = htmlTemplate.Execute(w, content)
    if err != nil {
      fmt.Printf("error parsing template: %v\n", err)
    }

    return
  }

  p := r.URL.Path
  if !strings.HasPrefix(p, ".") {
    p = "."+p
  }
  f := loadAsset(p)
  if f != "" {
    serveFile(f, w, r)
    return
  }

  w.WriteHeader(http.StatusNotFound)
}

func handleAssetRequest(w http.ResponseWriter, r *http.Request) {

  key := strings.Replace(r.URL.Path, "/", "_", -1)
  key = strings.Replace(key, ".", "_", -1)
  key = key[1:]

  ct := getMimeType(r)

  // []assets from embedded.go, if you get an 'unresolved reference' error,
  // run `go generate`
  data, ok := assets[key]
  if !ok {
    w.WriteHeader(http.StatusNotFound)
    return
  }

  dec, err := b64.StdEncoding.DecodeString(data)
  if err != nil {
    fmt.Printf("handleAsset error: %v\n", err)
    w.WriteHeader(http.StatusInternalServerError)
    return
  }

  if ct != "" {
    w.Header().Set("Content-Type", ct)
  }
  _, _ = w.Write(dec)
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) error {
  c, errUpgrade := upg.Upgrade(w, r, nil)
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

func serveFile(file string, w http.ResponseWriter, r *http.Request) bool {
  data, err := ioutil.ReadFile(file)
  if err != nil {
    w.WriteHeader(http.StatusInternalServerError)
    return true
  }
  ct := getMimeType(r)
  if ct != "" {
    w.Header().Set("Content-Type", ct)
  }
  _, _ = w.Write(data)
  return false
}
