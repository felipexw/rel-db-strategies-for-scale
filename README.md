# rel-db-strategies-for-scale
Strategies for scale your relational database.


## What is consistent hashing?
It's basically a techinique used for balacing requests among different servers based exclusively on a hash which is created based on a ID or some unique code. It's pretty much one of the simplest algorithms used for load distribution, because **it doesn't consider the amount of workload** inside a node before it redirects the request. You can fin more info [here](https://www.toptal.com/big-data/consistent-hashing).


## What is database sharding?
It's a techinique in distributed systems used for increase the database performance, in general. You just split your 5 million records table (or whatever data structure you use in your desing) in multiples database servers nodes (same schema, same database name, same table). It uses consistent hashing in order to find the server node according to the client.
Solutions like Vitess do the work when you need to shard your database.

### Pros
- It solves the problem when you have lots of registries inside the same data model.

### Cons
- It might be very complex to implement.
- The logic stays in the database client.
- You cannot do transactions.

### Why
- Large databses doesn't always have the best performance (lots of indexes, lots of registries to index when you insert another value).
- When the read/write it' too frequently the performance decreases mostly in relational databases (because of the ACID properties, in other words, transactions).


## What is horizontal database partitioning?
It consists of spliting the table records in multiple tables in the same database.

### How
  - The table indexes have fewer data, because are separeted tables (generally the same prefix name but with another suffix info. For example: `orders_1`).

## Database sharding vs horizontal partitioning
  - HP splits table into multiple tables int eh same db
  - Sharding splits big table into multiples tables across multiple db servers
  - HP table name changes (or schema)
  - Sharding everything is the same but server changes

### PROS
  - Sharding: Scalability (data, memory distributed among different machines)
  - Sharding: Security (users can access certain shards) 
  - Sharding: Optimal and Smaller size
  - 
### CONS
  - Complex client (aware of the shard)
  - Transactions across shards problem
  - Rollbacks (how do you rollback?)
  - Schema changes are harder to mantain
		- Joins
		- Has to be something you know in the query

## What is vertical database partitioning?
- separa por coluna a base (com todas as linhas) e coloca em outra tabela
		- vamos dizer que vc tem um blob que n é buscado com frequência, então vc pode tirar aquele blob e colocar em outra tabela, pois ele está consumindo espaço no tableindex. Coloca em outro tablespace
	- As queries são gerenciadas pelo banco e não pelo client (server)

## Horizontal database partitioning vs Vertical database partitiioning
- parte no meio a tabela e pega um conjunto x de linhas e joga em outra tabela
- particionamento por range

## Distributed Consensus and Data Replication Strategies on the Server
- RAID copy
	- When the writing its done on the master and the reading on the slave
	- When the writing its done on more than one db instance, then its a master-master (peer-to-peer) architecture
	- Split/brain problem
		- when theres a problem between the network communication and both db instances works
		- Solution
			- Add a third node (consider that two nodes crashes in the same time its very rare)
			- 
		- Master/slave
			- can transmit the data sync and async (depending on the nature of the problem itself)
			- 
- Database sharding
	- when to shard your database?
			- if the problem its writing: 
				- you can have two servers in different regions; and then they syncronize asynconously.			
		- nowadays it has solutions such as vitess (middleware on top of mysql)
	- horizontal partitioning (multple tables, same db) vs sharding (same table, multiple dbs servers)
		
	
- Database horizontal partitioning vs vertical partitioning
	- horizontal
		

