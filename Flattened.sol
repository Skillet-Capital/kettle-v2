// Sources flattened with hardhat v2.22.12 https://hardhat.org

// SPDX-License-Identifier: MIT AND UNLICENSED

// File @openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (proxy/utils/Initializable.sol)

pragma solidity ^0.8.20;

/**
 * @dev This is a base contract to aid in writing upgradeable contracts, or any kind of contract that will be deployed
 * behind a proxy. Since proxied contracts do not make use of a constructor, it's common to move constructor logic to an
 * external initializer function, usually called `initialize`. It then becomes necessary to protect this initializer
 * function so it can only be called once. The {initializer} modifier provided by this contract will have this effect.
 *
 * The initialization functions use a version number. Once a version number is used, it is consumed and cannot be
 * reused. This mechanism prevents re-execution of each "step" but allows the creation of new initialization steps in
 * case an upgrade adds a module that needs to be initialized.
 *
 * For example:
 *
 * [.hljs-theme-light.nopadding]
 * ```solidity
 * contract MyToken is ERC20Upgradeable {
 *     function initialize() initializer public {
 *         __ERC20_init("MyToken", "MTK");
 *     }
 * }
 *
 * contract MyTokenV2 is MyToken, ERC20PermitUpgradeable {
 *     function initializeV2() reinitializer(2) public {
 *         __ERC20Permit_init("MyToken");
 *     }
 * }
 * ```
 *
 * TIP: To avoid leaving the proxy in an uninitialized state, the initializer function should be called as early as
 * possible by providing the encoded function call as the `_data` argument to {ERC1967Proxy-constructor}.
 *
 * CAUTION: When used with inheritance, manual care must be taken to not invoke a parent initializer twice, or to ensure
 * that all initializers are idempotent. This is not verified automatically as constructors are by Solidity.
 *
 * [CAUTION]
 * ====
 * Avoid leaving a contract uninitialized.
 *
 * An uninitialized contract can be taken over by an attacker. This applies to both a proxy and its implementation
 * contract, which may impact the proxy. To prevent the implementation contract from being used, you should invoke
 * the {_disableInitializers} function in the constructor to automatically lock it when it is deployed:
 *
 * [.hljs-theme-light.nopadding]
 * ```
 * /// @custom:oz-upgrades-unsafe-allow constructor
 * constructor() {
 *     _disableInitializers();
 * }
 * ```
 * ====
 */
abstract contract Initializable {
    /**
     * @dev Storage of the initializable contract.
     *
     * It's implemented on a custom ERC-7201 namespace to reduce the risk of storage collisions
     * when using with upgradeable contracts.
     *
     * @custom:storage-location erc7201:openzeppelin.storage.Initializable
     */
    struct InitializableStorage {
        /**
         * @dev Indicates that the contract has been initialized.
         */
        uint64 _initialized;
        /**
         * @dev Indicates that the contract is in the process of being initialized.
         */
        bool _initializing;
    }

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Initializable")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant INITIALIZABLE_STORAGE = 0xf0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00;

    /**
     * @dev The contract is already initialized.
     */
    error InvalidInitialization();

    /**
     * @dev The contract is not initializing.
     */
    error NotInitializing();

    /**
     * @dev Triggered when the contract has been initialized or reinitialized.
     */
    event Initialized(uint64 version);

    /**
     * @dev A modifier that defines a protected initializer function that can be invoked at most once. In its scope,
     * `onlyInitializing` functions can be used to initialize parent contracts.
     *
     * Similar to `reinitializer(1)`, except that in the context of a constructor an `initializer` may be invoked any
     * number of times. This behavior in the constructor can be useful during testing and is not expected to be used in
     * production.
     *
     * Emits an {Initialized} event.
     */
    modifier initializer() {
        // solhint-disable-next-line var-name-mixedcase
        InitializableStorage storage $ = _getInitializableStorage();

        // Cache values to avoid duplicated sloads
        bool isTopLevelCall = !$._initializing;
        uint64 initialized = $._initialized;

        // Allowed calls:
        // - initialSetup: the contract is not in the initializing state and no previous version was
        //                 initialized
        // - construction: the contract is initialized at version 1 (no reininitialization) and the
        //                 current contract is just being deployed
        bool initialSetup = initialized == 0 && isTopLevelCall;
        bool construction = initialized == 1 && address(this).code.length == 0;

        if (!initialSetup && !construction) {
            revert InvalidInitialization();
        }
        $._initialized = 1;
        if (isTopLevelCall) {
            $._initializing = true;
        }
        _;
        if (isTopLevelCall) {
            $._initializing = false;
            emit Initialized(1);
        }
    }

    /**
     * @dev A modifier that defines a protected reinitializer function that can be invoked at most once, and only if the
     * contract hasn't been initialized to a greater version before. In its scope, `onlyInitializing` functions can be
     * used to initialize parent contracts.
     *
     * A reinitializer may be used after the original initialization step. This is essential to configure modules that
     * are added through upgrades and that require initialization.
     *
     * When `version` is 1, this modifier is similar to `initializer`, except that functions marked with `reinitializer`
     * cannot be nested. If one is invoked in the context of another, execution will revert.
     *
     * Note that versions can jump in increments greater than 1; this implies that if multiple reinitializers coexist in
     * a contract, executing them in the right order is up to the developer or operator.
     *
     * WARNING: Setting the version to 2**64 - 1 will prevent any future reinitialization.
     *
     * Emits an {Initialized} event.
     */
    modifier reinitializer(uint64 version) {
        // solhint-disable-next-line var-name-mixedcase
        InitializableStorage storage $ = _getInitializableStorage();

        if ($._initializing || $._initialized >= version) {
            revert InvalidInitialization();
        }
        $._initialized = version;
        $._initializing = true;
        _;
        $._initializing = false;
        emit Initialized(version);
    }

    /**
     * @dev Modifier to protect an initialization function so that it can only be invoked by functions with the
     * {initializer} and {reinitializer} modifiers, directly or indirectly.
     */
    modifier onlyInitializing() {
        _checkInitializing();
        _;
    }

    /**
     * @dev Reverts if the contract is not in an initializing state. See {onlyInitializing}.
     */
    function _checkInitializing() internal view virtual {
        if (!_isInitializing()) {
            revert NotInitializing();
        }
    }

    /**
     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
     * through proxies.
     *
     * Emits an {Initialized} event the first time it is successfully executed.
     */
    function _disableInitializers() internal virtual {
        // solhint-disable-next-line var-name-mixedcase
        InitializableStorage storage $ = _getInitializableStorage();

        if ($._initializing) {
            revert InvalidInitialization();
        }
        if ($._initialized != type(uint64).max) {
            $._initialized = type(uint64).max;
            emit Initialized(type(uint64).max);
        }
    }

    /**
     * @dev Returns the highest version that has been initialized. See {reinitializer}.
     */
    function _getInitializedVersion() internal view returns (uint64) {
        return _getInitializableStorage()._initialized;
    }

    /**
     * @dev Returns `true` if the contract is currently initializing. See {onlyInitializing}.
     */
    function _isInitializing() internal view returns (bool) {
        return _getInitializableStorage()._initializing;
    }

    /**
     * @dev Returns a pointer to the storage namespace.
     */
    // solhint-disable-next-line var-name-mixedcase
    function _getInitializableStorage() private pure returns (InitializableStorage storage $) {
        assembly {
            $.slot := INITIALIZABLE_STORAGE
        }
    }
}


// File @openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.20;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract ContextUpgradeable is Initializable {
    function __Context_init() internal onlyInitializing {
    }

    function __Context_init_unchained() internal onlyInitializing {
    }
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}


// File @openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.20;


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract OwnableUpgradeable is Initializable, ContextUpgradeable {
    /// @custom:storage-location erc7201:openzeppelin.storage.Ownable
    struct OwnableStorage {
        address _owner;
    }

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Ownable")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant OwnableStorageLocation = 0x9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300;

    function _getOwnableStorage() private pure returns (OwnableStorage storage $) {
        assembly {
            $.slot := OwnableStorageLocation
        }
    }

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    function __Ownable_init(address initialOwner) internal onlyInitializing {
        __Ownable_init_unchained(initialOwner);
    }

    function __Ownable_init_unchained(address initialOwner) internal onlyInitializing {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        OwnableStorage storage $ = _getOwnableStorage();
        return $._owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        OwnableStorage storage $ = _getOwnableStorage();
        address oldOwner = $._owner;
        $._owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}


// File @openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable2Step.sol)

pragma solidity ^0.8.20;


/**
 * @dev Contract module which provides access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is specified at deployment time in the constructor for `Ownable`. This
 * can later be changed with {transferOwnership} and {acceptOwnership}.
 *
 * This module is used through inheritance. It will make available all functions
 * from parent (Ownable).
 */
abstract contract Ownable2StepUpgradeable is Initializable, OwnableUpgradeable {
    /// @custom:storage-location erc7201:openzeppelin.storage.Ownable2Step
    struct Ownable2StepStorage {
        address _pendingOwner;
    }

    // keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.Ownable2Step")) - 1)) & ~bytes32(uint256(0xff))
    bytes32 private constant Ownable2StepStorageLocation = 0x237e158222e3e6968b72b9db0d8043aacf074ad9f650f0d1606b4d82ee432c00;

    function _getOwnable2StepStorage() private pure returns (Ownable2StepStorage storage $) {
        assembly {
            $.slot := Ownable2StepStorageLocation
        }
    }

    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);

    function __Ownable2Step_init() internal onlyInitializing {
    }

    function __Ownable2Step_init_unchained() internal onlyInitializing {
    }
    /**
     * @dev Returns the address of the pending owner.
     */
    function pendingOwner() public view virtual returns (address) {
        Ownable2StepStorage storage $ = _getOwnable2StepStorage();
        return $._pendingOwner;
    }

    /**
     * @dev Starts the ownership transfer of the contract to a new account. Replaces the pending transfer if there is one.
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual override onlyOwner {
        Ownable2StepStorage storage $ = _getOwnable2StepStorage();
        $._pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner(), newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`) and deletes any pending owner.
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual override {
        Ownable2StepStorage storage $ = _getOwnable2StepStorage();
        delete $._pendingOwner;
        super._transferOwnership(newOwner);
    }

    /**
     * @dev The new owner accepts the ownership transfer.
     */
    function acceptOwnership() public virtual {
        address sender = _msgSender();
        if (pendingOwner() != sender) {
            revert OwnableUnauthorizedAccount(sender);
        }
        _transferOwnership(sender);
    }
}


// File @openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/extensions/IERC20Permit.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 Permit extension allowing approvals to be made via signatures, as defined in
 * https://eips.ethereum.org/EIPS/eip-2612[EIP-2612].
 *
 * Adds the {permit} method, which can be used to change an account's ERC20 allowance (see {IERC20-allowance}) by
 * presenting a message signed by the account. By not relying on {IERC20-approve}, the token holder account doesn't
 * need to send a transaction, and thus is not required to hold Ether at all.
 *
 * ==== Security Considerations
 *
 * There are two important considerations concerning the use of `permit`. The first is that a valid permit signature
 * expresses an allowance, and it should not be assumed to convey additional meaning. In particular, it should not be
 * considered as an intention to spend the allowance in any specific way. The second is that because permits have
 * built-in replay protection and can be submitted by anyone, they can be frontrun. A protocol that uses permits should
 * take this into consideration and allow a `permit` call to fail. Combining these two aspects, a pattern that may be
 * generally recommended is:
 *
 * ```solidity
 * function doThingWithPermit(..., uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) public {
 *     try token.permit(msg.sender, address(this), value, deadline, v, r, s) {} catch {}
 *     doThing(..., value);
 * }
 *
 * function doThing(..., uint256 value) public {
 *     token.safeTransferFrom(msg.sender, address(this), value);
 *     ...
 * }
 * ```
 *
 * Observe that: 1) `msg.sender` is used as the owner, leaving no ambiguity as to the signer intent, and 2) the use of
 * `try/catch` allows the permit to fail and makes the code tolerant to frontrunning. (See also
 * {SafeERC20-safeTransferFrom}).
 *
 * Additionally, note that smart contract wallets (such as Argent or Safe) are not able to produce permit signatures, so
 * contracts should have entry points that don't rely on permit.
 */
interface IERC20Permit {
    /**
     * @dev Sets `value` as the allowance of `spender` over ``owner``'s tokens,
     * given ``owner``'s signed approval.
     *
     * IMPORTANT: The same issues {IERC20-approve} has related to transaction
     * ordering also apply here.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `deadline` must be a timestamp in the future.
     * - `v`, `r` and `s` must be a valid `secp256k1` signature from `owner`
     * over the EIP712-formatted function arguments.
     * - the signature must use ``owner``'s current nonce (see {nonces}).
     *
     * For more information on the signature format, see the
     * https://eips.ethereum.org/EIPS/eip-2612#specification[relevant EIP
     * section].
     *
     * CAUTION: See Security Considerations above.
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /**
     * @dev Returns the current nonce for `owner`. This value must be
     * included whenever a signature is generated for {permit}.
     *
     * Every successful call to {permit} increases ``owner``'s nonce by one. This
     * prevents a signature from being used multiple times.
     */
    function nonces(address owner) external view returns (uint256);

