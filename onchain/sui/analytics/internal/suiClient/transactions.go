package suiClient

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/block-vision/sui-go-sdk/models"
	"github.com/block-vision/sui-go-sdk/sui"
	"github.com/block-vision/sui-go-sdk/utils"
)

type Owner struct {
	AddressOwner string `json:"AddressOwner"`
}

type Transaction struct {
	ObjectId string `json:"objectId"`
	Digest   string `json:"digest"`
	Owner    Owner  `json:"owner"`
}

type TransactionData struct {
	Data Transaction `json:"data"`
}

type ResponseData struct {
	Data []TransactionData `json:"data"`
}

func GetOwnedObjects(
	ctx context.Context,
	client sui.ISuiAPI,
	recipient string,
) (*[]Transaction, error) {
	suiObjectResponseQuery := models.SuiObjectResponseQuery{
		Options: models.SuiObjectDataOptions{
			ShowType:    true,
			ShowContent: true,
			ShowBcs:     true,
			ShowOwner:   true,
		},
	}
	resp, err := client.SuiXGetOwnedObjects(ctx, models.SuiXGetOwnedObjectsRequest{
		Address: recipient,
		Query:   suiObjectResponseQuery,
		Limit:   10,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get owned objects: %v", err)
	}
	utils.PrettyPrint(resp)
	jsonResp, err := json.Marshal(resp)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal responce: %v", err)
	}
	var responseData ResponseData
	err = json.Unmarshal([]byte(jsonResp), &responseData)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal json resp: %v", err)
	}
	transactions := arrayFromTransactionDataToTransaction(responseData.Data)
	return &transactions, nil
}

func arrayFromTransactionDataToTransaction(
	arr []TransactionData,
) []Transaction {
	var transactions []Transaction
	for _, elem := range arr {
		transactions = append(transactions, elem.Data)
	}
	return transactions
}

func GetTransactionInfoByDigest(
	ctx context.Context,
	client sui.ISuiAPI,
	digest string,
) error {
	resp, err := client.SuiGetTransactionBlock(ctx, models.SuiGetTransactionBlockRequest{
		Digest: digest,
		Options: models.SuiTransactionBlockOptions{
			ShowInput:          true,
			ShowRawInput:       true,
			ShowEffects:        true,
			ShowEvents:         true,
			ShowBalanceChanges: true,
			ShowObjectChanges:  true,
		},
	})
	if err != nil {
		return fmt.Errorf("failed to get transactions by digest: %v", err)
	}
	utils.PrettyPrint(resp)
	return nil
}
