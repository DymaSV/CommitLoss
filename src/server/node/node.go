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
}

// Data of Node element
type Component struct {
	id    string `json:"id"`
	name  string `json:"name"`
	value int    `json:"value"`
}

// Node structur
type Node struct {
	parentItem *Component `json:"parentItem"`
	item       Component  `json:"item"`
	childItem  *Component `json:"childItem"`
}

// Get list of nodes
func Get() []Node {
	return list
}

// Add new node
func Add(parentItem *Component, newComponent Component, childItem *Component) {
	t := newTodo(parentItem, newComponent, childItem)
	mtx.Lock()
	list = append(list, t)
	mtx.Unlock()
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

func newTodo(parentItem *Component, newComponent Component, childItem *Component) Node {
	return Node{
		parentItem: parentItem,
		item:       newComponent,
		childItem:  childItem,
	}
}

func findTodoLocation(name string) (int, error) {
	mtx.RLock()
	defer mtx.RUnlock()
	for i, t := range list {
		if isMatchingID(t.item.name, name) {
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
