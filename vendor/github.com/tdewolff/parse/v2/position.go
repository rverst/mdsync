package parse

import (
	"fmt"
	"io"
	"strings"
)

// Position returns the line and column number for a certain position in a file. It is useful for recovering the position in a file that caused an error.
// It only treates \n, \r, and \r\n as newlines, which might be different from some languages also recognizing \f, \u2028, and \u2029 to be newlines.
func Position(r io.Reader, offset int) (line, col int, context string) {
	l := NewInput(r)
	line = 1
	for l.Pos() < offset {
		c := l.Peek(0)
		n := 1
		newline := false
		if c == '\n' {
			newline = true
		} else if c == '\r' {
			if l.Peek(1) == '\n' {
				newline = true
				n = 2
			} else {
				newline = true
			}
		} else if c >= 0xC0 {
			var r rune
			if r, n = l.PeekRune(0); r == '\u2028' || r == '\u2029' {
				newline = true
			}
		} else if c == 0 && l.Err() != nil {
			break
		}

		if 1 < n && offset < l.Pos()+n {
			// move onto offset position
			l.Move(offset - l.Pos())
			break
		}
		l.Move(n)

		if newline {
			line++
			offset -= l.Pos()
			l.Skip()
		}
	}

	col = l.Pos() + 1
	context = positionContext(l, line, col)
	return
}

func positionContext(l *Input, line, col int) (context string) {
	for {
		c := l.Peek(0)
		if c == 0 && l.Err() != nil || c == '\n' || c == '\r' {
			break
		}
		l.Move(1)
	}

	// cut off front or rear of context to stay between 60 characters
	b := l.Lexeme()
	limit := 60
	offset := 20
	ellipsisFront := ""
	ellipsisRear := ""
	if limit < len(b) {
		if col <= limit-offset {
			ellipsisRear = "..."
			b = b[:limit-3]
		} else if col >= len(b)-offset-3 {
			ellipsisFront = "..."
			col -= len(b) - offset - offset - 7
			b = b[len(b)-offset-offset-4:]
		} else {
			ellipsisFront = "..."
			ellipsisRear = "..."
			b = b[col-offset-1 : col+offset]
			col = offset + 4
		}
	}

	// replace unprintable characters by a space
	for i, c := range b {
		if c < 0x20 || c == 0x7F {
			b[i] = ' '
		}
	}

	context += fmt.Sprintf("%5d: %s%s%s\n", line, ellipsisFront, string(b), ellipsisRear)
	context += fmt.Sprintf("%s^", strings.Repeat(" ", col+6))
	return
}
