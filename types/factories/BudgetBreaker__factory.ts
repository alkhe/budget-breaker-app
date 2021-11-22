/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Signer,
  utils,
  BigNumberish,
  Contract,
  ContractFactory,
  Overrides,
} from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { BudgetBreaker, BudgetBreakerInterface } from "../BudgetBreaker";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_controller",
        type: "address",
      },
      {
        internalType: "address",
        name: "_residual",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_members",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_target",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_targetShare",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_executionDeadline",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_completionDeadline",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "balance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "complete",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "creationTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "sign",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405260008060006101000a81548160ff0219169083600281111562000050577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b02179055506103e84262000065919062000787565b600b553480156200007557600080fd5b5060405162001ec838038062001ec883398181016040528101906200009b919062000567565b816103e842620000ac919062000787565b10620000ef576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620000e690620006fc565b60405180910390fd5b80821062000134576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016200012b90620006da565b60405180910390fd5b8451600a60006101000a81548160ff021916908360ff1602179055508383600a60009054906101000a900460ff1660ff1662000171919062000787565b1115620001b5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001ac90620006b8565b60405180910390fd5b87600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555086600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555085600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550846004908051906020019062000290929190620003e9565b508360068190555082600781905550816008819055508060098190555060005b600a60009054906101000a900460ff1660ff168160ff161015620003da57600180600060048460ff168154811062000311577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690836002811115620003bf577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b02179055508080620003d19062000869565b915050620002b0565b50505050505050505062000a28565b82805482825590600052602060002090810192821562000465579160200282015b82811115620004645782518260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550916020019190600101906200040a565b5b50905062000474919062000478565b5090565b5b808211156200049357600081600090555060010162000479565b5090565b6000620004ae620004a88462000747565b6200071e565b90508083825260208201905082856020860282011115620004ce57600080fd5b60005b85811015620005025781620004e788826200050c565b845260208401935060208301925050600181019050620004d1565b5050509392505050565b6000815190506200051d81620009f4565b92915050565b600082601f8301126200053557600080fd5b81516200054784826020860162000497565b91505092915050565b600081519050620005618162000a0e565b92915050565b600080600080600080600080610100898b0312156200058557600080fd5b6000620005958b828c016200050c565b9850506020620005a88b828c016200050c565b9750506040620005bb8b828c016200050c565b965050606089015167ffffffffffffffff811115620005d957600080fd5b620005e78b828c0162000523565b9550506080620005fa8b828c0162000550565b94505060a06200060d8b828c0162000550565b93505060c0620006208b828c0162000550565b92505060e0620006338b828c0162000550565b9150509295985092959890939650565b600062000652603c8362000776565b91506200065f8262000907565b604082019050919050565b60006200067960358362000776565b9150620006868262000956565b604082019050919050565b6000620006a0602f8362000776565b9150620006ad82620009a5565b604082019050919050565b60006020820190508181036000830152620006d38162000643565b9050919050565b60006020820190508181036000830152620006f5816200066a565b9050919050565b60006020820190508181036000830152620007178162000691565b9050919050565b60006200072a6200073d565b905062000738828262000833565b919050565b6000604051905090565b600067ffffffffffffffff821115620007655762000764620008c7565b5b602082029050602081019050919050565b600082825260208201905092915050565b600062000794826200081c565b9150620007a1836200081c565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615620007dd57620007dc62000898565b5b828202905092915050565b6000620007f582620007fc565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b6200083e82620008f6565b810181811067ffffffffffffffff8211171562000860576200085f620008c7565b5b80604052505050565b6000620008768262000826565b915060ff8214156200088d576200088c62000898565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b7f546f74616c2064697362757273656d656e7420746f206d656d62657273206d7560008201527f7374206e6f742065786365656420746172676574206f75747075742e00000000602082015250565b7f436f6d706c6574696f6e20646561646c696e65206d757374206265206166746560008201527f7220657865637574696f6e20646561646c696e652e0000000000000000000000602082015250565b7f457865637574696f6e20646561646c696e65206d75737420626520616674657260008201527f206372656174696f6e2074696d652e0000000000000000000000000000000000602082015250565b620009ff81620007e8565b811462000a0b57600080fd5b50565b62000a19816200081c565b811462000a2557600080fd5b50565b6114908062000a386000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80632ca1512214610067578063522e117714610071578063614619541461007b578063b69ef8a814610085578063d8270dce146100a3578063fc0c546a146100c1575b600080fd5b61006f6100df565b005b610079610382565b005b6100836108f1565b005b61008d610c81565b60405161009a919061103c565b60405180910390f35b6100ab610d33565b6040516100b8919061103c565b60405180910390f35b6100c9610d39565b6040516100d69190610f41565b60405180910390f35b60006002811115610119577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600160003273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16600281111561019e577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14156101df576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101d690610fbc565b60405180910390fd5b60006002811115610219577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60008054906101000a900460ff16600281111561025f577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b1461029f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161029690610ffc565b60405180910390fd5b600854806103e8426102b19190611068565b106102f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e89061101c565b60405180910390fd5b6002600160003273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083600281111561037a577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b021790555050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168073ffffffffffffffffffffffffffffffffffffffff163273ffffffffffffffffffffffffffffffffffffffff1614610413576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161040a90610f9c565b60405180910390fd5b6001600281111561044d577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60008054906101000a900460ff166002811115610493577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b146104d3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104ca90610fdc565b60405180910390fd5b600954806103e8426104e59190611068565b1015610526576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161051d90610f7c565b60405180910390fd5b600654600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016105849190610efd565b60206040518083038186803b15801561059c57600080fd5b505afa1580156105b0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105d49190610db2565b106107215760005b600a60009054906101000a900460ff1660ff1681101561071f57600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb6004838154811061066e577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166007546040518363ffffffff1660e01b81526004016106b9929190610f18565b602060405180830381600087803b1580156106d357600080fd5b505af11580156106e7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061070b9190610d89565b5080806107179061113b565b9150506105dc565b505b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016107dd9190610efd565b60206040518083038186803b1580156107f557600080fd5b505afa158015610809573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061082d9190610db2565b6040518363ffffffff1660e01b815260040161084a929190610f18565b602060405180830381600087803b15801561086457600080fd5b505af1158015610878573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061089c9190610d89565b5060026000806101000a81548160ff021916908360028111156108e8577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b02179055505050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168073ffffffffffffffffffffffffffffffffffffffff163273ffffffffffffffffffffffffffffffffffffffff1614610982576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161097990610f9c565b60405180910390fd5b600060028111156109bc577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60008054906101000a900460ff166002811115610a02577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14610a42576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a3990610ffc565b60405180910390fd5b60005b600a60009054906101000a900460ff1660ff168160ff161015610bda57600280811115610a9b577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b6001600060048460ff1681548110610adc577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff166002811115610b87577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b14610bc7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bbe90610f5c565b60405180910390fd5b8080610bd290611184565b915050610a45565b50600854806103e842610bed9190611068565b10610c2d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c249061101c565b60405180910390fd5b60016000806101000a81548160ff02191690836002811115610c78577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b02179055505050565b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b8152600401610cde9190610efd565b60206040518083038186803b158015610cf657600080fd5b505afa158015610d0a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d2e9190610db2565b905090565b600b5481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600081519050610d6e8161142c565b92915050565b600081519050610d8381611443565b92915050565b600060208284031215610d9b57600080fd5b6000610da984828501610d5f565b91505092915050565b600060208284031215610dc457600080fd5b6000610dd284828501610d74565b91505092915050565b610de4816110c2565b82525050565b610df381611117565b82525050565b6000610e06603d83611057565b9150610e11826111dd565b604082019050919050565b6000610e29602483611057565b9150610e348261122c565b604082019050919050565b6000610e4c601683611057565b9150610e578261127b565b602082019050919050565b6000610e6f602b83611057565b9150610e7a826112a4565b604082019050919050565b6000610e92604683611057565b9150610e9d826112f3565b606082019050919050565b6000610eb5604983611057565b9150610ec082611368565b606082019050919050565b6000610ed8602383611057565b9150610ee3826113dd565b604082019050919050565b610ef781611100565b82525050565b6000602082019050610f126000830184610ddb565b92915050565b6000604082019050610f2d6000830185610ddb565b610f3a6020830184610eee565b9392505050565b6000602082019050610f566000830184610dea565b92915050565b60006020820190508181036000830152610f7581610df9565b9050919050565b60006020820190508181036000830152610f9581610e1c565b9050919050565b60006020820190508181036000830152610fb581610e3f565b9050919050565b60006020820190508181036000830152610fd581610e62565b9050919050565b60006020820190508181036000830152610ff581610e85565b9050919050565b6000602082019050818103600083015261101581610ea8565b9050919050565b6000602082019050818103600083015261103581610ecb565b9050919050565b60006020820190506110516000830184610eee565b92915050565b600082825260208201905092915050565b600061107382611100565b915061107e83611100565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156110b7576110b66111ae565b5b828202905092915050565b60006110cd826110e0565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b600061112282611129565b9050919050565b6000611134826110e0565b9050919050565b600061114682611100565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415611179576111786111ae565b5b600182019050919050565b600061118f8261110a565b915060ff8214156111a3576111a26111ae565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f54686973206d6574686f642063616e206f6e6c792062652063616c6c6564206160008201527f6674657220616c6c206d656d626572732068617665207369676e65642e000000602082015250565b7f497420697320746f6f206561726c7920746f2063616c6c2074686973206d657460008201527f686f642e00000000000000000000000000000000000000000000000000000000602082015250565b7f43616c6c6572206e6f7420617574686f72697a65642e00000000000000000000600082015250565b7f54686973206d6574686f642063616e206f6e6c792062652063616c6c6564206260008201527f792061206d656d6265722e000000000000000000000000000000000000000000602082015250565b7f54686973206d6574686f642063616e206f6e6c792062652063616c6c6564206460008201527f7572696e672074686520636f6e74726163742773206578656375746f7279207060208201527f6572696f642e0000000000000000000000000000000000000000000000000000604082015250565b7f54686973206d6574686f642063616e206f6e6c792062652063616c6c6564207760008201527f68656e2074686520636f6e7472616374656420686173206e6f74206265656e2060208201527f65786563757465642e0000000000000000000000000000000000000000000000604082015250565b7f497420697320746f6f206c61746520746f2063616c6c2074686973206d65746860008201527f6f642e0000000000000000000000000000000000000000000000000000000000602082015250565b611435816110d4565b811461144057600080fd5b50565b61144c81611100565b811461145757600080fd5b5056fea26469706673582212202e83b6d09ae87c357d5c8b6d53a97317d9764ade88f9ab9de9df029c8348388564736f6c63430008040033";

export class BudgetBreaker__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    _token: string,
    _controller: string,
    _residual: string,
    _members: string[],
    _target: BigNumberish,
    _targetShare: BigNumberish,
    _executionDeadline: BigNumberish,
    _completionDeadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BudgetBreaker> {
    return super.deploy(
      _token,
      _controller,
      _residual,
      _members,
      _target,
      _targetShare,
      _executionDeadline,
      _completionDeadline,
      overrides || {}
    ) as Promise<BudgetBreaker>;
  }
  getDeployTransaction(
    _token: string,
    _controller: string,
    _residual: string,
    _members: string[],
    _target: BigNumberish,
    _targetShare: BigNumberish,
    _executionDeadline: BigNumberish,
    _completionDeadline: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _token,
      _controller,
      _residual,
      _members,
      _target,
      _targetShare,
      _executionDeadline,
      _completionDeadline,
      overrides || {}
    );
  }
  attach(address: string): BudgetBreaker {
    return super.attach(address) as BudgetBreaker;
  }
  connect(signer: Signer): BudgetBreaker__factory {
    return super.connect(signer) as BudgetBreaker__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BudgetBreakerInterface {
    return new utils.Interface(_abi) as BudgetBreakerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BudgetBreaker {
    return new Contract(address, _abi, signerOrProvider) as BudgetBreaker;
  }
}