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
	item := Component{
		ID:    "1",
		Name:  "Food",
		Value: 200,
	}
	item1 := Component{
		ID:    "2",
		Name:  "Meet",
		Value: 200,
	}
	Add(nil, item, &item1)
	Add(&item, item1, nil)
}

// Data of Node element
type Component struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Value int    `json:"value"`
}

// Node structur
type Node struct {
	ParentItem *Component `json:"parentItem"`
	Item       Component  `json:"item"`
	ChildItem  *Component `json:"childItem"`
}

// Get list of nodes
func Get() []Node {
	return list
}

// Add new node
func Add(parentItem *Component, newItem Component, childItem *Component) error {
	t := newNode(parentItem, newItem, childItem)
	mtx.Lock()
	list = append(list, t)
	mtx.Unlock()
	return nil
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

func newNode(parentItem *Component, newComponent Component, childItem *Component) Node {
	return Node{
		ParentItem: parentItem,
		Item:       newComponent,
		ChildItem:  childItem,
	}
}

func findTodoLocation(name string) (int, error) {
	mtx.RLock()
	defer mtx.RUnlock()
	for i, t := range list {
		if isMatchingID(t.Item.Name, name) {
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
