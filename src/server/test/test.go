package test

import (
	"testing"

	"go-project/CommitLoss/src/server/node"
)

func TestAdd(t *testing.T) {
	nodeItem := node.Node{ParentID: 0, ID: 2, Income: 2, Outcome: 2230, Name: "Protein Powder", Alias: "ppow", Children: nil}
	total, err := node.Add(nodeItem)
	if err == nil && len(total) != 1 {
		t.Errorf("Sum was incorrect, got: %d, want: %d.", total, 10)
	}
}
