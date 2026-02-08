const fastify = require('fastify')();

fastify.register(require('@fastify/view'), {
  engine: { ejs: require('ejs') }
});

// Функции для работы со списком
function printListForward(list) {
  if (!list) return '';
  return list.value + ' ' + printListForward(list.next);
}

function printListBackward(list) {
  if (!list) return '';
  return printListBackward(list.next) + ' ' + list.value;
}

// Функция для подсчета зарплат (рекурсивно)
function totalSalary(obj) {
  let total = 0;
  
  for (let key in obj) {
    if (Array.isArray(obj[key])) {
      obj[key].forEach(employee => {
        total += employee.salary;
      });
    } else if (typeof obj[key] === 'object') {
      total += totalSalary(obj[key]); // рекурсивный вызов для вложенных объектов
    }
  }
  
  return total;
}

// Данные
const list = { 
  value: 123, 
  next: { 
    value: 300, 
    next: { 
      value: 5, 
      next: null 
    }
  }
};

const company = {
  dep1: [
    { name: "Иван", salary: 50000 },
    { name: "Мария", salary: 60000 }
  ],
  dep2: [
    { name: "Петр", salary: 55000 },
    { name: "Анна", salary: 65000 }
  ],
  dep3: [] // пустой отдел для примера
};

// Роут
fastify.get('/', (req, reply) => {
  reply.view('/views/index.ejs', {
    listForward: printListForward(list).trim(),
    listBackward: printListBackward(list).trim(),
    totalSalary: totalSalary(company)
  });
});

// Запуск сервера
fastify.listen({ port: 5000 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Сервер запущен: http://localhost:5000');
});