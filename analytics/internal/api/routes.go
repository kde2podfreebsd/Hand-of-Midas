package api

import (
	"context"
	"net/http"

	c "analytics/internal/clients"
)

func SetupRoutes(
	ctx context.Context,
	clients c.Clients,
) *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/analytics/ping", Pong())
	mux.HandleFunc("/sui/balance", SuiBalanceCheckHandler(ctx, clients.SuiClient))
	mux.HandleFunc("/sui/objects", GetOwnedObjectsHandler(ctx, clients.SuiClient))
	mux.HandleFunc("/sui/transaction", GetSuiTransactionHandler(ctx, clients.SuiClient))
	//mux.HandleFunc("/eth/balance", EthBalanceCheckHandler(ctx, clients.EthClient))
	mux.HandleFunc("/eth/transactions", GetEthTransactionHandler(clients.EtherscanAPIClient))
	return mux
}

func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
