package eth

import (
	"analytics/internal/token"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"math/big"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
)

type TokenAmountResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Result  string `json:"result"`
}

func GetBalance(
	ctx context.Context,
	client *ethclient.Client,
	address string,
) (map[string]string, error) {
	ethBalance, err := getEthBalance(ctx, client, address)
	if err != nil {
		return nil, fmt.Errorf("failed to get eth balance: %w", err)
	}
	list, err := GetFullTokenListFromTransaction(address)
	if err != nil {
		return nil, fmt.Errorf("failed to get token list from stransaction: %w", err)
	}
	fullBalance, err := getTokensBalance(list)
	if err != nil {
		return nil, fmt.Errorf("failed to get tokens amount: %w", err)
	}
	fullBalance["eth"] = *ethBalance

	return fullBalance, err
}

func getEthBalance(
	ctx context.Context,
	client *ethclient.Client,
	address string,
) (*string, error) {
	account := common.HexToAddress(address)
	balance, err := client.BalanceAt(ctx, account, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to get eth balance: %w", err)
	}

	balanceEth := new(big.Float).SetInt(balance)
	divisor := new(big.Float).SetInt(big.NewInt(1000000000000000000)) //10^18
	balanceEth.Quo(balanceEth, divisor)
	formattedBalance := balanceEth.Text('f', 18)
	formattedBalance = strings.TrimRight(formattedBalance, "0")

	return &formattedBalance, nil
}

func getTokensBalance(tokenByContractAddress map[string]token.Token) (map[string]string, error) {
	result := make(map[string]string)
	ticker := time.NewTicker(210 * time.Millisecond)
	defer ticker.Stop()
	for contractAddress, token := range tokenByContractAddress {
		<-ticker.C
		value, err := getTokenAmountByContractAddress(contractAddress, token.Decimal)
		if err != nil {
			return nil, fmt.Errorf("failed to get token balance for %s: %w", contractAddress, err)
		}
		result[token.TokenName] = *value
	}

	return result, nil
}

func getTokenAmountByContractAddress(
	contractAddress string,
	decimal int,
) (*string, error) {
	url, err := url.Parse(baseEtherscanAPIUrl)
	if err != nil {
		return nil, fmt.Errorf("error on url parsing: %w", err)
	}
	etherscanApiKey := os.Getenv("ETHERSCAN_APIKEY")

	q := url.Query()
	q.Set("chainid", "1")
	q.Set("module", "stats")
	q.Set("action", "tokensupply")
	q.Set("contractaddress", contractAddress)
	q.Set("apikey", etherscanApiKey)

	url.RawQuery = q.Encode()
	resp, err := http.Get(url.String())
	if err != nil {
		return nil, fmt.Errorf("failed on get request for transactions: %w", err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}
	var tokenResponse TokenAmountResponse
	err = json.Unmarshal(body, &tokenResponse)
	if err != nil {
		return nil, fmt.Errorf("failed to return ")
	}
	value, err := strconv.ParseFloat(tokenResponse.Result, 64)
	if err != nil {
		log.Printf("failed to parse amount for %s: %w", contractAddress, err)
		return &tokenResponse.Result, nil
	}
	power := float64(-decimal)
	ans := strconv.FormatFloat(value*math.Pow(10, power), 'f', -1, 64)

	return &ans, nil
}