    /**
     * @dev Returns the domain separator used in the encoding of the signature for {permit}, as defined by {EIP712}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() external view returns (bytes32);
}


// File @openzeppelin/contracts/token/ERC20/IERC20.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}


// File @openzeppelin/contracts/utils/Address.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/Address.sol)

pragma solidity ^0.8.20;

/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev The ETH balance of the account is not enough to perform the operation.
     */
    error AddressInsufficientBalance(address account);

    /**
     * @dev There's no code at `target` (it is not a contract).
     */
    error AddressEmptyCode(address target);

    /**
     * @dev A call to an address target failed. The target may have reverted.
     */
    error FailedInnerCall();

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://consensys.net/diligence/blog/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.8.20/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        if (address(this).balance < amount) {
            revert AddressInsufficientBalance(address(this));
        }

        (bool success, ) = recipient.call{value: amount}("");
        if (!success) {
            revert FailedInnerCall();
        }
    }

    /**
     * @dev Performs a Solidity function call using a low level `call`. A
     * plain `call` is an unsafe replacement for a function call: use this
     * function instead.
     *
     * If `target` reverts with a revert reason or custom error, it is bubbled
     * up by this function (like regular Solidity function calls). However, if
     * the call reverted with no returned reason, this function reverts with a
     * {FailedInnerCall} error.
     *
     * Returns the raw returned data. To convert to the expected return value,
     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].
     *
     * Requirements:
     *
     * - `target` must be a contract.
     * - calling `target` with `data` must not revert.
     */
    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but also transferring `value` wei to `target`.
     *
     * Requirements:
     *
     * - the calling contract must have an ETH balance of at least `value`.
     * - the called Solidity function must be `payable`.
     */
    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        if (address(this).balance < value) {
            revert AddressInsufficientBalance(address(this));
        }
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a static call.
     */
    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],
     * but performing a delegate call.
     */
    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return verifyCallResultFromTarget(target, success, returndata);
    }

    /**
     * @dev Tool to verify that a low level call to smart-contract was successful, and reverts if the target
     * was not a contract or bubbling up the revert reason (falling back to {FailedInnerCall}) in case of an
     * unsuccessful call.
     */
    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata
    ) internal view returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            // only check if target is a contract if the call was successful and the return data is empty
            // otherwise we already know that it was a contract
            if (returndata.length == 0 && target.code.length == 0) {
                revert AddressEmptyCode(target);
            }
            return returndata;
        }
    }

    /**
     * @dev Tool to verify that a low level call was successful, and reverts if it wasn't, either by bubbling the
     * revert reason or with a default {FailedInnerCall} error.
     */
    function verifyCallResult(bool success, bytes memory returndata) internal pure returns (bytes memory) {
        if (!success) {
            _revert(returndata);
        } else {
            return returndata;
        }
    }

    /**
     * @dev Reverts with returndata if present. Otherwise reverts with {FailedInnerCall}.
     */
    function _revert(bytes memory returndata) private pure {
        // Look for revert reason and bubble it up if present
        if (returndata.length > 0) {
            // The easiest way to bubble the revert reason is using memory via assembly
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert FailedInnerCall();
        }
    }
}


// File @openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/utils/SafeERC20.sol)

pragma solidity ^0.8.20;



