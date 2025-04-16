from dune_client.client import DuneClient
dune = DuneClient("Znd1JRcTldBhoDiyZYLCMD6loSyHr7KK")
query_result = dune.get_latest_result(1661180)
print(query_result)