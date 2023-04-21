import mongoose from "mongoose";

(async () => {
  const { DATABASE, DATABASE_PASSWORD } = process.env;
  const uri = DATABASE?.replace("<password>", `${DATABASE_PASSWORD}`);

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri || "");
    console.log("[mongodb 連線成功]");
  } catch (error) {
    if (error instanceof Error) {
      console.log("[mongodb 連線錯誤]", error.message);
    }
  }
})();