/**
 * @title SafeERC20
 * @dev Wrappers around ERC20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    using Address for address;

    /**
     * @dev An operation with an ERC20 token failed.
     */
    error SafeERC20FailedOperation(address token);

    /**
     * @dev Indicates a failed `decreaseAllowance` request.
     */
    error SafeERC20FailedDecreaseAllowance(address spender, uint256 currentAllowance, uint256 requestedDecrease);

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transfer, (to, value)));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transferFrom, (from, to, value)));
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        forceApprove(token, spender, oldAllowance + value);
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `requestedDecrease`. If `token` returns no
     * value, non-reverting calls are assumed to be successful.
     */
    function safeDecreaseAllowance(IERC20 token, address spender, uint256 requestedDecrease) internal {
        unchecked {
            uint256 currentAllowance = token.allowance(address(this), spender);
            if (currentAllowance < requestedDecrease) {
                revert SafeERC20FailedDecreaseAllowance(spender, currentAllowance, requestedDecrease);
            }
            forceApprove(token, spender, currentAllowance - requestedDecrease);
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     */
    function forceApprove(IERC20 token, address spender, uint256 value) internal {
        bytes memory approvalCall = abi.encodeCall(token.approve, (spender, value));

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(token, abi.encodeCall(token.approve, (spender, 0)));
            _callOptionalReturn(token, approvalCall);
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We use {Address-functionCall} to perform this call, which verifies that
        // the target address contains contract code and also asserts for success in the low-level call.

        bytes memory returndata = address(token).functionCall(data);
        if (returndata.length != 0 && !abi.decode(returndata, (bool))) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturn} that silents catches all reverts and returns a bool instead.
     */
    function _callOptionalReturnBool(IERC20 token, bytes memory data) private returns (bool) {
        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since
        // we're implementing it ourselves. We cannot use {Address-functionCall} here since this should return false
        // and not revert is the subcall reverts.

        (bool success, bytes memory returndata) = address(token).call(data);
        return success && (returndata.length == 0 || abi.decode(returndata, (bool))) && address(token).code.length > 0;
    }
}


// File @openzeppelin/contracts/utils/introspection/IERC165.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/introspection/IERC165.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}


// File @openzeppelin/contracts/token/ERC721/IERC721.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/IERC721.sol)

pragma solidity ^0.8.20;

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721 is IERC165 {
    /**
     * @dev Emitted when `tokenId` token is transferred from `from` to `to`.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables `approved` to manage the `tokenId` token.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets.
     */
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the number of tokens in ``owner``'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function ownerOf(uint256 tokenId) external view returns (address owner);

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon
     *   a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) external;

    /**
     * @dev Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients
     * are aware of the ERC721 protocol to prevent tokens from being forever locked.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must exist and be owned by `from`.
     * - If the caller is not `from`, it must have been allowed to move this token by either {approve} or
     *   {setApprovalForAll}.
     * - If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon
     *   a safe transfer.
     *
     * Emits a {Transfer} event.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Note that the caller is responsible to confirm that the recipient is capable of receiving ERC721
     * or else they may be permanently lost. Usage of {safeTransferFrom} prevents loss, though the caller must
     * understand this adds an external call which potentially creates a reentrancy vulnerability.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The `operator` cannot be the address zero.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool approved) external;

    /**
     * @dev Returns the account approved for `tokenId` token.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function getApproved(uint256 tokenId) external view returns (address operator);

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}


// File @openzeppelin/contracts/token/ERC721/IERC721Receiver.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/IERC721Receiver.sol)

pragma solidity ^0.8.20;

/**
 * @title ERC721 token receiver interface
 * @dev Interface for any contract that wants to support safeTransfers
 * from ERC721 asset contracts.
 */
interface IERC721Receiver {
    /**
     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}
     * by `operator` from `from`, this function is called.
     *
     * It must return its Solidity selector to confirm the token transfer.
     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be
     * reverted.
     *
     * The selector can be obtained in Solidity with `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}


// File @openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC721/utils/ERC721Holder.sol)

pragma solidity ^0.8.20;

/**
 * @dev Implementation of the {IERC721Receiver} interface.
 *
 * Accepts all token transfers.
 * Make sure the contract is able to use its token with {IERC721-safeTransferFrom}, {IERC721-approve} or
 * {IERC721-setApprovalForAll}.
 */
abstract contract ERC721Holder is IERC721Receiver {
    /**
     * @dev See {IERC721Receiver-onERC721Received}.
     *
     * Always returns `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(address, address, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }
}


// File @openzeppelin/contracts/utils/math/Math.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/math/Math.sol)

pragma solidity ^0.8.20;

/**
 * @dev Standard math utilities missing in the Solidity language.
 */
library Math {
    /**
     * @dev Muldiv operation overflow.
     */
    error MathOverflowedMulDiv();

    enum Rounding {
        Floor, // Toward negative infinity
        Ceil, // Toward positive infinity
        Trunc, // Toward zero
        Expand // Away from zero
    }

    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     */
    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, with an overflow flag.
     */
    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     */
    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     */
    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     */
    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the largest of two numbers.
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    /**
     * @dev Returns the smallest of two numbers.
     */
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Returns the average of two numbers. The result is rounded towards
     * zero.
     */
    function average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow.
        return (a & b) + (a ^ b) / 2;
    }

    /**
     * @dev Returns the ceiling of the division of two numbers.
     *
     * This differs from standard division with `/` in that it rounds towards infinity instead
     * of rounding towards zero.
     */
    function ceilDiv(uint256 a, uint256 b) internal pure returns (uint256) {
        if (b == 0) {
            // Guarantee the same behavior as in a regular Solidity division.
            return a / b;
        }

        // (a + b - 1) / b can overflow on addition, so we distribute.
        return a == 0 ? 0 : (a - 1) / b + 1;
    }

    /**
     * @notice Calculates floor(x * y / denominator) with full precision. Throws if result overflows a uint256 or
     * denominator == 0.
     * @dev Original credit to Remco Bloemen under MIT license (https://xn--2-umb.com/21/muldiv) with further edits by
     * Uniswap Labs also under MIT license.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator) internal pure returns (uint256 result) {
        unchecked {
            // 512-bit multiply [prod1 prod0] = x * y. Compute the product mod 2^256 and mod 2^256 - 1, then use
            // use the Chinese Remainder Theorem to reconstruct the 512 bit result. The result is stored in two 256
            // variables such that product = prod1 * 2^256 + prod0.
            uint256 prod0 = x * y; // Least significant 256 bits of the product
            uint256 prod1; // Most significant 256 bits of the product
            assembly {
                let mm := mulmod(x, y, not(0))
                prod1 := sub(sub(mm, prod0), lt(mm, prod0))
            }

            // Handle non-overflow cases, 256 by 256 division.
            if (prod1 == 0) {
                // Solidity will revert if denominator == 0, unlike the div opcode on its own.
                // The surrounding unchecked block does not change this fact.
                // See https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic.
                return prod0 / denominator;
            }

            // Make sure the result is less than 2^256. Also prevents denominator == 0.
            if (denominator <= prod1) {
                revert MathOverflowedMulDiv();
            }

            ///////////////////////////////////////////////
            // 512 by 256 division.
            ///////////////////////////////////////////////

            // Make division exact by subtracting the remainder from [prod1 prod0].
            uint256 remainder;
            assembly {
                // Compute remainder using mulmod.
                remainder := mulmod(x, y, denominator)

                // Subtract 256 bit number from 512 bit number.
                prod1 := sub(prod1, gt(remainder, prod0))
                prod0 := sub(prod0, remainder)
            }

            // Factor powers of two out of denominator and compute largest power of two divisor of denominator.
            // Always >= 1. See https://cs.stackexchange.com/q/138556/92363.

            uint256 twos = denominator & (0 - denominator);
            assembly {
                // Divide denominator by twos.
                denominator := div(denominator, twos)

                // Divide [prod1 prod0] by twos.
                prod0 := div(prod0, twos)

                // Flip twos such that it is 2^256 / twos. If twos is zero, then it becomes one.
                twos := add(div(sub(0, twos), twos), 1)
            }

            // Shift in bits from prod1 into prod0.
            prod0 |= prod1 * twos;

            // Invert denominator mod 2^256. Now that denominator is an odd number, it has an inverse modulo 2^256 such
            // that denominator * inv = 1 mod 2^256. Compute the inverse by starting with a seed that is correct for
            // four bits. That is, denominator * inv = 1 mod 2^4.
            uint256 inverse = (3 * denominator) ^ 2;

            // Use the Newton-Raphson iteration to improve the precision. Thanks to Hensel's lifting lemma, this also
            // works in modular arithmetic, doubling the correct bits in each step.
            inverse *= 2 - denominator * inverse; // inverse mod 2^8
            inverse *= 2 - denominator * inverse; // inverse mod 2^16
            inverse *= 2 - denominator * inverse; // inverse mod 2^32
            inverse *= 2 - denominator * inverse; // inverse mod 2^64
            inverse *= 2 - denominator * inverse; // inverse mod 2^128
            inverse *= 2 - denominator * inverse; // inverse mod 2^256

            // Because the division is now exact we can divide by multiplying with the modular inverse of denominator.
            // This will give us the correct result modulo 2^256. Since the preconditions guarantee that the outcome is
            // less than 2^256, this is the final result. We don't need to compute the high bits of the result and prod1
            // is no longer required.
            result = prod0 * inverse;
            return result;
        }
    }

    /**
     * @notice Calculates x * y / denominator with full precision, following the selected rounding direction.
     */
    function mulDiv(uint256 x, uint256 y, uint256 denominator, Rounding rounding) internal pure returns (uint256) {
        uint256 result = mulDiv(x, y, denominator);
        if (unsignedRoundsUp(rounding) && mulmod(x, y, denominator) > 0) {
            result += 1;
        }
        return result;
    }

    /**
     * @dev Returns the square root of a number. If the number is not a perfect square, the value is rounded
     * towards zero.
     *
     * Inspired by Henry S. Warren, Jr.'s "Hacker's Delight" (Chapter 11).
     */
    function sqrt(uint256 a) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        // For our first guess, we get the biggest power of 2 which is smaller than the square root of the target.
        //
        // We know that the "msb" (most significant bit) of our target number `a` is a power of 2 such that we have
        // `msb(a) <= a < 2*msb(a)`. This value can be written `msb(a)=2**k` with `k=log2(a)`.
        //
        // This can be rewritten `2**log2(a) <= a < 2**(log2(a) + 1)`
        // → `sqrt(2**k) <= sqrt(a) < sqrt(2**(k+1))`
        // → `2**(k/2) <= sqrt(a) < 2**((k+1)/2) <= 2**(k/2 + 1)`
        //
        // Consequently, `2**(log2(a) / 2)` is a good first approximation of `sqrt(a)` with at least 1 correct bit.
        uint256 result = 1 << (log2(a) >> 1);

        // At this point `result` is an estimation with one bit of precision. We know the true value is a uint128,
        // since it is the square root of a uint256. Newton's method converges quadratically (precision doubles at
        // every iteration). We thus need at most 7 iteration to turn our partial result with one bit of precision
        // into the expected uint128 result.
        unchecked {
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            result = (result + a / result) >> 1;
            return min(result, a / result);
        }
    }

    /**
     * @notice Calculates sqrt(a), following the selected rounding direction.
     */
    function sqrt(uint256 a, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = sqrt(a);
            return result + (unsignedRoundsUp(rounding) && result * result < a ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 2 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     */
    function log2(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 128;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 64;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 32;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 16;
            }
            if (value >> 8 > 0) {
                value >>= 8;
                result += 8;
            }
            if (value >> 4 > 0) {
                value >>= 4;
                result += 4;
            }
            if (value >> 2 > 0) {
                value >>= 2;
                result += 2;
            }
            if (value >> 1 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 2, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log2(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log2(value);
            return result + (unsignedRoundsUp(rounding) && 1 << result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 10 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     */
    function log10(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >= 10 ** 64) {
                value /= 10 ** 64;
                result += 64;
            }
            if (value >= 10 ** 32) {
                value /= 10 ** 32;
                result += 32;
            }
            if (value >= 10 ** 16) {
                value /= 10 ** 16;
                result += 16;
            }
            if (value >= 10 ** 8) {
                value /= 10 ** 8;
                result += 8;
            }
            if (value >= 10 ** 4) {
                value /= 10 ** 4;
                result += 4;
            }
            if (value >= 10 ** 2) {
                value /= 10 ** 2;
                result += 2;
            }
            if (value >= 10 ** 1) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 10, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log10(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log10(value);
            return result + (unsignedRoundsUp(rounding) && 10 ** result < value ? 1 : 0);
        }
    }

    /**
     * @dev Return the log in base 256 of a positive value rounded towards zero.
     * Returns 0 if given 0.
     *
     * Adding one to the result gives the number of pairs of hex symbols needed to represent `value` as a hex string.
     */
    function log256(uint256 value) internal pure returns (uint256) {
        uint256 result = 0;
        unchecked {
            if (value >> 128 > 0) {
                value >>= 128;
                result += 16;
            }
            if (value >> 64 > 0) {
                value >>= 64;
                result += 8;
            }
            if (value >> 32 > 0) {
                value >>= 32;
                result += 4;
            }
            if (value >> 16 > 0) {
                value >>= 16;
                result += 2;
            }
            if (value >> 8 > 0) {
                result += 1;
            }
        }
        return result;
    }

    /**
     * @dev Return the log in base 256, following the selected rounding direction, of a positive value.
     * Returns 0 if given 0.
     */
    function log256(uint256 value, Rounding rounding) internal pure returns (uint256) {
        unchecked {
            uint256 result = log256(value);
            return result + (unsignedRoundsUp(rounding) && 1 << (result << 3) < value ? 1 : 0);
        }
    }

    /**
     * @dev Returns whether a provided rounding mode is considered rounding up for unsigned integers.
     */
    function unsignedRoundsUp(Rounding rounding) internal pure returns (bool) {
        return uint8(rounding) % 2 == 1;
    }
}


// File contracts/Structs.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.19;

enum LienStatus { CURRENT, DELINQUENT, DEFAULTED }
enum Criteria { SIMPLE, PROOF }
enum Side { BID, ASK }

struct Lien {
    address borrower;
    address collection;
    uint256 tokenId;
    address currency;
    uint256 principal;
    uint256 rate;
    uint256 defaultRate;
    uint256 duration;
    uint256 gracePeriod;
    address recipient;
    uint256 fee;
    uint256 startTime;
}

struct Collateral {
    Criteria criteria;
    address collection;
    uint256 identifier;
}

struct FeeTerms {
    address recipient;
    uint256 rate;
}

// ====================================
//            LOAN OFFER
// ====================================

struct LoanOfferTerms {
    address currency;
    uint256 amount;
    uint256 maxAmount;
    uint256 minAmount;
    uint256 rate;
    uint256 defaultRate;
    uint256 duration;
    uint256 gracePeriod;
}

struct LoanOffer {
    Side side;
    address maker;
    address taker;
    Collateral collateral;
    LoanOfferTerms terms;
    FeeTerms fee;
    uint256 expiration;
    uint256 salt;
}

// ====================================
//            MARKET OFFER
// ====================================

struct MarketOfferTerms {
    address currency;
    uint256 amount;
    bool withLoan;
    uint256 borrowAmount;
    bytes32 loanOfferHash;
    uint256 rebate;
}

struct MarketOffer {
    Side side;
    address maker;
    address taker;
    Collateral collateral;
    MarketOfferTerms terms;
    FeeTerms fee;
    uint256 expiration;
    uint256 salt;
}

// ====================================
//              PERMIT
// ====================================

struct Permit {
    address taker;
    address currency;
    uint256 amount;
    bytes32 offerHash;
    uint256 expiration;
    uint256 salt;
}

// ====================================
//              ESCROW
// ====================================

struct Escrow {
    uint256 placeholder;
    uint256 identifier;
    address buyer;
    address seller;
    address collection;
    address currency;
    address recipient;
    uint256 amount;
    uint256 fee;
    uint256 rebate;
    uint256 timestamp;
    uint256 lockTime;
}


// File contracts/interfaces/IEscrowController.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.19;

interface IEscrowController {

    event SellerWhitelisted(
        address indexed maker,
        bool indexed whitelisted
    );

    event EscrowCreated(
        uint256 indexed escrowId,
        Escrow escrow
    );

    event EscrowSettled(
        uint256 indexed escrowId,
        uint256 indexed tokenId
    );

    event EscrowRejected(
        uint256 indexed escrowId,
        bool indexed rebateReturned
    );

    event EscrowClaimed(
        uint256 indexed escrowId
    );

    // // Setters
    // function setLockTime(uint256 time) external;
    // function setWhitelistOnly(bool _whitelistOnly) external;
    // function setWhitelistMaker(address maker, bool whitelisted) external;

    // // Escrow Management
    // function takeListing(Listing calldata listing, bytes calldata signature) external;
    // function settleEscrow(uint256 escrowId, uint256 tokenId, Escrow calldata escrow) external;
    // function rejectEscrow(uint256 escrowId, Escrow calldata escrow) external;
    // function rejectEscrowReturnRebate(uint256 escrowId, Escrow calldata escrow) external;
    // function claimEscrow(uint256 escrowId, Escrow calldata escrow) external;

    // // Getters
    // function hashEscrow(Escrow calldata escrow) external view returns (bytes32 _hash);
}


// File contracts/Escrow.sol

// Original license: SPDX_License_Identifier: UNLICENSED
pragma solidity ^0.8.19;

// import { OfferController } from "./OfferController.sol";
// import { Transfer } from "./Transfer.sol";
// import { Utils } from "./Utils.sol";

// import { IKettleAsset } from "./interfaces/IKettleAsset.sol";
// import { IKettleEscrow } from "./interfaces/IKettleEscrow.sol";

// import { MakerNotWhitelisted, EscrowLocked, InvalidEscrow } from "./Errors.sol";


contract EscrowController is IEscrowController, Initializable, Ownable2StepUpgradeable {

    uint256 public escrowIndex;
    uint256 public lockTime;
    bool public whitelistOnly;

    mapping(address => bool) public whitelist;
    mapping(uint256 => bytes32) public escrows;

    function __EscrowController_init() public initializer {
        escrowIndex = 0;
        lockTime = 7 days;
        whitelistOnly = false;
    }

    // ===============================
    //             SETTERS
    // ===============================

    function setLockTime(uint256 time) external onlyOwner {
        lockTime = time;
    }

    function setWhitelistOnly(bool _whitelistOnly) external onlyOwner {
        whitelistOnly = _whitelistOnly;
    }

    function setWhitelistSeller(address seller, bool whitelisted) external onlyOwner {
        whitelist[seller] = whitelisted;
        emit SellerWhitelisted(seller, whitelisted);
    }

    // ===============================
    //             ESCROW
    // ===============================

    function _openEscrow(
        uint256 placeholder,
        address buyer,
        address seller,
        address collection,
        uint256 identifier,
        address currency,
        uint256 amount,
        address recipient,
        uint256 fee,
        uint256 rebate
    ) internal returns (uint256 escrowId) {
        if (whitelistOnly && !whitelist[seller]) {
            revert("SellerNotWhitelisted");
        }

        Escrow memory escrow = Escrow({
            placeholder: placeholder,
            buyer: buyer,
            seller: seller,
            collection: collection,
            identifier: identifier,
            currency: currency,
            amount: amount,
            recipient: recipient,
            fee: fee,
            rebate: rebate,
            timestamp: block.timestamp,
            lockTime: lockTime
        });

        unchecked {
            escrowId = escrowIndex++;
        }

        escrows[escrowIndex] = _hashEscrow(escrow);

        emit EscrowCreated({
            escrowId: escrowIndex++,
            escrow: escrow
        });
    }

    // function settleEscrow(
    //     uint256 escrowId, 
    //     uint256 tokenId, 
    //     Escrow calldata escrow
    // ) external override onlyOwner validEscrow(escrowId, escrow) {

    //     // mint token to the taker
    //     IERC721(escrow.collection).mint(escrow.buyer, tokenId);

    //     // calculate the net amount received
    //     uint256 netAmount = escrow.amount;
    //     if (escrow.fee > 0) {
    //         uint256 fee = Utils.mulFee(escrow.fee, escrow.amount);
    //         netAmount -= fee;

    //         // transfer fee to the fee recipient
    //         _transfer(
    //             escrow.currency, 
    //             address(this), 
    //             escrow.recipient, 
    //             fee
    //         );
    //     }

    //     // transfer amount and rebate to the maker
    //     _transfer(
    //         escrow.currency,
    //         address(this),
    //         escrow.maker, 
    //         netAmount + escrow.rebate
    //     );

    //     // delete the escrow
    //     delete escrows[escrowId];

    //     emit EscrowSettled({ escrowId: escrowId, tokenId: tokenId });
    // }

    // function rejectEscrow(
    //     uint256 escrowId, 
    //     Escrow calldata escrow
    // ) external override onlyOwner validEscrow(escrowId, escrow) {

    //     // transfer amount and rebate back to the taker
    //     _transfer(
    //         escrow.currency,
    //         address(this),
    //         escrow.taker,
    //         escrow.amount + escrow.rebate
    //     );

    //     // delete the escrow
    //     delete escrows[escrowId];

    //     emit EscrowRejected({ escrowId: escrowId, rebateReturned: false });
    // }

    // function rejectEscrowReturnRebate(
    //     uint256 escrowId,
    //     Escrow calldata escrow
    // ) external override onlyOwner validEscrow(escrowId, escrow) {

    //     // transfer amount back to the taker
    //     _transfer(
    //         escrow.currency,
    //         address(this),
    //         escrow.taker,
    //         escrow.amount
    //     );

    //     // transfer rebate back to the maker
    //     _transfer(
    //         escrow.currency,
    //         address(this),
    //         escrow.maker,
    //         escrow.rebate
    //     );

    //     // delete the escrow
    //     delete escrows[escrowId];

    //     emit EscrowRejected({ escrowId: escrowId, rebateReturned: true });
    // }

    // function claimEscrow(
    //     uint256 escrowId,
    //     Escrow calldata escrow
    // ) external override validEscrow(escrowId, escrow) escrowUnlocked(escrow) {

    //     // transfer amount and rebate back to the taker
    //     _transfer(
    //         escrow.currency,
    //         address(this),
    //         escrow.taker,
    //         escrow.amount + escrow.rebate
    //     );

    //     // delete the escrow
    //     delete escrows[escrowId];

    //     emit EscrowClaimed({ escrowId: escrowId });
    // }

    // ===============================
    //             HELPERS
    // ===============================

    function _calculateRebate(
        uint256 amount,
        uint256 rebate
    ) internal pure returns (uint256){
        return Math.mulDiv(amount, rebate, 10_000);
    }

    function _hashEscrow(Escrow memory escrow) internal pure returns (bytes32 _hash) {
        _hash = keccak256(
            abi.encodePacked(
                escrow.placeholder,
                escrow.identifier,
                escrow.buyer,
                escrow.seller,
                escrow.collection,
                escrow.currency,
                escrow.recipient,
                escrow.amount,
                escrow.fee,
                escrow.rebate,
                escrow.timestamp,
                escrow.lockTime
            )
        );
    }

    // // ===============================
    // //             MODIFIERS
    // // ===============================

    // modifier validEscrow(uint256 escrowId, Escrow memory escrow) {
    //     if (!(escrows[escrowId] == _hashEscrow(escrow))) revert InvalidEscrow();
    //     _;
    // }

    // modifier escrowUnlocked(Escrow memory escrow) {
    //     if(escrow.timestamp + escrow.lockTime > block.timestamp) revert EscrowLocked();
    //     _;
    // }
}


// File contracts/interfaces/IKettle.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.19;

interface IKettle {
    
    function buy(
        MarketOffer calldata offer,
        bytes calldata signature
    ) external returns (uint256);

    function sell(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external returns (uint256);

    function lend(
        LoanOffer calldata offer,
        bytes calldata signature
    ) external returns (uint256);

    function borrow(
        uint256 tokenId,
        uint256 amount,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external returns (uint256);

    // function refinanceLend(
    //     uint256 lienId,
    //     Lien calldata lien,
    //     LoanOffer calldata offer,
    //     bytes calldata signature
    // ) external returns (uint256);

    // function refinanceBorrow(
    //     uint256 lienId,
    //     uint256 amount,
    //     Lien calldata lien,
    //     LoanOffer calldata offer,
    //     bytes calldata signature,
    //     bytes32[] calldata proof
    // ) external returns (uint256);
    
    // function repay(
    //     uint256 lienId,
    //     Lien calldata lien
    // ) external returns (uint256);

    // function claim(
    //     uint256 lienId,
    //     Lien calldata lien
    // ) external;

    // function escrowBuy(
    //     uint256 tokenId,
    //     MarketOffer calldata offer,
    //     bytes calldata signature
    // ) external returns (uint256);
    
    // function escrowSell(
    //     uint256 tokenId,
    //     MarketOffer calldata offer,
    //     bytes calldata signature,
    //     bytes32[] calldata proof
    // ) external returns (uint256);

    // function buyInLien(
    //     uint256 lienId,
    //     Lien calldata lien,
    //     MarketOffer calldata offer,
    //     bytes calldata signature
    // ) external returns (uint256);
    
    // function sellInLien(
    //     uint256 lienId,
    //     Lien calldata lien,
    //     MarketOffer calldata offer,
    //     bytes calldata signature,
    //     bytes32[] calldata proof
    // ) external returns (uint256);

    // function buyWithLoan(
    //     MarketOffer calldata marketOffer,
    //     LoanOffer calldata loanOffer,
    //     bytes calldata marketOfferSignature,
    //     bytes calldata loanOfferSignature
    // ) external returns (uint256);

    // function buyInLienWithLoan(
    //     uint256 lienId,
    //     Lien calldata lien,
    //     MarketOffer calldata marketOffer,
    //     LoanOffer calldata loanOffer,
    //     bytes calldata marketOfferSignature,
    //     bytes calldata loanOfferSignature
    // ) external returns (uint256);
}


// File contracts/interfaces/ILending.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.19;

interface ILending {

    event LienOpened(uint256 lienId, Lien lien);
    event LienClosed(uint256 lienId);
}


// File @openzeppelin/contracts/utils/cryptography/MerkleProof.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (utils/cryptography/MerkleProof.sol)

pragma solidity ^0.8.20;

/**
 * @dev These functions deal with verification of Merkle Tree proofs.
 *
 * The tree and the proofs can be generated using our
 * https://github.com/OpenZeppelin/merkle-tree[JavaScript library].
 * You will find a quickstart guide in the readme.
 *
 * WARNING: You should avoid using leaf values that are 64 bytes long prior to
 * hashing, or use a hash function other than keccak256 for hashing leaves.
 * This is because the concatenation of a sorted pair of internal nodes in
 * the Merkle tree could be reinterpreted as a leaf value.
 * OpenZeppelin's JavaScript library generates Merkle trees that are safe
 * against this attack out of the box.
 */
library MerkleProof {
    /**
     *@dev The multiproof provided is not valid.
     */
    error MerkleProofInvalidMultiproof();

    /**
     * @dev Returns true if a `leaf` can be proved to be a part of a Merkle tree
     * defined by `root`. For this, a `proof` must be provided, containing
     * sibling hashes on the branch from the leaf to the root of the tree. Each
     * pair of leaves and each pair of pre-images are assumed to be sorted.
     */
    function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
        return processProof(proof, leaf) == root;
    }

    /**
     * @dev Calldata version of {verify}
     */
    function verifyCalldata(bytes32[] calldata proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
        return processProofCalldata(proof, leaf) == root;
    }

    /**
     * @dev Returns the rebuilt hash obtained by traversing a Merkle tree up
     * from `leaf` using `proof`. A `proof` is valid if and only if the rebuilt
     * hash matches the root of the tree. When processing the proof, the pairs
     * of leafs & pre-images are assumed to be sorted.
     */
    function processProof(bytes32[] memory proof, bytes32 leaf) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return computedHash;
    }

    /**
     * @dev Calldata version of {processProof}
     */
    function processProofCalldata(bytes32[] calldata proof, bytes32 leaf) internal pure returns (bytes32) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            computedHash = _hashPair(computedHash, proof[i]);
        }
        return computedHash;
    }

    /**
     * @dev Returns true if the `leaves` can be simultaneously proven to be a part of a Merkle tree defined by
     * `root`, according to `proof` and `proofFlags` as described in {processMultiProof}.
     *
     * CAUTION: Not all Merkle trees admit multiproofs. See {processMultiProof} for details.
     */
    function multiProofVerify(
        bytes32[] memory proof,
        bool[] memory proofFlags,
        bytes32 root,
        bytes32[] memory leaves
    ) internal pure returns (bool) {
        return processMultiProof(proof, proofFlags, leaves) == root;
    }

    /**
     * @dev Calldata version of {multiProofVerify}
     *
     * CAUTION: Not all Merkle trees admit multiproofs. See {processMultiProof} for details.
     */
    function multiProofVerifyCalldata(
        bytes32[] calldata proof,
        bool[] calldata proofFlags,
        bytes32 root,
        bytes32[] memory leaves
    ) internal pure returns (bool) {
        return processMultiProofCalldata(proof, proofFlags, leaves) == root;
    }

    /**
     * @dev Returns the root of a tree reconstructed from `leaves` and sibling nodes in `proof`. The reconstruction
     * proceeds by incrementally reconstructing all inner nodes by combining a leaf/inner node with either another
     * leaf/inner node or a proof sibling node, depending on whether each `proofFlags` item is true or false
     * respectively.
     *
     * CAUTION: Not all Merkle trees admit multiproofs. To use multiproofs, it is sufficient to ensure that: 1) the tree
     * is complete (but not necessarily perfect), 2) the leaves to be proven are in the opposite order they are in the
     * tree (i.e., as seen from right to left starting at the deepest layer and continuing at the next layer).
     */
    function processMultiProof(
        bytes32[] memory proof,
        bool[] memory proofFlags,
        bytes32[] memory leaves
    ) internal pure returns (bytes32 merkleRoot) {
        // This function rebuilds the root hash by traversing the tree up from the leaves. The root is rebuilt by
        // consuming and producing values on a queue. The queue starts with the `leaves` array, then goes onto the
        // `hashes` array. At the end of the process, the last hash in the `hashes` array should contain the root of
        // the Merkle tree.
        uint256 leavesLen = leaves.length;
        uint256 proofLen = proof.length;
        uint256 totalHashes = proofFlags.length;

        // Check proof validity.
        if (leavesLen + proofLen != totalHashes + 1) {
            revert MerkleProofInvalidMultiproof();
        }

        // The xxxPos values are "pointers" to the next value to consume in each array. All accesses are done using
        // `xxx[xxxPos++]`, which return the current value and increment the pointer, thus mimicking a queue's "pop".
        bytes32[] memory hashes = new bytes32[](totalHashes);
        uint256 leafPos = 0;
        uint256 hashPos = 0;
        uint256 proofPos = 0;
        // At each step, we compute the next hash using two values:
        // - a value from the "main queue". If not all leaves have been consumed, we get the next leaf, otherwise we
        //   get the next hash.
        // - depending on the flag, either another value from the "main queue" (merging branches) or an element from the
        //   `proof` array.
        for (uint256 i = 0; i < totalHashes; i++) {
            bytes32 a = leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++];
            bytes32 b = proofFlags[i]
                ? (leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++])
                : proof[proofPos++];
            hashes[i] = _hashPair(a, b);
        }

        if (totalHashes > 0) {
            if (proofPos != proofLen) {
                revert MerkleProofInvalidMultiproof();
            }
            unchecked {
                return hashes[totalHashes - 1];
            }
        } else if (leavesLen > 0) {
            return leaves[0];
        } else {
            return proof[0];
        }
    }

    /**
     * @dev Calldata version of {processMultiProof}.
     *
     * CAUTION: Not all Merkle trees admit multiproofs. See {processMultiProof} for details.
     */
    function processMultiProofCalldata(
        bytes32[] calldata proof,
        bool[] calldata proofFlags,
        bytes32[] memory leaves
    ) internal pure returns (bytes32 merkleRoot) {
        // This function rebuilds the root hash by traversing the tree up from the leaves. The root is rebuilt by
        // consuming and producing values on a queue. The queue starts with the `leaves` array, then goes onto the
        // `hashes` array. At the end of the process, the last hash in the `hashes` array should contain the root of
        // the Merkle tree.
        uint256 leavesLen = leaves.length;
        uint256 proofLen = proof.length;
        uint256 totalHashes = proofFlags.length;

        // Check proof validity.
        if (leavesLen + proofLen != totalHashes + 1) {
            revert MerkleProofInvalidMultiproof();
        }

        // The xxxPos values are "pointers" to the next value to consume in each array. All accesses are done using
        // `xxx[xxxPos++]`, which return the current value and increment the pointer, thus mimicking a queue's "pop".
        bytes32[] memory hashes = new bytes32[](totalHashes);
        uint256 leafPos = 0;
        uint256 hashPos = 0;
        uint256 proofPos = 0;
        // At each step, we compute the next hash using two values:
        // - a value from the "main queue". If not all leaves have been consumed, we get the next leaf, otherwise we
        //   get the next hash.
        // - depending on the flag, either another value from the "main queue" (merging branches) or an element from the
        //   `proof` array.
        for (uint256 i = 0; i < totalHashes; i++) {
            bytes32 a = leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++];
            bytes32 b = proofFlags[i]
                ? (leafPos < leavesLen ? leaves[leafPos++] : hashes[hashPos++])
                : proof[proofPos++];
            hashes[i] = _hashPair(a, b);
        }

        if (totalHashes > 0) {
            if (proofPos != proofLen) {
                revert MerkleProofInvalidMultiproof();
            }
            unchecked {
                return hashes[totalHashes - 1];
            }
        } else if (leavesLen > 0) {
            return leaves[0];
        } else {
            return proof[0];
        }
    }

    /**
     * @dev Sorts the pair (a, b) and hashes the result.
     */
    function _hashPair(bytes32 a, bytes32 b) private pure returns (bytes32) {
        return a < b ? _efficientHash(a, b) : _efficientHash(b, a);
    }

    /**
     * @dev Implementation of keccak256(abi.encode(a, b)) that doesn't allocate or expand memory.
     */
    function _efficientHash(bytes32 a, bytes32 b) private pure returns (bytes32 value) {
        /// @solidity memory-safe-assembly
        assembly {
            mstore(0x00, a)
            mstore(0x20, b)
            value := keccak256(0x00, 0x40)
        }
    }
}


