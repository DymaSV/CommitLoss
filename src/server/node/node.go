package node

import (
	"errors"
	"sync"
)

var (
	list []Node
	mtx  sync.RWMutex
	once sync.Once
)

func init() {
	once.Do(initialiseList)
}

func initialiseList() {
	list = []Node{}
	item := Node{
		ParentID: -1,
		ID:       0,
		Name:     "Income",
		Alias:    "inco",
		Income:   212,
		Outcome:  112,
		Children: []Node{Node{ParentID: 0, ID: 1, Income: 0, Outcome: 20, Name: "Almond Meal flour", Alias: "amfl", Children: nil},
			Node{ParentID: 0, ID: 2, Income: 2, Outcome: 2230, Name: "Protein Powder", Alias: "ppow", Children: nil}},
	}
	list = append(list, item)
}

// Node structur
type Node struct {
	ParentID int    `json:"parentID"`
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Alias    string `json:"alias"`
	Income   int    `json:"income"`
	Outcome  int    `json:"outcome"`
	Children []Node `json:"children"`
}

// Get list of nodes
func Get() []Node {
	return list
}

// Add new node
func RecreateList(item Node) error {
	mtx.Lock()
	list = []Node{}
	list = append(list, item)
	mtx.Unlock()
	return nil
}
func addItemToChild(array []Node, item Node) {
	for i := 0; i < len(array); i++ {
		if array[i].ID == item.ParentID {
			if array[i].Children == nil {
				array[i].Children = []Node{}
			}
			array[i].Children = append(array[i].Children, item)
		}
		if array[i].Children != nil {
			addItemToChild(array[i].Children, item)
		}
	}
}

// Add new node
func Add(item Node) ([]Node, error) {
	mtx.Lock()
	if item.ParentID >= 0 {
		addItemToChild(list, item)
	} else {
		list = append(list, item)
	}
	mtx.Unlock()
	return list, nil
}

// Delete Node from list
func Delete(name string) error {
	id, err := findTodoLocation(name)
	if err != nil {
		return err
	}
	if id == -1 {
		return errors.New("There is no such of name")
	}
	removeElementByName(id)
	return nil
}

func findTodoLocation(name string) (int, error) {
	mtx.RLock()
	defer mtx.RUnlock()
	for i, t := range list {
		if isMatchingID(t.Name, name) {
			return i, nil
		}
	}
	return -1, errors.New("could not find node based on name")
}

func removeElementByName(i int) {
	mtx.Lock()
	list = append(list[:i], list[i+1:]...)
	mtx.Unlock()
}

func isMatchingID(a string, b string) bool {
	return a == b
}
