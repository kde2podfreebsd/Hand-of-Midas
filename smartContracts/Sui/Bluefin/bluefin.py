import subprocess
import os
import json


def run_js(command, *args):
    """Запускает Node.js скрипт и возвращает результат."""
    script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "index.js"))

    process = subprocess.Popen(
        ["node", script_path, command] + list(args),
        stdout=subprocess.PIPE, stderr=subprocess.PIPE,
        text=True
    )

    stdout, stderr = process.communicate()

    if stderr:
        return {"error": stderr.strip()}

    return stdout.strip()

    # if stderr:
    #     return {"error": stderr.strip()}

    # try:
    #     return json.loads(stdout.strip())
    # except json.JSONDecodeError:
    #     return {"error": "Invalid JSON output", "raw": stdout.strip()}

# # Пример вызова баланса
# address = "0x6e424f5ee02e17651e0c5a5052b85a808d615b3e635f9de7b301880bc607800e"
# balance = run_js("balance", address)
# print("Balance:", balance)

# # Пример вызова перевода
# recipient = "0x41a17e51a297dbf94b00eae136fdf82196a7eaaffde0b17d21f20c9e507b3569"
# amount = "1"  # 0.000000001 SUI
# transfer_result = run_js("transfer", recipient, amount)
# print("Transfer result:", transfer_result)

# Пример получения информации о пуле
# pool_id = "0x0bd95d012d60190a6713ae51f2d833b24ae70c5fb07fcfb41db40f25549878b1"
# pool_info = run_js("get_pool", pool_id)
# print("Pool Info:", pool_info)

# # Пример получения позиций пользователя
# user_address = "0x6e424f5ee02e17651e0c5a5052b85a808d615b3e635f9de7b301880bc607800e"
# user_positions = run_js("get_user_positions", user_address)
# print("User Positions:", user_positions)

# # Пример свопа токенов
# swap_result = run_js("swap",
#     "0x3b585786b13af1d8ea067ab37101b6513a05d2f90cfe60e8b1d9e1b46a63c4fa",
#     "0.01", "true", "true", "0.1")
# print("Swap Result:", swap_result)

# # Пример добавления ликвидности
# open_result = run_js("open",
#     "0x3b585786b13af1d8ea067ab37101b6513a05d2f90cfe60e8b1d9e1b46a63c4fa",
#     "0.01", "0.5", "3", "4")
# print("Open Liquidity Result:", open_result)

# # Пример получения позиций пользователя
# user_address = "0x6e424f5ee02e17651e0c5a5052b85a808d615b3e635f9de7b301880bc607800e"
# user_positions = run_js("get_user_positions", user_address)
# print("User Positions:", user_positions)

# # Пример сбора наград и комиссий
# position_id = "0x06720bc7726b54154f84eeb011e920f120dfc39583e530546034a85aec7b018c"
# collect_result = run_js("collect", position_id)
# print("Collect Result:", collect_result)

# # Пример закрытия позиции
# close_result = run_js("close", "0x06720bc7726b54154f84eeb011e920f120dfc39583e530546034a85aec7b018c")
# print("Close Position Result:", close_result)