// File contracts/interfaces/ILenderReceipt.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.19;

interface ILenderReceipt {
    function ownerOf(uint256 tokenId) external view returns (address);
    function mint(address to, uint256 tokenId) external;
    function burn(uint256 tokenId) external;
}


// File solmate/src/utils/SignedWadMath.sol@v6.2.0

// Original license: SPDX_License_Identifier: MIT
pragma solidity >=0.8.0;

/// @notice Signed 18 decimal fixed point (wad) arithmetic library.
/// @author Solmate (https://github.com/transmissions11/solmate/blob/main/src/utils/SignedWadMath.sol)
/// @author Modified from Remco Bloemen (https://xn--2-umb.com/22/exp-ln/index.html)

/// @dev Will not revert on overflow, only use where overflow is not possible.
function toWadUnsafe(uint256 x) pure returns (int256 r) {
    /// @solidity memory-safe-assembly
    assembly {
        // Multiply x by 1e18.
        r := mul(x, 1000000000000000000)
    }
}

/// @dev Takes an integer amount of seconds and converts it to a wad amount of days.
/// @dev Will not revert on overflow, only use where overflow is not possible.
/// @dev Not meant for negative second amounts, it assumes x is positive.
function toDaysWadUnsafe(uint256 x) pure returns (int256 r) {
    /// @solidity memory-safe-assembly
    assembly {
        // Multiply x by 1e18 and then divide it by 86400.
        r := div(mul(x, 1000000000000000000), 86400)
    }
}

