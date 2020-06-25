export const visaPrefixList = [
  '4539',
  '4556',
  '4916',
  '4532',
  '4929',
  '40240071',
  '4485',
  '4716',
  '4',
];

function genCardNumber(prefix: string, length: number) {
  let ccnumber = Array.from(prefix);

  // generate digits
  while (ccnumber.length < length - 1) {
    ccnumber.push('' + Math.floor(Math.random() * 10));
  }

  // reverse number and convert to int
  let reversedCCnumberStr = Array.from(ccnumber);
  reversedCCnumberStr.reverse();
  let reversedCCnumber = reversedCCnumberStr.map((i) => parseInt(i));

  // calculate sum
  let sum = 0;
  let pos = 0;

  while (pos < length - 1) {
    let odd = reversedCCnumber[pos] * 2;
    if (odd > 9) {
      odd -= 9;
    }

    sum += odd;

    if (pos != length - 2) {
      sum += reversedCCnumber[pos + 1];
    }
    pos += 2;
  }

  // calculate check digit
  let checkdigit = ((Math.floor(sum / 10) + 1) * 10 - sum) % 10;
  ccnumber.push('' + checkdigit);

  return ccnumber.join('');
}

export function genRandomCard() {
  const prefix =
    visaPrefixList[Math.floor(Math.random() * visaPrefixList.length)];
  return genCardNumber(prefix, 16);
}

export function genRandomCvc() {
  let rslt: string[] = [];
  while (rslt.length < 3) {
    rslt = rslt.concat(Array.from('' + Math.floor(Math.random() * 1000)));
  }
  return rslt.slice(0, 3).join('');
}

export function currencyListToMap(currencies: {
  base: string;
  rates: { [key: string]: number };
}) {
  const ans: { [key: string]: number } = {};
  ans[currencies.base] = 1;
  for (let c in currencies.rates) {
    ans[c] = currencies.rates[c];
  }
  return ans;
}
