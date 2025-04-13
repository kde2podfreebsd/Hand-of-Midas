package sui

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"strconv"
	"strings"

	"analytics/internal/converter"

	"github.com/block-vision/sui-go-sdk/models"
	"github.com/block-vision/sui-go-sdk/sui"
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
	jsonResp, err := json.Marshal(resp)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal responce: %v", err)
	}
	var balance []Balance
	err = json.Unmarshal(jsonResp, &balance)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal json resp: %v", err)
	}
	balance, err = parseArray(balance)
	if err != nil {
		return nil, fmt.Errorf("failed to parse coin array: %w", err)
	}
	return &balance, nil
}

func parseArray(arr []Balance) ([]Balance, error) {
	for i := range arr {
		arr[i].Type = getLastSegment(arr[i].Type)
		degree, err := converter.GetDecimalPlace(arr[i].Type)
		if err != nil {
			return make([]Balance, 0), fmt.Errorf("failed to get decimal place: %w", err)
		}
		if degree == nil {
			return make([]Balance, 0), fmt.Errorf("decimal place is nil")
		}
		tmp, err := strconv.Atoi(getLastSegment(arr[i].Amount))
		if err != nil {
			return make([]Balance, 0), fmt.Errorf("failed to cast decimal palace to int: %w", err)
		}
		arr[i].Amount = strconv.FormatFloat(float64(tmp)*math.Pow10(-(*degree)), 'f', -1, 64)
		//fmt.Println(arr[i].Amount, " ", arr[i].Type, " ", *degree)
	}
	return arr, nil
}

func getLastSegment(str string) string {
	parts := strings.Split(str, "::")
	if len(parts) <= 0 {
		return ""
	}
	return parts[len(parts)-1]
}