/// @dev Takes a wad amount of days and converts it to an integer amount of seconds.
/// @dev Will not revert on overflow, only use where overflow is not possible.
/// @dev Not meant for negative day amounts, it assumes x is positive.
function fromDaysWadUnsafe(int256 x) pure returns (uint256 r) {
    /// @solidity memory-safe-assembly
    assembly {
        // Multiply x by 86400 and then divide it by 1e18.
        r := div(mul(x, 86400), 1000000000000000000)
    }
}

/// @dev Will not revert on overflow, only use where overflow is not possible.
function unsafeWadMul(int256 x, int256 y) pure returns (int256 r) {
    /// @solidity memory-safe-assembly
    assembly {
        // Multiply x by y and divide by 1e18.
        r := sdiv(mul(x, y), 1000000000000000000)
    }
}

/// @dev Will return 0 instead of reverting if y is zero and will
/// not revert on overflow, only use where overflow is not possible.
function unsafeWadDiv(int256 x, int256 y) pure returns (int256 r) {
    /// @solidity memory-safe-assembly
    assembly {
        // Multiply x by 1e18 and divide it by y.
        r := sdiv(mul(x, 1000000000000000000), y)
    }
}

function wadMul(int256 x, int256 y) pure returns (int256 r) {
    /// @solidity memory-safe-assembly
    assembly {
        // Check for the specific edge case where x == -1 and y == type(int256).min
        // For y == -1 and x == min int256, the second overflow check will catch this.
        // See: https://secure-contracts.com/learn_evm/arithmetic-checks.html#arithmetic-checks-for-int256-multiplication
        if and(eq(x, not(0)), eq(y, 0x8000000000000000000000000000000000000000000000000000000000000000)) {
            revert(0, 0)
        }

        // Store x * y in r for now.
        r := mul(x, y)

        // Equivalent to require(x == 0 || (x * y) / x == y)
        if iszero(or(iszero(x), eq(sdiv(r, x), y))) {
            revert(0, 0)
        }

        // Scale the result down by 1e18.
        r := sdiv(r, 1000000000000000000)
    }
}

function wadDiv(int256 x, int256 y) pure returns (int256 r) {
    /// @solidity memory-safe-assembly
    assembly {
        // Store x * 1e18 in r for now.
        r := mul(x, 1000000000000000000)

        // Equivalent to require(y != 0 && ((x * 1e18) / 1e18 == x))
        if iszero(and(iszero(iszero(y)), eq(sdiv(r, 1000000000000000000), x))) {
            revert(0, 0)
        }

        // Divide r by y.
        r := sdiv(r, y)
    }
}

/// @dev Will not work with negative bases, only use when x is positive.
function wadPow(int256 x, int256 y) pure returns (int256) {
    // Equivalent to x to the power of y because x ** y = (e ** ln(x)) ** y = e ** (ln(x) * y)
    return wadExp((wadLn(x) * y) / 1e18); // Using ln(x) means x must be greater than 0.
}

function wadExp(int256 x) pure returns (int256 r) {
    unchecked {
        // When the result is < 0.5 we return zero. This happens when
        // x <= floor(log(0.5e18) * 1e18) ~ -42e18
        if (x <= -42139678854452767551) return 0;

        // When the result is > (2**255 - 1) / 1e18 we can not represent it as an
        // int. This happens when x >= floor(log((2**255 - 1) / 1e18) * 1e18) ~ 135.
        if (x >= 135305999368893231589) revert("EXP_OVERFLOW");

        // x is now in the range (-42, 136) * 1e18. Convert to (-42, 136) * 2**96
        // for more intermediate precision and a binary basis. This base conversion
        // is a multiplication by 1e18 / 2**96 = 5**18 / 2**78.
        x = (x << 78) / 5**18;

        // Reduce range of x to (-½ ln 2, ½ ln 2) * 2**96 by factoring out powers
        // of two such that exp(x) = exp(x') * 2**k, where k is an integer.
        // Solving this gives k = round(x / log(2)) and x' = x - k * log(2).
        int256 k = ((x << 96) / 54916777467707473351141471128 + 2**95) >> 96;
        x = x - k * 54916777467707473351141471128;

        // k is in the range [-61, 195].

        // Evaluate using a (6, 7)-term rational approximation.
        // p is made monic, we'll multiply by a scale factor later.
        int256 y = x + 1346386616545796478920950773328;
        y = ((y * x) >> 96) + 57155421227552351082224309758442;
        int256 p = y + x - 94201549194550492254356042504812;
        p = ((p * y) >> 96) + 28719021644029726153956944680412240;
        p = p * x + (4385272521454847904659076985693276 << 96);

        // We leave p in 2**192 basis so we don't need to scale it back up for the division.
        int256 q = x - 2855989394907223263936484059900;
        q = ((q * x) >> 96) + 50020603652535783019961831881945;
        q = ((q * x) >> 96) - 533845033583426703283633433725380;
        q = ((q * x) >> 96) + 3604857256930695427073651918091429;
        q = ((q * x) >> 96) - 14423608567350463180887372962807573;
        q = ((q * x) >> 96) + 26449188498355588339934803723976023;

        /// @solidity memory-safe-assembly
        assembly {
            // Div in assembly because solidity adds a zero check despite the unchecked.
            // The q polynomial won't have zeros in the domain as all its roots are complex.
            // No scaling is necessary because p is already 2**96 too large.
            r := sdiv(p, q)
        }

        // r should be in the range (0.09, 0.25) * 2**96.

        // We now need to multiply r by:
        // * the scale factor s = ~6.031367120.
        // * the 2**k factor from the range reduction.
        // * the 1e18 / 2**96 factor for base conversion.
        // We do this all at once, with an intermediate result in 2**213
        // basis, so the final right shift is always by a positive amount.
        r = int256((uint256(r) * 3822833074963236453042738258902158003155416615667) >> uint256(195 - k));
    }
}

function wadLn(int256 x) pure returns (int256 r) {
    unchecked {
        require(x > 0, "UNDEFINED");

        // We want to convert x from 10**18 fixed point to 2**96 fixed point.
        // We do this by multiplying by 2**96 / 10**18. But since
        // ln(x * C) = ln(x) + ln(C), we can simply do nothing here
        // and add ln(2**96 / 10**18) at the end.

        /// @solidity memory-safe-assembly
        assembly {
            r := shl(7, lt(0xffffffffffffffffffffffffffffffff, x))
            r := or(r, shl(6, lt(0xffffffffffffffff, shr(r, x))))
            r := or(r, shl(5, lt(0xffffffff, shr(r, x))))
            r := or(r, shl(4, lt(0xffff, shr(r, x))))
            r := or(r, shl(3, lt(0xff, shr(r, x))))
            r := or(r, shl(2, lt(0xf, shr(r, x))))
            r := or(r, shl(1, lt(0x3, shr(r, x))))
            r := or(r, lt(0x1, shr(r, x)))
        }

        // Reduce range of x to (1, 2) * 2**96
        // ln(2^k * x) = k * ln(2) + ln(x)
        int256 k = r - 96;
        x <<= uint256(159 - k);
        x = int256(uint256(x) >> 159);

        // Evaluate using a (8, 8)-term rational approximation.
        // p is made monic, we will multiply by a scale factor later.
        int256 p = x + 3273285459638523848632254066296;
        p = ((p * x) >> 96) + 24828157081833163892658089445524;
        p = ((p * x) >> 96) + 43456485725739037958740375743393;
        p = ((p * x) >> 96) - 11111509109440967052023855526967;
        p = ((p * x) >> 96) - 45023709667254063763336534515857;
        p = ((p * x) >> 96) - 14706773417378608786704636184526;
        p = p * x - (795164235651350426258249787498 << 96);

        // We leave p in 2**192 basis so we don't need to scale it back up for the division.
        // q is monic by convention.
        int256 q = x + 5573035233440673466300451813936;
        q = ((q * x) >> 96) + 71694874799317883764090561454958;
        q = ((q * x) >> 96) + 283447036172924575727196451306956;
        q = ((q * x) >> 96) + 401686690394027663651624208769553;
        q = ((q * x) >> 96) + 204048457590392012362485061816622;
        q = ((q * x) >> 96) + 31853899698501571402653359427138;
        q = ((q * x) >> 96) + 909429971244387300277376558375;
        /// @solidity memory-safe-assembly
        assembly {
            // Div in assembly because solidity adds a zero check despite the unchecked.
            // The q polynomial is known not to have zeros in the domain.
            // No scaling required because p is already 2**96 too large.
            r := sdiv(p, q)
        }

        // r is in the range (0, 0.125) * 2**96

        // Finalization, we need to:
        // * multiply by the scale factor s = 5.549…
        // * add ln(2**96 / 10**18)
        // * add k * ln(2)
        // * multiply by 10**18 / 2**96 = 5**18 >> 78

        // mul s * 5e18 * 2**96, base is now 5**18 * 2**192
        r *= 1677202110996718588342820967067443963516166;
        // add ln(2) * k * 5e18 * 2**192
        r += 16597577552685614221487285958193947469193820559219878177908093499208371 * k;
        // add ln(2**96 / 10**18) * 5e18 * 2**192
        r += 600920179829731861736702779321621459595472258049074101567377883020018308;
        // base conversion: mul 2**18 / 2**192
        r >>= 174;
    }
}

/// @dev Will return 0 instead of reverting if y is zero.
function unsafeDiv(int256 x, int256 y) pure returns (int256 r) {
    /// @solidity memory-safe-assembly
    assembly {
        // Divide x by y.
        r := sdiv(x, y)
    }
}


// File contracts/lib/CompoundInterest.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.19;

library CompoundInterest {
    int256 private constant _YEAR_WAD = 365 days * 1e18;
    uint256 private constant _BASIS_POINTS = 10_000;

    function currentDebtAmount(
      uint256 timestamp,
      uint256 principal,
      uint256 startTime,
      uint256 duration,
      uint256 fee,
      uint256 rate,
      uint256 defaultRate
    ) internal pure returns (
        uint256 debt,
        uint256 feeInterest,
        uint256 lenderInterest
    ) {
        // compute debtWithFee
        uint256 debtWithFee = computeCurrentDebt(
            principal, 
            fee,
            startTime, 
            timestamp
        );

        // lien is past tenor
        uint256 debtWithRate;
        if (timestamp > startTime + duration) {
            debtWithRate = computeCurrentDebt(
                principal, 
                rate,
                startTime, 
                startTime + duration
            );

            debtWithRate = computeCurrentDebt(
                debtWithRate, 
                defaultRate, 
                startTime + duration, 
                timestamp
            );
        } else {
            debtWithRate = computeCurrentDebt(
                principal, 
                rate, 
                startTime, 
                timestamp
            );
        }

        feeInterest = debtWithFee - principal;
        lenderInterest = debtWithRate - principal;
        debt = principal + feeInterest + lenderInterest;
    }

    /**
     * @dev Computes the current debt of a borrow given the last time it was touched and the last computed debt.
     * @param amount Principal in ETH
     * @param startTime Start time of the loan
     * @param rate Interest rate (in bips)
     * @dev Formula: https://www.desmos.com/calculator/l6omp0rwnh
     */
    function computeCurrentDebt(
        uint256 amount,
        uint256 rate,
        uint256 startTime,
        uint256 endTime
    ) public pure returns (uint256) {
        uint256 loanTime = endTime - startTime;
        int256 yearsWad = wadDiv(int256(loanTime) * 1e18, _YEAR_WAD);
        return uint256(wadMul(int256(amount), wadExp(wadMul(yearsWad, bipsToSignedWads(rate)))));
    }

    /**
     * @dev Converts an integer bips value to a signed wad value.
     */
    function bipsToSignedWads(uint256 bips) public pure returns (int256) {
        return int256((bips * 1e18) / _BASIS_POINTS);
    }
}


