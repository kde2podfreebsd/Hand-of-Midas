// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import "../src/UniswapWrapper.sol";
import "@v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract UniswapWrapperScript is Script {
    IUniswapV2Router02 public uniswapRouter;

    function setUp() public {}

    function run() public {
        // Получаем приватный ключ из переменной окружения
        uint256 privKey = vm.envUint("DEV_PRIV_KEY");
        address account = vm.addr(privKey);

        console.log("Deploying from account:", account);

        // Указываем адрес Uniswap V2 Router для Sepolia
        // Замените этот адрес на реальный адрес роутера в Sepolia
        address uniswapRouterAddress = 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008;

        // Начинаем транзакцию
        vm.startBroadcast(privKey);

        // Деплоим контракт UniswapWrapper
        UniswapWrapper wrapper = new UniswapWrapper(uniswapRouterAddress);
        console.log("UniswapWrapper deployed at:", address(wrapper));

        vm.stopBroadcast();
    }
}