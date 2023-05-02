import swaggerAutogenous from "swagger-autogen";

const doc = {
  info: {
    title: "Prometheus API",
    description: "Description",
  },
};
// 不做版控
const outputFile = "./swagger_output.json";

swaggerAutogenous(outputFile, ["src/app/index.ts"], doc);