// File contracts/lib/Distributions.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.19;


/**
 * @title Kettle Loan Payment Distribution Library
 * @author diamondjim.eth
 * @notice Distributes payments from payers to payees based on predefined tranches
 */
library Distributions {
    using SafeERC20 for IERC20;
    
    /**
     * @notice Distributes loan payments to lenders and recipients.
     *
     * @param currency The address of the currency in which payments are made.
     * @param amount The total amount to distribute, which may include debt, principal, past interest, past fee, current interest, and current fee.
     * @param debt The outstanding debt to be covered by the distribution.
     * @param lenderDebt Total amount owed to lender
     * @param feeDebt Total amount owed to fee recipient
     * @param lender The address of the lender.
     * @param feeRecipient The address of the fee recipient.
     * @param primaryPayer The primary payer responsible for covering the outstanding debt.
     * @param residualPayer The payer responsible for covering the residual amount.
     * @param residualRecipient The recipient of the residual amount.
     *
     * Requirements:
     * - The provided amounts and addresses must align with the specified parameters.
     *
     * @dev The function distributes the provided amount among lenders and recipients based on predefined tranches. Tranches include principal, interest, and fee components.
     * It takes into account the outstanding debt and ensures proper distribution to both the primary and residual payers.
     * The function calculates and transfers the amounts accordingly, considering different scenarios based on the relationship between the total amount and the tranches.
     */
    function distributeLoanPayments(
        address currency,
        uint256 amount,
        uint256 debt,
        uint256 lenderDebt,
        uint256 feeDebt,
        address lender,
        address feeRecipient,
        address primaryPayer,
        address residualPayer,
        address residualRecipient
    ) internal {
        
        if (amount < debt) {
            // +-------------------------------------------------+
            // |                                      amount     |
            // |----------------------------------|---↓----------|
            // |        principal + interest      |   fee        |
            // +-------------------------------------------------+

            if (amount > lenderDebt) {
                _transferCurrency(currency, primaryPayer, lender, lenderDebt);

                uint256 feePayoff = amount - lenderDebt;
                uint256 residualFeePayoff = feeDebt - feePayoff;

                _transferCurrency(currency, primaryPayer, feeRecipient, feePayoff);
                _transferCurrency(currency, residualPayer, feeRecipient, residualFeePayoff);
            }

            // +-------------------------------------------------+
            // |        amount                    |              |
            // |--------↓-------------------------|--------------|
            // |        principal + interest      |   fee        |
            // +-------------------------------------------------+

            else {
                _transferCurrency(currency, primaryPayer, lender, amount);

                uint256 residualPayoff = lenderDebt - amount;
                _transferCurrency(currency, residualPayer, lender, residualPayoff);
                _transferCurrency(currency, residualPayer, feeRecipient, feeDebt);
            }

        } else {
            uint256 netPrincipalReceived = amount - debt;
            _transferCurrency(currency, primaryPayer, residualRecipient, netPrincipalReceived);
            _transferCurrency(currency, primaryPayer, lender, lenderDebt);
            _transferCurrency(currency, primaryPayer, feeRecipient, feeDebt);
        }
    }

    function _transferCurrency(
        address currency,
        address from,
        address to,
        uint256 amount
    ) internal {
        if (from == to || amount == 0) return;
        else IERC20(currency).safeTransferFrom(from, to, amount);
    }
}


// File contracts/Lending.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.19;




contract Lending is ILending, Initializable {    
    ILenderReceipt public LENDER_RECEIPT;
    uint256 public lienIndex;
    
    mapping(uint256 => bytes32) public liens;

    function __Lending_init(address receipt) public initializer {
        lienIndex = 0;
        LENDER_RECEIPT = ILenderReceipt(receipt);
    }

    function _openLien(
        address lender,
        address borrower,
        address collection,
        uint256 tokenId,
        address currency,
        uint256 principal,
        uint256 rate,
        uint256 defaultRate,
        uint256 duration,
        uint256 gracePeriod,
        address recipient,
        uint256 fee
    ) internal returns (uint256 lienId) {

        Lien memory lien = Lien({
            borrower: borrower,
            collection: collection,
            tokenId: tokenId,
            currency: currency,
            principal: principal,
            rate: rate,
            defaultRate: defaultRate,
            duration: duration,
            gracePeriod: gracePeriod,
            recipient: recipient,
            fee: fee,
            startTime: block.timestamp
        });

        unchecked {
            lienId = lienIndex++;
        }

        liens[lienId] = _hashLien(lien);
        LENDER_RECEIPT.mint(lender, lienId);

        emit LienOpened(lienId, lien);
    }

    function _closeLien(uint256 lienId) internal {
        LENDER_RECEIPT.burn(lienId);
        delete liens[lienId];

        emit LienClosed(lienId);
    }

    function _transferPayments(
        address currency,
        uint256 amount,
        uint256 debt,
        uint256 lenderDebt,
        uint256 feeDebt,
        address lender,
        address feeRecipient,
        address primaryPayer,
        address residualPayer,
        address residualRecipient
    ) internal {
        Distributions.distributeLoanPayments(
            currency,
            amount,
            debt,
            lenderDebt,
            feeDebt,
            lender,
            feeRecipient,
            primaryPayer,
            residualPayer,
            residualRecipient
        );
    }

    function hashLien(Lien calldata lien) external pure returns (bytes32) {
        return _hashLien(lien);
    }

    function _hashLien(Lien memory lien) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(
            lien.borrower,
            lien.collection,
            lien.tokenId,
            lien.currency,
            lien.principal,
            lien.rate,
            lien.defaultRate,
            lien.duration,
            lien.gracePeriod,
            lien.recipient,
            lien.fee,
            lien.startTime
        ));
    }

    function currentLender(uint256 lienId) public view returns (address) {
        return _currentLender(lienId);
    }

    function _currentLender(uint256 lienId) internal view returns (address) {
        return LENDER_RECEIPT.ownerOf(lienId);
    }

    function computeDebt(Lien memory lien) external view returns (uint256 debt, uint256 fee, uint256 interest) {
        return _computeDebt(lien);
    }

    function computeDebtAtTimestamp(Lien memory lien, uint256 timestamp) external pure returns (uint256 debt, uint256 fee, uint256 interest) {
        return _computeDebt(lien, timestamp);
    }

    function _computeDebt(Lien memory lien) internal view returns (uint256 debt, uint256 fee, uint256 interest) {
        return _computeDebt(lien, block.timestamp);
    }

    function _computeDebt(Lien memory lien, uint256 timestamp) internal pure returns (uint256 debt, uint256 fee, uint256 interest) {
        return CompoundInterest.currentDebtAmount(
            timestamp, 
            lien.principal, 
            lien.startTime, 
            lien.duration, 
            lien.fee, 
            lien.rate, 
            lien.defaultRate
        );
    }

    modifier lienIsValid(uint256 lienId, Lien calldata lien) {
        if (!_validateLien(lienId, lien)) {
            revert("InvalidLien");
        }
        _;
    }

    modifier lienIsCurrent(Lien calldata lien) {
        if (_lienIsDefaulted(lien)) {
            revert("LienIsDefaulted");
        }
        _;
    }

    function _validateLien(
        uint256 lienId,
        Lien calldata lien
    ) internal view returns (bool) {
        return liens[lienId] == _hashLien(lien);
    }

    function _lienIsDefaulted(
        Lien calldata lien
    ) internal view returns (bool) {
        return (lien.startTime + lien.duration + lien.gracePeriod) < block.timestamp;
    }
}


// File contracts/interfaces/IOfferController.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.19;

interface IOfferController {

    event OfferCancelled(
        address indexed operator,
        address indexed user,
        uint256 indexed salt
    );

    event NonceIncremented(
        address indexed user,
        uint256 indexed nonce
    );

    function incrementNonce() external;
    function cancelOffer(uint256 salt) external;
    function cancelOffers(uint256[] calldata salts) external;
    function cancelOffersForUser(address user, uint256[] calldata salts) external;
}


// File @openzeppelin/contracts/interfaces/IERC1271.sol@v5.0.2

// Original license: SPDX_License_Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (interfaces/IERC1271.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC1271 standard signature validation method for
 * contracts as defined in https://eips.ethereum.org/EIPS/eip-1271[ERC-1271].
 */
interface IERC1271 {
    /**
     * @dev Should return whether the signature provided is valid for the provided data
     * @param hash      Hash of the data to be signed
     * @param signature Signature byte array associated with _data
     */
    function isValidSignature(bytes32 hash, bytes memory signature) external view returns (bytes4 magicValue);
}


// File contracts/Signatures.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.19;


error InvalidSignature();
error InvalidVParameter();
error ERC6492DeployFailed(bytes err);

