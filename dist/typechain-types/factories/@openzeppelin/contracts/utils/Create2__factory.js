"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Create2__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [],
        name: "Create2EmptyBytecode",
        type: "error",
    },
    {
        inputs: [],
        name: "Create2FailedDeployment",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "needed",
                type: "uint256",
            },
        ],
        name: "Create2InsufficientBalance",
        type: "error",
    },
];
const _bytecode = "0x608060405234601a57604051603f6020823930815050603f90f35b600080fdfe6080604052600080fdfea2646970667358221220dfd0c86e2e74cbbb8d3d2b619252e6b51bade19d9a605de53c5834d128861e6164736f6c63430008180033";
const isSuperArgs = (xs) => xs.length > 1;
class Create2__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    connect(runner) {
        return super.connect(runner);
    }
    static createInterface() {
        return new ethers_1.Interface(_abi);
    }
    static connect(address, runner) {
        return new ethers_1.Contract(address, _abi, runner);
    }
}
exports.Create2__factory = Create2__factory;
Create2__factory.bytecode = _bytecode;
Create2__factory.abi = _abi;