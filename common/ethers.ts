import { ContractFactory } from 'ethers'
import BudgetBreakerArtifact from '../contracts/BudgetBreaker.json'
import { BudgetBreaker__factory } from '../types/factories/BudgetBreaker__factory'

export const budget_breaker_factory = ContractFactory.fromSolidity(BudgetBreakerArtifact) as unknown as BudgetBreaker__factory
