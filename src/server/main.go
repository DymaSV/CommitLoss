package main

import (
	"go-project/CommitLoss/src/server/handlers"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/rs/cors"
)

func main() {
	r := gin.Default()

	r.GET("/nodes", handlers.GetNodeListHandler)
	r.POST("/save", handlers.AddNodeHandler)
	r.DELETE("/delete/:alias", handlers.DeleteItemHandler)

	// Solves Cross Origin Access Issue
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:2200"},
	})
	handler := c.Handler(r)

	srv := &http.Server{
		Handler: handler,
		Addr:    ":" + os.Getenv("PORT"),
	}

	log.Fatal(srv.ListenAndServe())
}
