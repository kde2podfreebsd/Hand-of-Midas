package app

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"analytics/internal/api"
	c "analytics/internal/clients"
)

func startServer(ctx context.Context) error {
	clients, err := c.CreateClients(ctx)
	if err != nil {
		return fmt.Errorf("failed to create clients: %w", err)
	}
	api.SetupRoutes(ctx, *clients)
	port := "8080"
	log.Printf("Server started on port %s\n", port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, nil))
	return nil
}

func main() {
	ctx := context.Background()
	err := startServer(ctx)
	if err != nil {
		panic(err)
	}
}
