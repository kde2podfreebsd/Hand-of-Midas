package clients

import (
	"context"
	"fmt"
	"github.com/block-vision/sui-go-sdk/constant"
	"github.com/block-vision/sui-go-sdk/sui"
	"github.com/ethereum/go-ethereum/ethclient"
)

const (
	ethNodeURL = ""
)

type Clients struct {
	SuiClient sui.ISuiAPI
	EthClient *ethclient.Client
}

func CreateClients(ctx context.Context) (*Clients, error) {
	suiClient := sui.NewSuiClient(constant.BvTestnetEndpoint)
	ethClient, err := ethclient.DialContext(ctx, ethNodeURL)
	if err != nil {
		return nil, fmt.Errorf("failed to create eth client: %w", err)
	}
	return &Clients{
		SuiClient: suiClient,
		EthClient: ethClient,
	}, nil
}
