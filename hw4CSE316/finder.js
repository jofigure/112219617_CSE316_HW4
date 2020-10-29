async function main() {


    const MongoClient = require('mongodb').MongoClient;
    //const { MongoClient } = require('mongodb');
    const uri = "mongodb+srv://joanna:qwerty1@cluster0.w03kq.mongodb.net/ClassesDB?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    //const client = new MongoClient(uri);
    // client.connect(err => {
    //   const collection = client.db("test").collection("devices");
    //   // perform actions on the collection object
    //   client.close();
    // });
    try {
      await client.connect();

      await listDatabases(client);

    } catch (e) {
      console.error(e);
    }

    finally {
      await client.close();
    }
  }

  main().catch(console.error);
