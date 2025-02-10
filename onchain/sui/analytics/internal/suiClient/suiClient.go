package suiClient

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/block-vision/sui-go-sdk/models"
	"github.com/block-vision/sui-go-sdk/sui"
	"strings"
)

type Balance struct {
	Type   string `json:"coinType"`
	Amount string `json:"totalBalance"`
}

func GetBalance(
	ctx context.Context,
	client sui.ISuiAPI,
	recipient string,
) (*[]Balance, error) {
	resp, err := client.SuiXGetAllBalance(ctx, models.SuiXGetAllBalanceRequest{
		Owner: recipient,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to get balance: %v", err)
	}
	var balance []Balance
	jsonResp, err := json.Marshal(resp)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal responce: %v", err)
	}
	err = json.Unmarshal(jsonResp, &balance)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal json resp: %v", err)
	}
	parseArray(balance)
	return &balance, nil
}

func parseArray(arr []Balance) []Balance {
	for i := range arr {
		arr[i].Amount = getLastSegment(arr[i].Amount)
		arr[i].Type = getLastSegment(arr[i].Type)
	}
	return arr
}

func getLastSegment(str string) string {
	parts := strings.Split(str, "::")
	if len(parts) <= 0 {
		return ""
	}
	return parts[len(parts)-1]
}
