package eth

import (
	"analytics/internal/token"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"sync"
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

type task struct {
	index int
	tx    Transaction
}

func GetTransactionHistory(address string) (*[]ExtendedTransaction, error) {
	rawTransactions, err := getRawTransactions(address)
	if err != nil {
		return nil, fmt.Errorf("failed to get raw transaction history: %w", err)
	}
	transactions, err := restructureResult(*rawTransactions, address)
	if err != nil {
		return nil, fmt.Errorf("failed to ")
	}

	return transactions, nil
}

func getRawTransactions(address string) (*[]Transaction, error) {
	url, err := url.Parse(baseEtherscanAPIUrl)
	if err != nil {
		return nil, fmt.Errorf("error on url parsing: %w", err)
	}
	//TODO: Take last block
	endblock := 22276735
	etherscanApiKey := os.Getenv("ETHERSCAN_APIKEY")

	q := url.Query()
	q.Set("chainid", "1")
	q.Set("module", "account")
	q.Set("action", "tokentx")
	q.Set("address", address)
	q.Set("page", "1")
	q.Set("offset", "300")
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

	return &etherscanResponse.Result, nil
}

func processTransactionForRestructure(
	extendedTransactions []ExtendedTransaction,
	currentTransaction Transaction,
	index int,
	address string,
) {
	extendedTransactions[index].TimeStamp = currentTransaction.TimeStamp
	extendedTransactions[index].Hash = currentTransaction.Hash
	extendedTransactions[index].From = currentTransaction.From
	extendedTransactions[index].To = currentTransaction.To
	extendedTransactions[index].TokenName = currentTransaction.TokenName
	extendedTransactions[index].GasUsed = currentTransaction.GasUsed
	extendedTransactions[index].EtherscanLink = fmt.Sprintf("https://etherscan.io/tx/%s", currentTransaction.Hash)

	if strings.ToLower(currentTransaction.To) == strings.ToLower(address) {
		if strings.ToLower(currentTransaction.From) == strings.ToLower(address) {
			extendedTransactions[index].TransactionType = "swap"
		} else {
			extendedTransactions[index].TransactionType = "received"
		}
	} else if strings.ToLower(currentTransaction.From) == strings.ToLower(address) {
		extendedTransactions[index].TransactionType = "sent"
	} else {
		extendedTransactions[index].TransactionType = "unknown"
	}
	if currentTransaction.TokenName != "" {
		decimal, err := strconv.Atoi(currentTransaction.TokenDecimal)
		if err != nil {
			extendedTransactions[index].FormattedValue = -1
			log.Printf("failed to format value for %s: %цw", currentTransaction.Hash, err)
			return
		}
		valueFloat, err := strconv.ParseFloat(currentTransaction.Value, 64)
		if err != nil {
			extendedTransactions[index].FormattedValue = -1
			log.Printf("failed to format value for %s: %w\n", currentTransaction.Hash, err)
			return
		}
		power := float64(-decimal)
		extendedTransactions[index].FormattedValue = valueFloat * math.Pow(10, power)
	} else {
		extendedTransactions[index].FormattedValue, _ = strconv.ParseFloat(currentTransaction.Value, 64)
	}
}

func restructureResult(
	rawTransactions []Transaction,
	address string,
) (*[]ExtendedTransaction, error) {
	extendedTransactions := make([]ExtendedTransaction, len(rawTransactions))
	workerCount := 4
	tasks := make(chan task, len(rawTransactions))
	var wg sync.WaitGroup

	for w := 0; w < workerCount; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for t := range tasks {
				processTransactionForRestructure(extendedTransactions, t.tx, t.index, address)
			}
		}()
	}
	for i, tx := range rawTransactions {
		tasks <- task{index: i, tx: tx}
	}
	close(tasks)
	wg.Wait()

	return &extendedTransactions, nil
}

func GetFullTokenListFromTransaction(address string) (map[string]token.Token, error) {
	rawTransactions, err := getRawTransactions(address)
	if err != nil {
		return nil, fmt.Errorf("failed to get ")
	}
	result := make(map[string]token.Token)
	for _, tx := range *rawTransactions {
		_, ok := result[tx.ContractAddress]
		if !ok {
			val, err := strconv.Atoi(tx.TokenDecimal)
			if err != nil {
				result[tx.ContractAddress] = token.Token{
					TokenName: tx.TokenName,
					Decimal:   0,
				}
				continue
			}
			result[tx.ContractAddress] = token.Token{
				TokenName: tx.TokenName,
				Decimal:   val,
			}
		}
	}

	return result, nil
}
