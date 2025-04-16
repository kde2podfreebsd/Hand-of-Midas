package eth

import (
	"encoding/json"
	"fmt"
	"github.com/ethereum/go-ethereum/log"
	etherscan "github.com/nanmu42/etherscan-api"
	"io"
	"math"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
)

const (
	baseEtherscanAPIUrl = "https://api.etherscan.io/v2/api"
)

type EtherscanResponse struct {
	Result  []Transaction `json:"result"`
	Status  string        `json:"status"`
	Message string        `json:"message"`
}

type Transaction struct {
	TimeStamp       string `json:"timeStamp"`
	Hash            string `json:"hash"`
	From            string `json:"from"`
	ContractAddress string `json:"contractAddress"`
	To              string `json:"to"`
	Value           string `json:"value"`
	TokenName       string `json:"tokenName"`
	TokenSymbol     string `json:"tokenSymbol"`
	TokenDecimal    string `json:"tokenDecimal"`
	GasUsed         string `json:"gasUsed"`
}

type ExtendedTransaction struct {
	TransactionType string  `json:"transactionType"`
	TimeStamp       string  `json:"timeStamp"`
	Hash            string  `json:"hash"`
	From            string  `json:"from"`
	To              string  `json:"to"`
	TokenName       string  `json:"tokenName"`
	FormattedValue  float64 `json:"formattedValue"`
	GasUsed         string  `json:"gasUsed"`
	EtherscanLink   string  `json:"etherscanLink"`
}

func GetTransactionHistory(
	client *etherscan.Client,
	address string,
) (*[]ExtendedTransaction, error) {
	url, err := url.Parse(baseEtherscanAPIUrl)
	if err != nil {
		return nil, fmt.Errorf("error on url parsing: %w", err)
	}
	//TODO: Take last block
	endblock := 22276735
	etherscanApiKey := os.Getenv("APIKEY")

	q := url.Query()
	q.Set("chainid", "1")
	q.Set("module", "account")
	q.Set("action", "tokentx")
	q.Set("address", address)
	q.Set("page", "1")
	q.Set("offset", "100")
	q.Set("startblock", "0")
	q.Set("endblock", strconv.Itoa(endblock))
	q.Set("sort", "asc")
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
	var etherscanResponse EtherscanResponse
	err = json.Unmarshal(body, &etherscanResponse)
	if err != nil {
		return nil, fmt.Errorf("failed on jason unmarshal: %w", err)
	}
	if etherscanResponse.Status != "1" {
		return nil, fmt.Errorf(
			"error from API Etherscan: %s - %s", etherscanResponse.Status, etherscanResponse.Message)
	}
	transactions, err := restructureResult(etherscanResponse, address)
	if err != nil {
		return nil, fmt.Errorf("failed to ")
	}
	return transactions, nil
}

func restructureResult(
	etherscanResponse EtherscanResponse,
	address string,
) (*[]ExtendedTransaction, error) {
	extendedTransactions := make([]ExtendedTransaction, len(etherscanResponse.Result))
	for i, tx := range etherscanResponse.Result {
		extendedTransactions[i].TimeStamp = tx.TimeStamp
		extendedTransactions[i].Hash = tx.Hash
		extendedTransactions[i].From = tx.From
		extendedTransactions[i].To = tx.To
		extendedTransactions[i].TokenName = tx.TokenName
		extendedTransactions[i].GasUsed = tx.GasUsed

		extendedTransactions[i].EtherscanLink = fmt.Sprintf("https://etherscan.io/tx/%s", tx.Hash)
		if strings.ToLower(tx.To) == strings.ToLower(address) {
			if strings.ToLower(tx.From) == strings.ToLower(address) {
				extendedTransactions[i].TransactionType = "swap"
			} else {
				extendedTransactions[i].TransactionType = "received"
			}
		} else if strings.ToLower(tx.From) == strings.ToLower(address) {
			extendedTransactions[i].TransactionType = "sent"
		} else {
			extendedTransactions[i].TransactionType = "unknown"
		}
		if tx.TokenName != "" {
			decimal, err := strconv.Atoi(tx.TokenDecimal)
			if err != nil {
				extendedTransactions[i].FormattedValue = -1
				log.Error("failed to format value for %s: %цw", tx.Hash, err)
				continue
			}
			valueFloat, err := strconv.ParseFloat(tx.Value, 64)
			if err != nil {
				extendedTransactions[i].FormattedValue = -1
				log.Error("failed to format value for %s: %w", tx.Hash, err)
				continue
			}
			power := float64(-decimal)
			extendedTransactions[i].FormattedValue = valueFloat * math.Pow(10, power)
		} else {
			extendedTransactions[i].FormattedValue, _ = strconv.ParseFloat(tx.Value, 64)
		}
	}
	return &extendedTransactions, nil
}
