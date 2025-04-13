package eth

import (
	"context"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

func GetBalance(
	ctx context.Context,
	client *ethclient.Client,
	recipient string,
) (*big.Int, error) {
	account := common.HexToAddress(recipient)
	balance, err := client.BalanceAt(ctx, account, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to get eth balance: %w", err)
	}
	return balance, err
}
