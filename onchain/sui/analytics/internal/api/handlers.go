package api

import (
	s "analytics/internal/suiClient"
	"context"
	"encoding/json"
	"fmt"
	"github.com/block-vision/sui-go-sdk/sui"
	"net/http"
)

func Pong() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "pong")
	}
}

func BalanceCheckHandler(ctx context.Context, client sui.ISuiAPI) http.HandlerFunc {
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

func GetOwnedObjectsHandler(ctx context.Context, client sui.ISuiAPI) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.URL.Query().Get("id")
		if id == "" {
			http.Error(w, "missing wallet address", http.StatusBadRequest)
			return
		}
		data, err := s.GetOwnedObjects(ctx, client, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	}
}

func GetTransactionHandler(ctx context.Context, client sui.ISuiAPI) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.URL.Query().Get("id")
		if id == "" {
			http.Error(w, "missing wallet address", http.StatusBadRequest)
			return
		}
		err := s.GetTransactionInfoByDigest(ctx, client, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		//w.Header().Set("Content-Type", "application/json")
		//json.NewEncoder(w).Encode(data)
	}
}
