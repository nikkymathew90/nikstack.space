const http = require('http')

const server = http.createServer((req, res)=>{
	res.write('from didgital ocean server');
	res.end();
  })


server.listen(3000, '0.0.0.0')

console.log('server started on 3000')
