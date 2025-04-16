package clients

import (
	"context"
	"fmt"
	"github.com/block-vision/sui-go-sdk/constant"
	"github.com/block-vision/sui-go-sdk/sui"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/nanmu42/etherscan-api"
	"os"
)

const (
	ethNodeURL = "https://eth-mainnet.g.alchemy.com/v2/HfJmJB941pwDugydgaqI33-kFW0clzSi"
)

type Clients struct {
	SuiClient          sui.ISuiAPI
	EtherscanAPIClient *etherscan.Client
	EthClient          *ethclient.Client
}

func CreateClients(ctx context.Context) (*Clients, error) {
	etherscanApiKey := os.Getenv("ETHERSCAN_APIKEY")
	suiClient := sui.NewSuiClient(constant.BvTestnetEndpoint)
	etherscanAPIClient := etherscan.New(etherscan.Mainnet, etherscanApiKey)
	ethClient, err := ethclient.DialContext(context.Background(), ethNodeURL)
	if err != nil {
		return nil, fmt.Errorf("failed to create ethClient: %w", err)
	}
	return &Clients{
		SuiClient:          suiClient,
		EtherscanAPIClient: etherscanAPIClient,
		EthClient:          ethClient,
	}, nil
}
