package tmp

//func getTransactionByDigest(
//	ctx context.Context,
//	client sui.ISuiAPI,
//	recipient string,
//) error {
//	resp, err := client.SuiGetTransactionBlock(ctx, sui)
//}
//
//func TestRequest() error {
//	faucetHost, err := sui.GetFaucetHost(constant.SuiDevnet)
//	if err != nil {
//		return fmt.Errorf("failed to getFauceHost: %v", err)
//	}
//	fmt.Println("faucetHost: ", faucetHost)
//	header := map[string]string{}
//	err = sui.RequestSuiFromFaucet(faucetHost, recipient1, header)
//	if err != nil {
//		return fmt.Errorf("failed to request: %v", err)
//	}
//	fmt.Println("Success!")
//	return nil
//}

//func getDetails(
//	ctx context.Context,
//	client sui.ISuiAPI,
//	recipient string,
//) error {
//	resp, err := client.SuiGetObject(ctx, models.SuiGetObjectRequest{
//		ObjectId: recipient,
//		Options: models.SuiObjectDataOptions{
//			ShowContent:             true,
//			ShowDisplay:             true,
//			ShowType:                true,
//			ShowBcs:                 true,
//			ShowOwner:               true,
//			ShowPreviousTransaction: true,
//			ShowStorageRebate:       true,
//		},
//	})
//	if err != nil {
//		return fmt.Errorf("failed to get object: %v", err)
//	}
//	utils.PrettyPrint(resp)
//	return nil
//}
//
//func getOwnedObjects(
//	ctx context.Context,
//	client sui.ISuiAPI,
//	recipient string,
//) error {
//	suiObjectResponceQuery := models.SuiObjectResponseQuery{
//		Options: models.SuiObjectDataOptions{
//			ShowType:    true,
//			ShowContent: true,
//			ShowBcs:     true,
//			ShowOwner:   true,
//		},
//	}
//	resp, err := client.SuiXGetOwnedObjects(ctx, models.SuiXGetOwnedObjectsRequest{
//		Address: recipient,
//		Query:   suiObjectResponceQuery,
//		Limit:   10,
//	})
//	if err != nil {
//		return fmt.Errorf("failed to get owned objects: %v", err)
//	}
//	utils.PrettyPrint(resp)
//	return nil
//}
