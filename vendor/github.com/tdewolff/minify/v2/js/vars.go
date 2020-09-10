package js

import (
	"bytes"
	"sort"

	"github.com/tdewolff/parse/v2"
	"github.com/tdewolff/parse/v2/js"
)

type renamer struct {
	ast      *js.AST
	reserved map[string]struct{}
	rename   bool
}

func newRenamer(ast *js.AST, undeclared js.VarArray, rename bool) *renamer {
	reserved := make(map[string]struct{}, len(js.Keywords))
	for name, _ := range js.Keywords {
		reserved[name] = struct{}{}
	}
	return &renamer{
		ast:      ast,
		reserved: reserved,
		rename:   rename,
	}
}

func (r *renamer) renameScope(scope js.Scope) {
	if !r.rename {
		return
	}

	rename := []byte("`") // so that the next is 'a'
	sort.Sort(js.VarsByUses(scope.Declared))
	for _, v := range scope.Declared {
		rename = r.next(rename)
		for r.isReserved(rename, scope.Undeclared) {
			rename = r.next(rename)
		}
		v.Data = parse.Copy(rename)
	}
}

func (r *renamer) isReserved(name []byte, undeclared js.VarArray) bool {
	if 1 < len(name) { // there are no keywords or known globals that are one character long
		if _, ok := r.reserved[string(name)]; ok {
			return true
		}
	}
	for _, v := range undeclared {
		for v.Link != nil {
			v = v.Link
		}
		if bytes.Equal(v.Data, name) {
			return true
		}
	}
	return false
}

func (r *renamer) next(name []byte) []byte {
	// Generate new names for variables where the last character is (a-zA-Z$_) and others are (a-zA-Z).
	// Thus we can have 54 one-character names and 52*54=2808 two-character names for every branch leaf.
	// That is sufficient for virtually all input.
	if name[len(name)-1] == 'z' {
		name[len(name)-1] = 'A'
	} else if name[len(name)-1] == 'Z' {
		name[len(name)-1] = '_'
	} else if name[len(name)-1] == '_' {
		name[len(name)-1] = '$'
	} else if name[len(name)-1] == '$' {
		i := len(name) - 2
		for ; 0 <= i; i-- {
			if name[i] == 'Z' {
				continue // happens after 52*54=2808 variables
			} else if name[i] == 'z' {
				name[i] = 'A' // happens after 26*54=1404 variables
			} else {
				name[i]++
				break
			}
		}
		for j := i + 1; j < len(name); j++ {
			name[j] = 'a'
		}
		if i < 0 {
			name = append(name, 'a')
		}
	} else {
		name[len(name)-1]++
	}
	return name
}

////////////////////////////////////////////////////////////////

func bindingRefs(ibinding js.IBinding) (refs []*js.Var) {
	switch binding := ibinding.(type) {
	case *js.Var:
		refs = append(refs, binding)
	case *js.BindingArray:
		for _, item := range binding.List {
			if item.Binding != nil {
				refs = append(refs, bindingRefs(item.Binding)...)
			}
		}
		if binding.Rest != nil {
			refs = append(refs, bindingRefs(binding.Rest)...)
		}
	case *js.BindingObject:
		for _, item := range binding.List {
			if item.Value.Binding != nil {
				refs = append(refs, bindingRefs(item.Value.Binding)...)
			}
		}
		if binding.Rest != nil {
			refs = append(refs, binding.Rest)
		}
	}
	return
}

func addDefinition(decl *js.VarDecl, iDefines int, vdef *js.Var, value js.IExpr) bool {
	// see if not already defined in variable declaration list
	for i, item := range decl.List[iDefines:] {
		if v, ok := item.Binding.(*js.Var); ok && v == vdef {
			decl.List[iDefines+i].Default = value
			if 0 < i {
				decl.List[iDefines], decl.List[iDefines+i] = decl.List[iDefines+i], decl.List[iDefines]
			}
			return true
		}
	}
	return false
}

