package api

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	e "analytics/internal/eth"
	s "analytics/internal/sui"

	"github.com/block-vision/sui-go-sdk/sui"
	"github.com/ethereum/go-ethereum/ethclient"
)

func Pong() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "pong")
	}
}

func SuiBalanceCheckHandler(ctx context.Context, client sui.ISuiAPI) http.HandlerFunc {
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

func GetSuiTransactionHandler(ctx context.Context, client sui.ISuiAPI) http.HandlerFunc {
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

func EthBalanceCheckHandler(ctx context.Context, client *ethclient.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.URL.Query().Get("id")
		if id == "" {
			http.Error(w, "missing wallet address", http.StatusBadRequest)
			return
		}
		data, err := e.GetBalance(ctx, client, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	}
}

func GetEthTransactionHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := r.URL.Query().Get("id")
		if id == "" {
			http.Error(w, "missing wallet address", http.StatusBadRequest)
			return
		}
		data, err := e.GetTransactionHistory(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(data)
	}
}
