package converter

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

const (
	coinListURL    = "https://api.coingecko.com/api/v3/coins/list"
	coinPatternURL = "https://api.coingecko.com/api/v3/coins/%s"
)

type coin struct {
	Id     string `json:"id"`
	Symbol string `json:"symbol"`
	Name   string `json:"name"`
}

type coinInfo struct {
	ID              string              `json:"id"`
	DetailPlatforms map[string]platform `json:"detail_platforms"`
}

type platform struct {
	DecimalPlace int `json:"decimal_place"`
}

func getCoinMap() (map[string]string, error) {
	resp, err := http.Get(coinListURL)
	if err != nil {
		return nil, fmt.Errorf("failed to get currency list form coingecko: %w", err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	var coinsList []coin
	err = json.Unmarshal(body, &coinsList)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal answer: %w", err)
	}
	coinMap := make(map[string]string)
	for _, coin := range coinsList {
		coinMap[coin.Name] = coin.Symbol
	}
	return coinMap, nil
}

func GetDecimalPlace(coinName string) (*int, error) {
	resp, err := http.Get(fmt.Sprintf(coinPatternURL, coinName))
	if err != nil {
		return nil, fmt.Errorf("failed to get information for coin %s: %w", coinName, err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	var coin coinInfo
	err = json.Unmarshal(body, &coin)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal answer: %w", err)
	}
	tmp := coin.DetailPlatforms[coinName].DecimalPlace
	return &tmp, nil
}
