package eth

import (
	"context"
	"fmt"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"math/big"
	"strings"
)

func GetBalance(
	ctx context.Context,
	client *ethclient.Client,
	recipient string,
) (*string, error) {
	account := common.HexToAddress(recipient)
	balance, err := client.BalanceAt(ctx, account, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to get eth balance: %w", err)
	}

	balanceEth := new(big.Float).SetInt(balance)
	divisor := new(big.Float).SetInt(big.NewInt(1000000000000000000)) // 1 Ether = 10^18 Wei
	balanceEth.Quo(balanceEth, divisor)
	formattedBalance := balanceEth.Text('f', 18)
	formattedBalance = strings.TrimRight(formattedBalance, "0")

	return &formattedBalance, err
}