func (m *jsMinifier) hoistVars(body *js.BlockStmt) *js.VarDecl {
	// Hoist all variable declarations in the current module/function scope to the top.
	// If the first statement is a var declaration, expand it. Otherwise prepend a new var declaration.
	// Except for the first var declaration, all others are converted to expressions. This is possible because an ArrayBindingPattern and ObjectBindingPattern can be converted to an ArrayLiteral or ObjectLiteral respectively, as they are supersets of the BindingPatterns.
	parentVarsHoisted := m.varsHoisted
	m.varsHoisted = nil
	if 1 < body.Scope.NumVarDecls {
		iDefines := 0 // position past last variable definition in declaration
		var decl *js.VarDecl
		if varDecl, ok := body.List[0].(*js.VarDecl); ok && varDecl.TokenType == js.VarToken {
			decl = varDecl
		} else if forStmt, ok := body.List[0].(*js.ForStmt); ok {
			// TODO: only merge statements that don't have 'in' or 'of' keywords (slow to check?)
			if forStmt.Init == nil {
				decl = &js.VarDecl{js.VarToken, nil}
				forStmt.Init = decl
			} else if varDecl, ok := forStmt.Init.(*js.VarDecl); ok && varDecl.TokenType == js.VarToken {
				decl = varDecl
			}
		} else if whileStmt, ok := body.List[0].(*js.WhileStmt); ok {
			// TODO: only merge statements that don't have 'in' or 'of' keywords (slow to check?)
			decl = &js.VarDecl{js.VarToken, nil}
			var forBody js.BlockStmt
			if blockStmt, ok := whileStmt.Body.(*js.BlockStmt); ok {
				forBody = *blockStmt
			} else {
				forBody.List = []js.IStmt{whileStmt.Body}
			}
			body.List[0] = &js.ForStmt{decl, whileStmt.Cond, nil, forBody}
		}
		if decl != nil {
			// original declarations
			vs := []*js.Var{}
			for i, item := range decl.List {
				if item.Default != nil {
					iDefines = i + 1
				}
				vs = append(vs, bindingRefs(item.Binding)...)
			}

			// hoist other variable declarations in this function scope but don't initialize yet
		DeclaredLoop:
			for _, v := range body.Scope.Declared {
				if v.Decl == js.VariableDecl {
					for _, vdef := range vs {
						if v == vdef {
							continue DeclaredLoop
						}
					}
					v.Uses++ // might be inaccurate as we remove non-defining variable declarations later on
					decl.List = append(decl.List, js.BindingElement{v, nil})
				}
			}
		} else {
			decl = &js.VarDecl{js.VarToken, nil}
			for _, v := range body.Scope.Declared {
				if v.Decl == js.VariableDecl {
					v.Uses++ // might be inaccurate as we remove non-defining variable declarations later on
					decl.List = append(decl.List, js.BindingElement{v, nil})
				}
			}
			body.List = append([]js.IStmt{decl}, body.List...)
		}

		// pull in assignments to variables into the declaration, e.g. var a;a=5  =>  var a=5
		// sort in order of definitions
		nMerged := 0
	FindDefinitionsLoop:
		for _, item := range body.List[1:] {
			if exprStmt, ok := item.(*js.ExprStmt); ok {
				if binaryExpr, ok := exprStmt.Value.(*js.BinaryExpr); ok && binaryExpr.Op == js.EqToken {
					if v, ok := binaryExpr.X.(*js.Var); ok && v.Decl == js.VariableDecl {
						if addDefinition(decl, iDefines, v, binaryExpr.Y) {
							iDefines++
							nMerged++
							continue
						}
					}
				}
			} else if varDecl, ok := item.(*js.VarDecl); ok && varDecl.TokenType == js.VarToken {
				for _, item := range varDecl.List {
					if v, ok := item.Binding.(*js.Var); ok && item.Default != nil {
						if addDefinition(decl, iDefines, v, item.Default) {
							iDefines++
							continue
						}
					}
					break FindDefinitionsLoop // one of the declarations isn't a definition or can't be matched
				}
				nMerged++
				continue // all variable declarations were matched, keep looking
			}
			break // not ExprStmt nor VarDecl
		}
		if 0 < nMerged {
			body.List = append(body.List[:1], body.List[1+nMerged:]...)
		}
		m.varsHoisted = decl
	}
	return parentVarsHoisted
}
