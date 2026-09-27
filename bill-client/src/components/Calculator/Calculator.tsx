import { useState, useImperativeHandle, type CSSProperties, type Ref } from 'react';
import { Button, DatePicker } from 'antd-mobile';
import dayjs, { type Dayjs } from 'dayjs';
import './style.scss';

type CalculationType = null | '+' | '-';

const dateFormat = 'YYYY-MM-DD';

function checkNumberIsInt(num: number | string): boolean {
  if (typeof num === 'string') {
    num = parseFloat(num);
  }
  if (isNaN(num)) {
    return false;
  }
  return `${num}`.indexOf('.') < 0;
}

export interface CalculatorOnConfirmResult {
  date: string;
  remark: string;
  price: string;
}

interface SetDataProps {
  date?: string | Dayjs;
  remark?: string;
  price: number | string;
}

export interface CalculatorRefProps {
  setData: (data: SetDataProps) => void;
}



interface CalculatorProps {
  ref?: Ref<CalculatorRefProps>;
  onConfirm?: (result: CalculatorOnConfirmResult) => void;
  style?: CSSProperties;
}



// const Calculator = forwardRef<CalculatorRefProps, CalculatorProps>(
  
// );

const Calculator = ({ref, style, onConfirm}: CalculatorProps) => {
  const [date, setDate] = useState<Dayjs>(dayjs());
    const [remark, setRemark] = useState('');
    const [firstPrice, setFirstPrice] = useState<string>('0');
    const [secondPrice, setSecondPrice] = useState<string>('');
    const [calculation, setCalculation] = useState<CalculationType>(null);
    const [datePickerVisible, setDatePickerVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      setData: (data) => {
        const { date: d, price, remark: r } = data;
        if (d !== undefined) {
          setDate(typeof d === 'string' ? dayjs(d) : d);
        }
        if (r !== undefined) {
          setRemark(r);
        }
        if (price !== undefined) {
          setFirstPrice(typeof price === 'string' ? price : `${price}`);
          setSecondPrice('');
          setCalculation(null);
        }
      },
    }));

    function handlerInputNumber(num: number) {
      const isFirst = calculation === null;
      // const isZero = num === 0;
      let price: string;
      // if (isZero) {
      // }
      const curPrice = isFirst ? firstPrice : secondPrice;
      const floatStr = curPrice.split('.')[1];
      if (floatStr && floatStr.length >= 2) {
        return;
      }
      price = isFirst ? firstPrice : secondPrice;
      price = price === '' || price === '0' ? `${num}` : price + num;
      const setPrice = isFirst ? setFirstPrice : setSecondPrice;
      setPrice(price);
    }

    function handlerInputCalculation(c: CalculationType) {
      const firstPriceNumber = parseFloat(firstPrice);
      const secondPriceNumber = parseFloat(secondPrice);
      const isInputSecondPrice = !isNaN(secondPriceNumber);
      if (isInputSecondPrice) {
        const currentPrice =
          calculation === '+'
            ? firstPriceNumber + secondPriceNumber
            : firstPriceNumber - secondPriceNumber;
        const priceStr = checkNumberIsInt(currentPrice)
          ? `${currentPrice}`
          : currentPrice.toFixed(2);
        setFirstPrice(priceStr);
        setSecondPrice('');
      }
      setCalculation(c);
    }

    function handlerInputPoint() {
      const isInpCalculation = calculation !== null;
      if (!isInpCalculation && firstPrice === '0') {
        setFirstPrice('.');
        return;
      } else if (isInpCalculation && secondPrice === '') {
        setSecondPrice('.');
        return;
      }
      let price = isInpCalculation ? secondPrice : firstPrice;
      if (checkNumberIsInt(price)) {
        price += '.';
        // isInpCalculation ? setSecondPrice(price) : setFirstPrice(price);
        if (isInpCalculation) {
          setSecondPrice(price);
        } else {
          setFirstPrice(price);
        }
      }
    }

    function calculationPrice(): string {
      const firstPriceNum = firstPrice === '.' ? 0 : parseFloat(firstPrice);
      const secondPriceNum =
        secondPrice === '' || secondPrice === '.' ? 0 : parseFloat(secondPrice);
      let priceNum = 0;
      switch (calculation) {
        case null:
          priceNum = firstPriceNum;
          break;
        case '+':
          priceNum = firstPriceNum + secondPriceNum;
          break;
        case '-':
          priceNum = firstPriceNum - secondPriceNum;
          break;
      }
      const ret = checkNumberIsInt(priceNum) ? `${priceNum}` : priceNum.toFixed(2);
      setFirstPrice(ret);
      setCalculation(null);
      setSecondPrice('');
      return ret;
    }

    function handlerDelete() {
      if (firstPrice !== '0' && calculation === null && !secondPrice) {
        if (firstPrice === '.') {
          setFirstPrice('0');
        } else {
          setFirstPrice(
            firstPrice.length <= 1 ? '0' : firstPrice.slice(0, firstPrice.length - 1)
          );
        }
      } else if (calculation !== null && !secondPrice) {
        setCalculation(null);
      } else {
        setSecondPrice(
          secondPrice.length <= 1 ? '' : secondPrice.slice(0, secondPrice.length - 1)
        );
      }
    }

    function handlerConfirm() {
      const price = calculationPrice();
      onConfirm?.({
        date: date.format(dateFormat),
        remark,
        price,
      });
    }

    const dateIsToday = date?.format(dateFormat) === dayjs().format(dateFormat);

    return (
      <div className="calculator" style={style}>
        <div className="remark-row">
          <div className="input-row">
            <label className="label">备注</label>
            <input
              className="input"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="请输入备注"
            />
          </div>
          <div className="input-row">
            <label className="label">当前价格</label>
            <input
              className="input"
              readOnly
              value={`${firstPrice} ${calculation || ''} ${calculation && secondPrice ? secondPrice : ''}`}
              placeholder="0"
            />
          </div>
        </div>

        <div className="keys-area">
          <div className="keys-row">
            <Button className="code-item" onClick={() => handlerInputNumber(7)}>7</Button>
            <Button className="code-item" onClick={() => handlerInputNumber(8)}>8</Button>
            <Button className="code-item" onClick={() => handlerInputNumber(9)}>9</Button>
            <Button className="code-item" onClick={() => setDatePickerVisible(true)}>
              {dateIsToday ? (
                <><span className="icon iconfont icon-rili" />&nbsp;今天</>
              ) : (
                date.format(dateFormat)
              )}
            </Button>
          </div>
          <div className="keys-row">
            <Button className="code-item" onClick={() => handlerInputNumber(4)}>4</Button>
            <Button className="code-item" onClick={() => handlerInputNumber(5)}>5</Button>
            <Button className="code-item" onClick={() => handlerInputNumber(6)}>6</Button>
            <Button className="code-item" onClick={() => handlerInputCalculation('+')}>+</Button>
          </div>
          <div className="keys-row">
            <Button className="code-item" onClick={() => handlerInputNumber(1)}>1</Button>
            <Button className="code-item" onClick={() => handlerInputNumber(2)}>2</Button>
            <Button className="code-item" onClick={() => handlerInputNumber(3)}>3</Button>
            <Button className="code-item" onClick={() => handlerInputCalculation('-')}>-</Button>
          </div>
          <div className="keys-row">
            <Button className="code-item" onClick={handlerInputPoint}>.</Button>
            <Button className="code-item" onClick={() => handlerInputNumber(0)}>0</Button>
            <Button className="code-item" onClick={handlerDelete}>
              <span className="icon iconfont icon-delete" />
            </Button>
            {secondPrice === '' ? (
              <Button className="code-item" color="primary" onClick={handlerConfirm}>
                完成
              </Button>
            ) : (
              <Button className="code-item" color="primary" onClick={() => { calculationPrice(); }}>
                =
              </Button>
            )}
          </div>
        </div>

        <DatePicker
          visible={datePickerVisible}
          value={date.toDate()}
          onConfirm={(d) => {
            setDate(dayjs(d));
            setDatePickerVisible(false);
          }}
          onClose={() => setDatePickerVisible(false)}
        />
      </div>
    );
}

Calculator.displayName = 'Calculator';
export default Calculator;
