// модули
const fastify = require('fastify')(); 
const path = require('path'); // для работы с путями файлов

// плагин для работы с шаблонами EJS
fastify.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs') 
  },
  root: path.join(__dirname, 'views') // где хранятся шаблоны
});

// факториал
function factorial(n) {
  // если n не 0, умножаем n на факториал (n-1), иначе возвращаем 1
  return n ? n * factorial(n - 1) : 1;
}

// последовательностб Фибоначчи 
function fibonacci(n) {
  let fib = [0, 1];
  
  // для заполнения массива
  function calculateFibonacci(count) {
    // если в массиве достаточно чисел, останавливаем рекурсию
    if (fib.length >= count) return;
    
    // добавляем следующее число сумму двух последних
    fib[fib.length] = fib[fib.length - 1] + fib[fib.length - 2];
    
    // для добавления следующего числа
    calculateFibonacci(count);
  }
  
  // первичный вызоы
  calculateFibonacci(n);
  
  // Возвращаем массив с последовательностью Фибоначчи
  return fib;
}

fastify.get('/', async (request, reply) => {
  // получаем данные из запроса (если они есть)
  const factorialInput = request.query.factorialInput;
  const fibonacciInput = request.query.fibonacciInput;
  
  // переменные чтобы хранить рез вычислений
  let factorialResult = null;
  let fibonacciResult = null;
  let factorialError = null;
  let fibonacciError = null;
  
  if (factorialInput) {
    try {
      const n = parseInt(factorialInput);
        factorialResult = factorial(n);
      
    } catch (error) {
      factorialError = 'Произошла ошибка при вычислении факториала';
    }
  }
  
  if (fibonacciInput) {
    try {
      const n = parseInt(fibonacciInput);
        fibonacciResult = fibonacci(n);
    } catch (error) {
      fibonacciError = 'Произошла ошибка при вычислении последовательности Фибоначчи';
    }
  }
  
  // сттраница с передачей данных
  return reply.view('index.ejs', {
    factorialInput: factorialInput || '', // поле ввода факториала
    fibonacciInput: fibonacciInput || '', // поле ввода Фибоначчи
    factorialResult: factorialResult, // результат
    fibonacciResult: fibonacciResult, // результат
    factorialError: factorialError, // ошибка факториала (если есть)
    fibonacciError: fibonacciError  // ошибка Фибоначчи (если есть)
  });
});

// для запуска сервера
async function start() {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Сервер запущен на http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
