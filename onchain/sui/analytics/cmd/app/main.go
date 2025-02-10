package main

import (
	s "analytics/internal/suiClient"
	"context"
	"encoding/json"
	"github.com/block-vision/sui-go-sdk/constant"
	"github.com/block-vision/sui-go-sdk/sui"
	"log"
	"net/http"
)

func handler(ctx context.Context, client sui.ISuiAPI) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.URL.Query().Get("id")
		if id == "" {
			http.Error(w, "missing wallet address", http.StatusBadRequest)
			return
		}
		data, err := s.GetBalance(ctx, client, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	}
}

func main() {
	ctx := context.Background()
	client := sui.NewSuiClient(constant.BvTestnetEndpoint)

	http.Handle("/api/balance", handler(ctx, client))
	port := "8080"
	log.Println("Server started on port", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
