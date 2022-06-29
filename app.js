let express = require('express')
let { MongoClient } = require('mongodb');
var bodyParser = require('body-parser')
let app = express() // app = { get: function() => { // do something }, listen: function()...  } 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
})); 
app.use(express.json());       
app.use(express.urlencoded());

const port = 3000

app.get('/', (req, res) => {
	res.send("hello from homepage");
})
	
app.get('/readTodos', async (req, res) => {
	let collection = await connectDB();

	const findResult = await collection.find({}).toArray();

	res.send(findResult);
})

app.post('/createTodo', async (req, res) => {
	var todoName = req.body.todoName;

	let collection = await connectDB();

	const insertResult = await collection.insertMany([{ name: todoName, done: false }]);
	if(insertResult.insertedCount == 1) {
		res.send("Saved successfully");
	} else {
		res.send("Saving failed");
	}
})

app.post('/deleteTodo', async (req, res) => {
	var todoName = req.body.todoName;
	let collection = await connectDB();

	const deleteResult = await collection.deleteMany({ name: todoName });

  	res.send(deleteResult)
})

app.post('/editTodoName/:todoName/:newName', async (req, res) => {

})

app.post('/editTodoDone/:todoName/:newDone', async (req, res) => {

})

app.post('/editTodo/:todoName/:newName/:newDone', async (req, res) => {
	let collection = await connectDB();

	const updateResult = await collection.updateOne({ name: req.params.todoName }, { $set: { name: req.params.newName, done: req.params.newDone } });

  	res.send(updateResult)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function connectDB(){
	const url = 'mongodb+srv://nikoloz93:nikoloz93@cluster0.566mh.mongodb.net/?retryWrites=true&w=majority';
	const client = new MongoClient(url);
	await client.connect();
	const db = client.db("todoApp");
	const collection1 = db.collection('todos');

	return collection1;
}