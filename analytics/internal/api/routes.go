package api

import (
	"context"
	"net/http"

	c "analytics/internal/clients"
)

func SetupRoutes(
	ctx context.Context,
	clients c.Clients,
) {
	http.HandleFunc("/analytics/ping", Pong())
	http.HandleFunc("/sui/balance", SuiBalanceCheckHandler(ctx, clients.SuiClient))
	http.HandleFunc("/sui/objects", GetOwnedObjectsHandler(ctx, clients.SuiClient))
	http.HandleFunc("/sui/transaction", GetSuiTransactionHandler(ctx, clients.SuiClient))
	//http.HandleFunc("/eth/balance", EthBalanceCheckHandler(ctx, clients.EthClient))
	http.HandleFunc("/eth/transactions", GetEthTransactionHandler(clients.EtherscanAPIClient))
}