contract Signatures is Initializable {
    bytes32 private constant _ERC6492_DETECTION_SUFFIX = 0x6492649264926492649264926492649264926492649264926492649264926492;

    bytes32 private _EIP_712_DOMAIN_TYPEHASH;
    
    bytes32 private _COLLATERAL_TYPEHASH;
    bytes32 private _FEE_TERMS_TYPEHASH;

    bytes32 private _LOAN_OFFER_TERMS_TYPEHASH;
    bytes32 private _LOAN_OFFER_TYPEHASH;

    bytes32 private _MARKET_OFFER_TERMS_TYPEHASH;
    bytes32 private _MARKET_OFFER_TYPEHASH;

    bytes32 private _PERMIT_TYPEHASH;

    string private constant _NAME = "Kettle";
    string private constant _VERSION = "1";

    mapping(address => uint256) public nonces;
    uint256[50] private _gap;

    // @custom:oz-upgrades-unsafe-allow state-variable-immutable
    function __Signatures_init() internal initializer {
        (
            _EIP_712_DOMAIN_TYPEHASH,
            _COLLATERAL_TYPEHASH,
            _FEE_TERMS_TYPEHASH,
            _LOAN_OFFER_TERMS_TYPEHASH,
            _LOAN_OFFER_TYPEHASH,
            _MARKET_OFFER_TERMS_TYPEHASH,
            _MARKET_OFFER_TYPEHASH,
            _PERMIT_TYPEHASH
        ) = _createTypeHashes();
    }

    function hashLoanOffer(LoanOffer calldata offer) external view returns (bytes32) {
        return _hashLoanOffer(offer);
    }

    function hashMarketOffer(MarketOffer calldata offer) external view returns (bytes32) {
        return _hashMarketOffer(offer);
    }

    function hashPermit(Permit calldata permit) external view returns (bytes32) {
        return _hashPermit(permit);
    }

    function _createTypeHashes()
        internal
        pure
        returns (
            bytes32 eip712DomainTypehash,
            bytes32 collateralTypehash,
            bytes32 feeTermsTypehash,
            bytes32 loanOfferTermsTypehash,
            bytes32 loanOfferTypehash,
            bytes32 marketOfferTermsTypehash,
            bytes32 marketOfferTypehash,
            bytes32 permitTypehash
        ) 
    {
        eip712DomainTypehash = keccak256(
            bytes.concat(
                "EIP712Domain(",
                "string name,",
                "string version,",
                "uint256 chainId,",
                "address verifyingContract",
                ")"
            )
        );

        bytes memory collateralTypestring = bytes.concat(
            "Collateral(",
            "uint8 criteria,",
            "address collection,",
            "uint256 identifier",
            ")"
        );

        collateralTypehash = keccak256(collateralTypestring);

        bytes memory feeTermsTypestring = bytes.concat(
            "FeeTerms(",
            "address recipient,",
            "uint256 rate",
            ")"
        );

        feeTermsTypehash = keccak256(feeTermsTypestring);

        bytes memory loanOfferTermsTypestring = bytes.concat(
            "LoanOfferTerms(",
            "address currency,",
            "uint256 amount,",
            "uint256 maxAmount,",
            "uint256 minAmount,",
            "uint256 rate,",
            "uint256 defaultRate,",
            "uint256 duration,",
            "uint256 gracePeriod",
            ")"
        );

        loanOfferTermsTypehash = keccak256(loanOfferTermsTypestring);

        loanOfferTypehash = keccak256(
            bytes.concat(
                "LoanOffer(",
                "uint8 side,",
                "address maker,",
                "address taker,",
                "Collateral collateral,",
                "LoanOfferTerms terms,",
                "FeeTerms fee,",
                "uint256 expiration,",
                "uint256 salt,",
                "uint256 nonce",
                ")",
                collateralTypestring,
                feeTermsTypestring,
                loanOfferTermsTypestring
            )
        );

        bytes memory marketOfferTermsTypestring = bytes.concat(
            "MarketOfferTerms(",
            "address currency,",
            "uint256 amount,",
            "bool withLoan,",
            "uint256 borrowAmount,",
            "bytes32 loanOfferHash,",
            "uint256 rebate",
            ")"
        );

        marketOfferTermsTypehash = keccak256(marketOfferTermsTypestring);

        marketOfferTypehash = keccak256(
            bytes.concat(
                "MarketOffer(",
                "uint8 side,",
                "address maker,",
                "address taker,",
                "Collateral collateral,",
                "MarketOfferTerms terms,",
                "FeeTerms fee,",
                "uint256 expiration,",
                "uint256 salt,",
                "uint256 nonce",
                ")",
                collateralTypestring,
                feeTermsTypestring,
                marketOfferTermsTypestring
            )
        );

        permitTypehash = keccak256(
            bytes.concat(
                "Permit(",
                "address taker,",
                "address currency,",
                "uint256 amount,",
                "bytes32 offerHash,",
                "uint256 expiration,",
                "uint256 salt,",
                "uint256 nonce",
                ")"
            )
        );
    }

    function _hashDomain(
        bytes32 eip712DomainTypehash,
        bytes32 nameHash,
        bytes32 versionHash
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    eip712DomainTypehash,
                    nameHash,
                    versionHash,
                    block.chainid,
                    address(this)
                )
            );
    }

    function _hashCollateral(
        Collateral calldata collateral
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _COLLATERAL_TYPEHASH,
                    collateral.criteria,
                    collateral.collection,
                    collateral.identifier
                )
            );
    }

    function _hashFee(
        FeeTerms calldata fee
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _FEE_TERMS_TYPEHASH,
                    fee.recipient,
                    fee.rate
                )
            );
    }

    function _hashLoanOfferTerms(
        LoanOfferTerms calldata terms
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _LOAN_OFFER_TERMS_TYPEHASH,
                    terms.currency,
                    terms.amount,
                    terms.maxAmount,
                    terms.minAmount,
                    terms.rate,
                    terms.defaultRate,
                    terms.duration,
                    terms.gracePeriod
                )
            );
    }

    function _hashLoanOffer(
        LoanOffer calldata offer
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _LOAN_OFFER_TYPEHASH,
                    offer.side,
                    offer.maker,
                    offer.taker,
                    _hashCollateral(offer.collateral),
                    _hashLoanOfferTerms(offer.terms),
                    _hashFee(offer.fee),
                    offer.expiration,
                    offer.salt,
                    nonces[offer.maker]
                )
            );
    }

    function _hashMarketOfferTerms(
        MarketOfferTerms calldata terms
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _MARKET_OFFER_TERMS_TYPEHASH,
                    terms.currency,
                    terms.amount,
                    terms.withLoan,
                    terms.borrowAmount,
                    terms.loanOfferHash,
                    terms.rebate
                )
            );
    }

    function _hashMarketOffer(
        MarketOffer calldata offer
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _MARKET_OFFER_TYPEHASH,
                    offer.side,
                    offer.maker,
                    offer.taker,
                    _hashCollateral(offer.collateral),
                    _hashMarketOfferTerms(offer.terms),
                    _hashFee(offer.fee),
                    offer.expiration,
                    offer.salt,
                    nonces[offer.maker]
                )
            );
    }

    function _hashPermit(
        Permit calldata permit
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    _PERMIT_TYPEHASH,
                    permit.taker,
                    permit.currency,
                    permit.amount,
                    permit.offerHash,
                    permit.expiration,
                    permit.salt,
                    nonces[permit.taker]
                )
            );
    }

    function _hashToSign(bytes32 hash) internal view returns (bytes32) {
        bytes32 domain = _hashDomain(
            _EIP_712_DOMAIN_TYPEHASH,
            keccak256(bytes(_NAME)),
            keccak256(bytes(_VERSION))
        );

        return keccak256(abi.encodePacked(bytes2(0x1901), domain, hash));
    }

    function _verifyOfferAuthorization(
        bytes32 offerHash,
        address signer,
        bytes calldata signature
    ) internal {
        bytes32 r;
        bytes32 s;
        uint8 v;
        bytes memory sigToValidate;

        bytes32 hashToSign = _hashToSign(offerHash);

        // The order here is strictly defined in https://eips.ethereum.org/EIPS/eip-6492
        // - ERC-6492 suffix check and verification first, while being permissive in case 
        //   the contract is already deployed; if the contract is deployed we will check 
        //   the sig against the deployed version, this allows 6492 signatures to still 
        //   be validated while taking into account potential key rotation
        // - ERC-1271 verification if there's contract code
        // - finally, ecrecover

        bool isCounterfactual = bytes32(signature[signature.length-32:signature.length]) == _ERC6492_DETECTION_SUFFIX;

        if (isCounterfactual) {
            address create2Factory;
            bytes memory factoryCalldata;

            // solhint-disable-next-line max-line-length
            (create2Factory, factoryCalldata, sigToValidate) = abi.decode(signature[0:signature.length-32], (address, bytes, bytes));

            // solhint-disable-next-line explicit-types
            uint contractCodeLen = address(signer).code.length;
            if (contractCodeLen == 0) {

                // solhint-disable-next-line avoid-low-level-calls
                (bool success, bytes memory err) = create2Factory.call(factoryCalldata);
                if (!success) {
                    revert ERC6492DeployFailed(err);
                }
            }
        } else {
            sigToValidate = signature;
        }

        if (address(signer).code.length > 0) {
            
            bytes4 magicValue = IERC1271(signer).isValidSignature(
                hashToSign,
                sigToValidate
            );

            if (magicValue != IERC1271(signer).isValidSignature.selector) {
                revert InvalidSignature();
            }

            return;
        }

        // solhint-disable-next-line
        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 0x20))
            v := shr(248, calldataload(add(signature.offset, 0x40)))
        }

        _verify(signer, hashToSign, v, r, s);
    }

    /**
     * @notice Verify signature of digest
     * @param signer Address of expected signer
     * @param digest Signature digest
     * @param v v parameter
     * @param r r parameter
     * @param s s parameter
     */
    function _verify(
        address signer,
        bytes32 digest,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal pure {

        if (v != 27 && v != 28) {
            revert InvalidVParameter();
        }

        address recoveredSigner = ecrecover(digest, v, r, s);
        if (recoveredSigner == address(0) || signer != recoveredSigner) {
            revert InvalidSignature();
        }
    }
}


// File contracts/OfferController.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.19;



