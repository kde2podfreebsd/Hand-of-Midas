package datalens

import (
	"bytes"
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"sort"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func convertToCsv(jsonData []byte) ([]byte, error) {
	var records []map[string]interface{}
	if err := json.Unmarshal(jsonData, &records); err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %w", err)
	}
	if len(records) == 0 {
		return nil, fmt.Errorf("no data in JSON")
	}
	var headers []string
	for k := range records[0] {
		headers = append(headers, k)
	}
	sort.Strings(headers)
	var buf bytes.Buffer
	writer := csv.NewWriter(&buf)
	if err := writer.Write(headers); err != nil {
		return nil, fmt.Errorf("failed to write CSV headers: %w", err)
	}
	for _, record := range records {
		row := make([]string, len(headers))
		for i, field := range headers {
			if val, ok := record[field]; ok {
				row[i] = fmt.Sprintf("%v", val)
			}
		}
		if err := writer.Write(row); err != nil {
			return nil, fmt.Errorf("failed to write CSV fields: %w", err)
		}
	}
	writer.Flush()
	if err := writer.Error(); err != nil {
		return nil, fmt.Errorf("failed to finish write CSV: %w", err)
	}

	return buf.Bytes(), nil
}

func UploadDataToObjectStorage(
	apiURL string,
	bucketName string,
	accessKeyID string,
	secretAccessKey string,
) error {
	resp, err := http.Get(apiURL)
	if err != nil {
		return fmt.Errorf("failed to get data: %w", err)
	}
	defer resp.Body.Close()

	jsonData, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read response: %w", err)
	}
	csvData, err := convertToCsv(jsonData)
	if err != nil {
		return fmt.Errorf("failed to convert to CSV: %w", err)
	}
	endpoint := "storage.yandexcloud.net"
	useSSL := true
	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		return fmt.Errorf("failed to create MinIO client: %w", err)
	}
	objectName := fmt.Sprintf("datalens_upload/data_%s.csv", time.Now().Format("2006-01-02_15-04-05"))
	contentType := "text/csv"
	_, err = client.PutObject(
		context.Background(),
		bucketName,
		objectName,
		bytes.NewReader(csvData),
		int64(len(csvData)),
		minio.PutObjectOptions{ContentType: contentType},
	)
	if err != nil {
		return fmt.Errorf("failed to upload file to Object Storage: %w", err)
	}
	log.Printf("CSV uploaded: %s/%s", bucketName, objectName)

	return nil
}
