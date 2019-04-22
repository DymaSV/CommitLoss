package handlers

import (
	"encoding/json"
	"io"
	"io/ioutil"
	"net/http"

	"../node"
	"github.com/gin-gonic/gin"
)

// GetNodeListHandler returns all current node items
func GetNodeListHandler(c *gin.Context) {
	c.JSON(http.StatusOK, node.Get())
}

// AddNodeHandler adds a new node to the node list
func AddNodeHandler(c *gin.Context) {
	nodeItem, statusCode, err := convertHTTPBodyToNode(c.Request.Body)
	if err != nil {
		c.JSON(statusCode, err)
		return
	}
	errAdd := node.Add(nodeItem)
	if errAdd == nil {
		c.JSON(statusCode, nodeItem)
	} else {
		c.JSON(http.StatusInternalServerError, nil)
	}
}

// DeleteItemHandler will delete a specified node based on user http input
func DeleteItemHandler(c *gin.Context) {
	nodeName := c.Param("name")
	if err := node.Delete(nodeName); err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}
	c.JSON(http.StatusOK, "")
}

func convertHTTPBodyToNode(httpBody io.ReadCloser) (node.Node, int, error) {
	body, err := ioutil.ReadAll(httpBody)
	if err != nil {
		return node.Node{}, http.StatusInternalServerError, err
	}
	defer httpBody.Close()
	return convertJSONBodyToNode(body)
}

func convertJSONBodyToNode(jsonBody []byte) (node.Node, int, error) {
	var nodeItem node.Node
	err := json.Unmarshal(jsonBody, &nodeItem)
	if err != nil {
		return node.Node{}, http.StatusBadRequest, err
	}
	return nodeItem, http.StatusOK, nil
}
