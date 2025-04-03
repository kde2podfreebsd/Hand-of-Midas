package main

import (
	"analytics/internal/api"
	"context"
	"github.com/block-vision/sui-go-sdk/constant"
	"github.com/block-vision/sui-go-sdk/sui"
	"log"
	"net/http"
)

func startServer(ctx context.Context, client sui.ISuiAPI) error {
	api.SetupRoutes(ctx, client)
	port := "8080"
	log.Printf("Server started on port %s\n", port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, nil))

	return nil
}

func main() {
	ctx := context.Background()
	client := sui.NewSuiClient(constant.BvTestnetEndpoint)

	err := startServer(ctx, client)
	if err != nil {
		panic(err)
	}

}
