import * as dotevn from "dotenv"

dotevn.config()

interface Config{
    mongourl : String
}

export const config : Config = {
    mongourl : process.env.MONGO_URI || "mongodb://localhost:27017/Society"  //database name can be changed anytime

};

