// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract UniswapWrapper is Ownable, ReentrancyGuard {
    IUniswapV2Router02 public immutable uniswapRouter;
    
    uint256 public constant FEE_DENOMINATOR = 10000; // 100.00%
    uint256 public feeNumerator = 30;              // 0.30% комиссия по умолчанию
    
    uint256 public collectedFees;
    
    event SwapExecuted(address indexed user, uint256 amountIn, uint256 amountOut);
    event LiquidityAdded(address indexed user, uint256 amountA, uint256 amountB);
    event FeesWithdrawn(address indexed owner, uint256 amount);
    event FeeUpdated(uint256 newFee);

    constructor(address _routerAddress) Ownable(msg.sender) {
        require(_routerAddress != address(0), "Invalid router address");
        uniswapRouter = IUniswapV2Router02(_routerAddress);
    }

    receive() external payable {}

    // Установка комиссии (максимум 1%)
    function setFee(uint256 _feeNumerator) external onlyOwner {
        require(_feeNumerator <= 100, "Fee too high"); // максимум 1%
        feeNumerator = _feeNumerator;
        emit FeeUpdated(_feeNumerator);
    }

    // Вывод накопленных комиссий
    function withdrawFees() external onlyOwner {
        uint256 amount = collectedFees;
        require(amount > 0, "No fees to withdraw");
        
        collectedFees = 0;
        (bool sent, ) = owner().call{value: amount}("");
        require(sent, "Failed to send ETH");
        
        emit FeesWithdrawn(owner(), amount);
    }

    // Swap ETH на токены с комиссией
    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable nonReentrant returns (uint256[] memory amounts) {
        require(msg.value > 0, "Must send ETH");
        require(path[0] == uniswapRouter.WETH(), "Invalid path");

        uint256 fee = (msg.value * feeNumerator) / FEE_DENOMINATOR;
        uint256 amountToSwap = msg.value - fee;
        
        collectedFees += fee;

        amounts = uniswapRouter.swapExactETHForTokens{value: amountToSwap}(
            amountOutMin,
            path,
            to,
            deadline
        );
        
        emit SwapExecuted(msg.sender, msg.value, amounts[amounts.length - 1]);
        return amounts;
    }

    // Swap токенов на ETH с комиссией
    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external nonReentrant returns (uint256[] memory amounts) {
        require(amountIn > 0, "Invalid amount");
        require(path[path.length - 1] == uniswapRouter.WETH(), "Invalid path");

        IERC20 token = IERC20(path[0]);
        require(token.transferFrom(msg.sender, address(this), amountIn), "Transfer failed");
        require(token.approve(address(uniswapRouter), amountIn), "Approve failed");

        amounts = uniswapRouter.swapExactTokensForETH(
            amountIn,
            amountOutMin,
            path,
            address(this),
            deadline
        );

        uint256 fee = (amounts[amounts.length - 1] * feeNumerator) / FEE_DENOMINATOR;
        uint256 amountToSend = amounts[amounts.length - 1] - fee;
        
        collectedFees += fee;
        
        (bool sent, ) = to.call{value: amountToSend}("");
        require(sent, "Failed to send ETH");
        
        emit SwapExecuted(msg.sender, amountIn, amountToSend);
        return amounts;
    }

    // Добавление ликвидности с комиссией
    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external payable nonReentrant returns (uint256 amountToken, uint256 amountETH, uint256 liquidity) {
        require(msg.value > 0, "Must send ETH");

        uint256 fee = (msg.value * feeNumerator) / FEE_DENOMINATOR;
        uint256 amountETHToUse = msg.value - fee;
        
        collectedFees += fee;

        IERC20(token).transferFrom(msg.sender, address(this), amountTokenDesired);
        IERC20(token).approve(address(uniswapRouter), amountTokenDesired);

        (amountToken, amountETH, liquidity) = uniswapRouter.addLiquidityETH{value: amountETHToUse}(
            token,
            amountTokenDesired,
            amountTokenMin,
            amountETHMin,
            to,
            deadline
        );
        
        emit LiquidityAdded(msg.sender, amountToken, amountETH);
        return (amountToken, amountETH, liquidity);
    }

    // Получение текущего баланса комиссий
    function getCollectedFees() external view returns (uint256) {
        return collectedFees;
    }
}