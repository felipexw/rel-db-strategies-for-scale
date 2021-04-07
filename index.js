const app = require("express")();
const crypto = require("crypto");
const HashRing = require("hashring");
const hr = new HashRing()
const { Sequelize, DataTypes } = require("sequelize");
const cors = require('cors')
app.use(cors())

hr.add("3306")
hr.add("3307")



const connections = {
    "3306": {
        "db": new Sequelize('appDb', 'root', 'db1', {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306
        }),
        "models": {
        }
    },
    "3307": {
        "db": new Sequelize('appDb', 'root', 'db2', {
            host: 'localhost',
            dialect: 'mysql',
            port: 3307
        }),
        "models": {
        }
    }
};

(async () => {
    try {
        const con1 = connections["3306"]["db"]
        con1.authenticate();
        const con2 = connections["3307"]["db"]
        con2.authenticate();

        const models1 = connections["3306"]["models"]
        models1["URLS"] = con1.define("URLS", {
            url: DataTypes.TEXT,
            userId: DataTypes.TEXT
        })

        const models2 = connections["3307"]["models"]
        models2["URLS"] = con2.define("URLS", {
            url: DataTypes.TEXT,
            userId: DataTypes.TEXT
        })

        await con1.sync({ force: true })
        await con2.sync({ force: true })

    } catch (error) {
        console.log(error)
    }
})();


app.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    const server = hr.get(userId)

    const urlModel = connections[server]["models"]["URLS"]
    const urlsResult = await urlModel.findAll()

    if (urlsResult.length) {
        res.send({
            "userId": userId,
            "url": urlsResult,
            "server": server
        })
    }
    else
        res.sendStatus(404)

})

app.post("/", async (req, res) => {
    const url = req.query.url;
    const hash = crypto.createHash("sha256").update(url).digest("base64")
    const userId = hash.substr(0, 5);

    const server = hr.get(userId)

    const urlModel = connections[server]["models"]["URLS"]
    urlModel.create({
        url: url,
        userId: userId
    })


    res.send({
        "userId": userId,
        "url": url,
        "server": server
    })
})
const appPort = 3000
app.listen(appPort, () => console.log(`Listening ${appPort}`))