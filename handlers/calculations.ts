import { BigInt } from "@graphprotocol/graph-ts"

const YEAR_WAD = BigInt.fromI32(365 * 24 * 60 * 60).times(BigInt.fromString("1000000000000000000"));
const BASIS_POINTS = BigInt.fromI32(10000);

export function calculateDebt(
  principal: BigInt,
  fee: BigInt,
  rate: BigInt,
  defaultRate: BigInt,
  duration: BigInt,
  startTime: BigInt,
  currentTime: BigInt
): BigInt {

  const debtWithFee = computeDebt(
    principal,
    fee,
    startTime,
    currentTime
  );

  let debtWithRate = BigInt.fromI32(0);
  if (currentTime > startTime.plus(duration)) {
    debtWithRate = computeDebt(
      principal,
      rate,
      startTime,
      startTime.plus(duration)
    );

    debtWithRate = computeDebt(
      debtWithRate,
      defaultRate,
      startTime.plus(duration),
      currentTime
    )
  } else {
    debtWithRate = computeDebt(
      principal,
      rate,
      startTime,
      currentTime
    );
  }

  const feeInterest = debtWithFee.minus(principal);
  const rateInterest = debtWithRate.minus(principal);
  const debt = principal.plus(rateInterest).plus(feeInterest);

  return debt;
}

export function computeDebt(
  principal: BigInt,
  rate: BigInt,
  startTime: BigInt,
  currentTime: BigInt
): BigInt {
  const loanTime = currentTime.minus(startTime);
  const yearsWad = loanTime.times(BigInt.fromString("1000000000000000000")).div(YEAR_WAD);
  return wadMul(principal, wadExp(wadMul(yearsWad, bipsToSignedWads(rate))));
}

// Converts an integer bips value to a signed wad value
function bipsToSignedWads(bips: BigInt): BigInt {
  return bips.times(BigInt.fromString("1000000000000000000")).div(BASIS_POINTS);
}

// Wad multiplication and exponentiation utility functions
function wadMul(a: BigInt, b: BigInt): BigInt {
  return a.times(b).div(BigInt.fromString("1000000000000000000"));
}

function wadExp(x: BigInt): BigInt {
  // Approximate the exponential function for a wad exponent
  let result = BigInt.fromString("1000000000000000000");
  let term = BigInt.fromString("1000000000000000000");

  for (let i = 1; i < 10; i++) {
    term = term.times(x).div(BigInt.fromI32(i).times(BigInt.fromString("1000000000000000000")));
    result = result.plus(term);
    if (term.equals(BigInt.zero())) {
      break;
    }
  }

  return result;
}
