package api

import (
	"context"
	"github.com/block-vision/sui-go-sdk/sui"
	"net/http"
)

func SetupRoutes(
	ctx context.Context,
	client sui.ISuiAPI,
) {
	http.HandleFunc("/api/balance", BalanceCheckHandler(ctx, client))
	http.HandleFunc("/api/objects", GetOwnedObjectsHandler(ctx, client))
	http.HandleFunc("/api/transaction", GetTransactionHandler(ctx, client))
	http.HandleFunc("/api/ping", Pong())
}
