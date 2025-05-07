import OpenAI from "openai";

try{
const openai = new OpenAI(
    {
        // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
        apiKey: "sk-0e89083b315a41288e242a9a80368952", // 如何获取API Key：https://help.aliyun.com/zh/model-studio/developer-reference/get-api-key
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    }
);
    const completion = await openai.chat.completions.create({
        model: "qwen-plus",  // 模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: "写一段关于区块链的话" }
        ],
    });
    console.log(completion.choices[0].message.content);
}catch (error) {
    console.log(`错误信息: ${error}`);
    console.log("请参考文档: https://help.aliyun.com/zh/model-studio/developer-reference/error-code");

}