contract OfferController is IOfferController, Initializable, Ownable2StepUpgradeable, Signatures {
    uint256 private constant _MAX_RATE = 100_000;

    mapping(address => mapping(uint256 => uint256)) public cancelledOrFulfilled;
    mapping(bytes32 => uint256) private _amountTaken;
   
    uint256[50] private _gap;

    function __OfferController_init() public initializer {
        __Signatures_init();
    }

    function amountTaken(bytes32 offerHash) external view returns (uint256) {
        return _amountTaken[offerHash];
    }

    function _takeMarketOffer(
        MarketOffer calldata offer,
        bytes calldata signature
    ) internal returns (bytes32 _hash) {
        if (offer.terms.withLoan) {
            if (offer.terms.amount < offer.terms.borrowAmount) {
                revert("BidCannotBorrow");
            }
        }

        _hash = _hashMarketOffer(offer);
        _validateOffer(_hash, offer.maker, offer.expiration, offer.salt, signature);

        cancelledOrFulfilled[offer.maker][offer.salt] = 1;
    }

    function _takeLoanOffer(
        LoanOffer calldata offer,
        uint256 amount,
        bytes calldata signature
    ) internal returns (bytes32 _hash) {
        if (offer.terms.rate > _MAX_RATE || offer.terms.defaultRate > _MAX_RATE) {
            revert("InvalidRate");
        }

        _hash = _hashLoanOffer(offer);
        _validateOffer(_hash, offer.maker, offer.expiration, offer.salt, signature);

        // check if borrowing from bid
        if (offer.side == Side.BID) {
            if (
                amount > offer.terms.maxAmount ||
                amount < offer.terms.minAmount
            ) {
                revert("InvalidLoanAmount");
            }

            uint256 __amountTaken = _amountTaken[_hash];
            if (offer.terms.amount - __amountTaken < amount) {
                revert("InsufficientOffer");
            }

            unchecked {
                _amountTaken[_hash] = __amountTaken + amount;
            }
        } else {
            cancelledOrFulfilled[offer.maker][offer.salt] = 1;
        }
    }

    function _verifyPermit(
        Permit calldata permit,
        bytes32 offerHash,
        bytes calldata signature
    ) internal {
        if (permit.offerHash != offerHash) {
            revert("InvalidPermitOfferHash");
        }

        bytes32 _hash = _hashPermit(permit);
        _validateOffer(_hash, permit.taker, permit.expiration, permit.salt, signature);

        cancelledOrFulfilled[permit.taker][permit.salt] = 1;
    }

    function _validateOffer(
        bytes32 offerHash,
        address signer,
        uint256 expiration,
        uint256 salt,
        bytes calldata signature
    ) internal {
        _verifyOfferAuthorization(offerHash, signer, signature);

        if (expiration < block.timestamp) {
            revert("OfferExpired");
        }
        if (cancelledOrFulfilled[signer][salt] == 1) {
            revert("OfferUnavailable");
        }
    }

    /** 
     * @notice Cancels offer salt for caller
     * @param salt Unique offer salt
    */
    function cancelOffer(uint256 salt) external override {
        _cancelOffer(msg.sender, msg.sender, salt);
    }

    /**
     * @notice Cancels offers in bulk for caller
     * @param salts List of offer salts
     */
    function cancelOffers(uint256[] calldata salts) external override {
        uint256 saltsLength = salts.length;
        for (uint256 i; i < saltsLength; ) {
            _cancelOffer(msg.sender, msg.sender, salts[i]);
            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice Cancels offers in bulk for caller
     * @param salts List of offer salts
     */
    function cancelOffersForUser(address user, uint256[] calldata salts) external override onlyOwner {
        uint256 saltsLength = salts.length;
        for (uint256 i; i < saltsLength; ) {
            _cancelOffer(msg.sender, user, salts[i]);
            unchecked {
                ++i;
            }
        }
    }

    /// @notice Cancels all offers by incrementing caller nonce
    function incrementNonce() external override {
        _incrementNonce(msg.sender);
    }

    /**
     * @dev Cancel offer by user and salt
     * @param user Address of user
     * @param salt Unique offer salt
     */
    function _cancelOffer(address operator, address user, uint256 salt) private {
        cancelledOrFulfilled[user][salt] = 1;
        emit OfferCancelled(operator, user, salt);
    }

    /**
     * @dev Cancel all orders by incrementing the user nonce
     * @param user Address of user
     */
    function _incrementNonce(address user) internal {
        emit NonceIncremented(user, ++nonces[user]);
    }
}


// File contracts/Kettle.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.19;









contract Kettle is IKettle, Initializable, Ownable2StepUpgradeable, OfferController, Lending, EscrowController, ERC721Holder {
    using SafeERC20 for IERC20;

    function initialize(address lenderReceipt, address owner) public initializer {
        __Lending_init(lenderReceipt);
        __OfferController_init();
        __EscrowController_init();

        __Ownable2Step_init();
        _transferOwnership(owner);
    }

    function buy(
        MarketOffer calldata offer,
        bytes calldata signature
    ) external requireAsk(offer.side) returns (uint256 netAmount) {

        _takeMarketOffer(offer, signature);

        netAmount = _market(
            msg.sender,
            offer.maker,
            offer.terms.currency,
            offer.terms.amount,
            offer.collateral.collection,
            offer.collateral.identifier,
            offer.fee.recipient,
            offer.fee.rate
        );
    }

    function buyWithPermit(
        MarketOffer calldata offer,
        Permit calldata permit,
        bytes calldata signature,
        bytes calldata permitSignature
    ) external requireAsk(offer.side) returns (uint256 netAmount) {

        bytes32 offerHash = _takeMarketOffer(offer, signature);
        _verifyPermit(permit, offerHash, permitSignature);

        netAmount = _market(
            permit.taker,
            offer.maker,
            offer.terms.currency,
            offer.terms.amount,
            offer.collateral.collection,
            offer.collateral.identifier,
            offer.fee.recipient,
            offer.fee.rate
        );
    }

    function sell(
        uint256 tokenId,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireNakedBid(offer.side, offer.terms.withLoan) returns (uint256 netAmount) {

        _takeMarketOffer(offer, signature);
        
        _verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            tokenId,
            proof
        );

        netAmount = _market(
            offer.maker,
            msg.sender,
            offer.terms.currency,
            offer.terms.amount,
            offer.collateral.collection,
            tokenId,
            offer.fee.recipient,
            offer.fee.rate
        );
    }

    function lend(
        LoanOffer calldata offer,
        bytes calldata signature
    ) external requireAsk(offer.side) returns (uint256 lienId) 
    {
        _takeLoanOffer(offer, 0, signature);

        lienId = _lend(
            msg.sender, 
            offer.maker, 
            offer.collateral.collection, 
            offer.collateral.identifier,
            offer.terms.currency, 
            offer.terms.amount,
            offer.terms.rate, 
            offer.terms.defaultRate, 
            offer.terms.duration, 
            offer.terms.gracePeriod, 
            offer.fee.recipient, 
            offer.fee.rate
        );
    }

    function lendWithPermit(
        LoanOffer calldata offer,
        Permit calldata permit,
        bytes calldata signature,
        bytes calldata permitSignature
    ) public virtual requireAsk(offer.side) returns (uint256 lienId) {

        bytes32 offerHash = _takeLoanOffer(offer, 0, signature);
        _verifyPermit(permit, offerHash, permitSignature);

        lienId = _lend(
            permit.taker, 
            offer.maker, 
            offer.collateral.collection, 
            offer.collateral.identifier,
            offer.terms.currency, 
            offer.terms.amount,
            offer.terms.rate, 
            offer.terms.defaultRate, 
            offer.terms.duration, 
            offer.terms.gracePeriod, 
            offer.fee.recipient, 
            offer.fee.rate
        );
    }

    function borrow(
        uint256 tokenId,
        uint256 amount,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) external requireBid(offer.side) returns (uint256 lienId) {

        _takeLoanOffer(offer, amount, signature);
        
        _verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            tokenId, 
            proof
        );

        lienId = _lend(
            offer.maker,
            msg.sender, 
            offer.collateral.collection, 
            tokenId,
            offer.terms.currency, 
            amount, 
            offer.terms.rate, 
            offer.terms.defaultRate, 
            offer.terms.duration, 
            offer.terms.gracePeriod, 
            offer.fee.recipient, 
            offer.fee.rate
        );
    }

    function _market(
        address buyer,
        address seller,
        address currency,
        uint256 amount,
        address collection,
        uint256 tokenId,
        address recipient,
        uint256 fee
    ) internal returns (uint256 netAmount) {

        netAmount = _transferFees(
            currency, 
            buyer, 
            recipient, 
            amount,
            fee
        );

        IERC20(currency).safeTransferFrom(
            buyer, 
            seller, 
            netAmount
        );

        IERC721(collection).safeTransferFrom(
            seller, 
            buyer, 
            tokenId
        );
    }

    function _lend(
        address lender,
        address borrower,
        address collection,
        uint256 tokenId,
        address currency,
        uint256 amount,
        uint256 rate,
        uint256 defaultRate,
        uint256 duration,
        uint256 gracePeriod,
        address recipient,
        uint256 fee
    ) internal returns (uint256 lienId) {

        lienId = _openLien(
            lender,
            borrower,
            collection, 
            tokenId,
            currency, 
            amount, 
            rate, 
            defaultRate, 
            duration, 
            gracePeriod, 
            recipient, 
            fee
        );

        IERC20(currency).safeTransferFrom(
            lender, 
            borrower,
            amount
        );

        IERC721(collection).safeTransferFrom(
            borrower, 
            address(this), 
            tokenId
        );
    }

    function repay(
        uint256 lienId,
        Lien calldata lien
    ) 
        external 
        lienIsValid(lienId, lien) 
        lienIsCurrent(lien) 
        returns (uint256) 
    {
        (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien);

        IERC20(lien.currency).safeTransferFrom(
            msg.sender, 
            _currentLender(lienId),
            lien.principal + interest
        );

        IERC20(lien.currency).safeTransferFrom(
            msg.sender, 
            lien.recipient,
            fee
        );

        IERC721(lien.collection).safeTransferFrom(
            address(this), 
            lien.borrower, 
            lien.tokenId
        );

        _closeLien(lienId);

        return debt;
    }

    function claim(
        uint256 lienId,
        Lien calldata lien
    ) 
        external 
        lienIsValid(lienId, lien)
        returns (uint256)
    {
        if (!_lienIsDefaulted(lien)) {
            revert("LienIsCurrent");
        }

        IERC721(lien.collection).safeTransferFrom(
            address(this), 
            _currentLender(lienId), 
            lien.tokenId
        );

        _closeLien(lienId);

        return lienId;
    }

    function refinance(
        uint256 lienId,
        uint256 amount,
        Lien calldata lien,
        LoanOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) 
        external 
        requireBid(offer.side) 
        lienIsValid(lienId, lien) 
        lienIsCurrent(lien) 
        returns (uint256 newLienId) 
    {

        if (msg.sender != lien.borrower) {
            revert("TakerIsNotBorrower");
        }

        _matchTerms(
            lien.currency,
            offer.terms.currency,
            lien.collection,
            offer.collateral.collection,
            lien.tokenId,
            offer.collateral.identifier
        );

        _takeLoanOffer(offer, amount, signature);

        _verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            lien.tokenId, 
            proof
        );

        (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien);

        _transferPayments(
            lien.currency, 
            amount, 
            debt, 
            lien.principal + interest,
            fee,
            _currentLender(lienId), 
            lien.recipient, 
            offer.maker,
            msg.sender,
            msg.sender
        );

        _closeLien(lienId);

        newLienId = _openLien(
            offer.maker, 
            lien.borrower, 
            lien.collection, 
            lien.tokenId,
            lien.currency,
            amount,
            offer.terms.rate,
            offer.terms.defaultRate, 
            offer.terms.duration, 
            offer.terms.gracePeriod, 
            offer.fee.recipient, 
            offer.fee.rate
        );
    }

    function buyInLien(
        uint256 lienId,
        Lien calldata lien,
        MarketOffer calldata offer,
        bytes calldata signature
    ) 
        external 
        requireAsk(offer.side) 
        lienIsValid(lienId, lien) 
        lienIsCurrent(lien) 
        returns (uint256 netAmount) 
    {        
        if (lien.borrower != offer.maker) {
            revert("AskMakerIsNotBorrower");
        }

        _matchTerms(
            lien.currency, 
            offer.terms.currency, 
            lien.collection, 
            offer.collateral.collection, 
            lien.tokenId, 
            offer.collateral.identifier
        );

        _takeMarketOffer(offer, signature);

        (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien);

        netAmount = _transferFees(
            offer.terms.currency, 
            msg.sender, 
            offer.fee.recipient, 
            offer.terms.amount, 
            offer.fee.rate
        );

        if (debt > netAmount) {
            revert("InsufficientAskAmount");
        }

        _transferPayments(
            lien.currency, 
            netAmount, 
            debt, 
            lien.principal + interest, 
            fee, 
            _currentLender(lienId), 
            lien.recipient, 
            msg.sender, 
            msg.sender, 
            offer.maker
        );

        IERC721(lien.collection).safeTransferFrom(
            address(this), 
            msg.sender, 
            lien.tokenId
        );

        _closeLien(lienId);
    }

    function sellInLien(
        uint256 lienId,
        Lien calldata lien,
        MarketOffer calldata offer,
        bytes calldata signature,
        bytes32[] calldata proof
    ) 
        external
        requireNakedBid(offer.side, offer.terms.withLoan) 
        lienIsValid(lienId, lien) 
        lienIsCurrent(lien) 
        returns (uint256 netAmount) 
    {
        if (lien.borrower != msg.sender) {
            revert("TakerIsNotBorrower");
        }

        _matchTerms(
            lien.currency, 
            offer.terms.currency, 
            lien.collection, 
            offer.collateral.collection, 
            0,  // tokenId matched in _verifyCollateral
            0
        );

        _takeMarketOffer(offer, signature);

        _verifyCollateral(
            offer.collateral.criteria, 
            offer.collateral.identifier, 
            lien.tokenId, 
            proof
        );

        netAmount = _transferFees(
            offer.terms.currency, 
            offer.maker, 
            offer.fee.recipient, 
            offer.terms.amount, 
            offer.fee.rate
        );

        (uint256 debt, uint256 fee, uint256 interest) = _computeDebt(lien);

        _transferPayments(
            lien.currency, 
            netAmount, 
            debt, 
            lien.principal + interest, 
            fee, 
            _currentLender(lienId), 
            lien.recipient, 
            offer.maker, 
            msg.sender, 
            msg.sender
        );

        IERC721(lien.collection).safeTransferFrom(
            address(this), 
            offer.maker, 
            lien.tokenId
        );

        _closeLien(lienId);
    }

    function escrowBuy(
        MarketOffer calldata offer,
        bytes calldata signature
    ) external returns (uint256 escrowId) {

        _takeMarketOffer(offer, signature);

        uint256 rebate = _calculateRebate(
            offer.terms.amount, 
            offer.terms.rebate
        );

        escrowId = _openEscrow(
            offer.collateral.identifier,
            msg.sender,
            offer.maker,
            offer.collateral.collection,
            offer.collateral.identifier,
            offer.terms.currency,
            offer.terms.amount,
            offer.fee.recipient,
            offer.fee.rate,
            rebate
        );

        if (rebate > 0) {
            IERC20(offer.terms.currency).safeTransferFrom(
                offer.maker,
                address(this),
                rebate
            );
        }

        IERC20(offer.terms.currency).safeTransferFrom(
            msg.sender,
            address(this),
            offer.terms.amount
        );
    }

    function escrowSell(
        uint256 placeholder,
        MarketOffer calldata offer,
        bytes calldata signature
    ) external returns (uint256 escrowId) {

        _takeMarketOffer(offer, signature);

        uint256 rebate = _calculateRebate(
            offer.terms.amount, 
            offer.terms.rebate
        );

        escrowId = _openEscrow(
            placeholder,
            offer.maker,
            msg.sender,
            offer.collateral.collection,
            offer.collateral.identifier,
            offer.terms.currency,
            offer.terms.amount,
            offer.fee.recipient,
            offer.fee.rate,
            rebate
        );

        if (rebate > 0) {
            IERC20(offer.terms.currency).safeTransferFrom(
                msg.sender,
                address(this),
                rebate
            );
        }

        IERC20(offer.terms.currency).safeTransferFrom(
            offer.maker,
            address(this),
            offer.terms.amount
        );
    }

    // function _escrowMarket(
    //     address maker,
    //     address taker,
    //     address collection,
    //     uint256 identifier,
    //     address currency,
    //     uint256 amount,
    //     address recipient,
    //     uint256 fee,
    //     uint256 rebateRate
    // ) internal returns (uint256 escrowId) {

    //     uint256 rebate = _calculateRebate(amount, rebateRate);

    //     escrowId = _openEscrow(
    //         maker,
    //         taker,
    //         collection,
    //         identifier,
    //         offer.terms.currency,
    //         offer.terms.amount,
    //         offer.fee.recipient,
    //         offer.fee.rate,
    //         rebate
    //     );

    //     if (rebate > 0) {
    //         IERC20(offer.terms.currency).safeTransferFrom(
    //             offer.maker,
    //             address(this),
    //             rebate
    //         );
    //     }

    //     IERC20(offer.terms.currency).safeTransferFrom(
    //         msg.sender,
    //         address(this),
    //         offer.terms.amount
    //     );

    // }

    // function escrowSell(
    //     MarketOffer calldata offer,
    //     bytes calldata signature,
    // ) public virtual returns (uint256) {}

    function _transferFees(
        address currency,
        address payer,
        address recipient,
        uint256 amount,
        uint256 fee
    ) internal returns (uint256 netAmount) {
        uint256 feeAmount = (amount * fee) / 10_000;
        if (feeAmount > amount) revert("InvalidFee");

        IERC20(currency).safeTransferFrom(payer, recipient, feeAmount);
        netAmount = amount - feeAmount;
    }

    function _matchTerms(
        address currency1,
        address currency2,
        address collection1,
        address collection2,
        uint256 tokenId1,
        uint256 tokenId2
    ) internal pure {
        if (currency1 != currency2) {
            revert("CurrencyMismatch");
        }

        if (collection1 != collection2) {
            revert("CollectionMismatch");
        }

        if (tokenId1 != tokenId2) {
            revert("TokenMismatch");
        }
    }

    function _verifyCollateral(
        Criteria criteria,
        uint256 identifier,
        uint256 tokenId,
        bytes32[] calldata proof
    ) internal pure {
        if (criteria == Criteria.PROOF) {
            if (
                !MerkleProof.verifyCalldata(
                    proof, 
                    bytes32(identifier), 
                    keccak256(abi.encode(bytes32(tokenId)))
                )
            ) {
                revert("InvalidCriteria");
            }
        } else {
            if (!(tokenId == identifier)) {
                revert("InvalidToken");
            }
        }
    }

    modifier requireBid(Side side) {
        if (side != Side.BID) {
            revert("RequiresBidSide");
        }
        _;
    }

    modifier requireNakedBid(Side side, bool withLoan) {
        if (side != Side.BID || withLoan) {
            revert("RequiresNakedBid");
        }
        _;
    }

    modifier requireAsk(Side side) {
        if (side != Side.ASK) {
            revert("RequiresAskSide");
        }
        _;
    }
}
