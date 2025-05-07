import express from 'express'; // 导入 Express 框架，用于构建 Web 服务器
import cors from 'cors'; // 导入 CORS 中间件，用于处理跨域请求
import OpenAI from 'openai'; // 导入 OpenAI 官方库，用于与 OpenAI API 交互
import { fileURLToPath } from 'url'; // 导入 url 模块的 fileURLToPath 函数，用于将文件 URL 转换为路径
import { dirname, join } from 'path'; // 导入 path 模块的 dirname 和 join 函数，用于处理文件和目录路径

console.log("=================服务器初始化开始==============================");

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

console.log(`当前路径：${_dirname}`);

const app = express();  //创建一个Express应用

const port = process.env.PORT || 3000;  // 设置端口号，默认为3000

console.log(`当前端口：${port}`);

app.use(cors()); // 使用CORS中间件，允许跨域请求
app.use(express.json());   // 解析请求体中的JSON数据
app.use(express.static(join(_dirname, 'public'))); // 设置静态文件目录，将public目录下的文件作为静态资源提供

console.log("中间层配置成功");

//创建OpenAI 实例,配置API密钥和基础URL
const openai = new OpenAI({
    apiKey: "sk-0e89083b315a41288e242a9a80368952",
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

console.log("OpenAI实例创建成功");

//定义一个POST路由，处理/api/chat接口的请求
app.post('/api/chat', async (req, res) => {
    console.log("=======================收到聊天请求=================================");
    console.log(`请求时间:${new Date().toLocaleString()}`);

    // try {
    //     const { messages } = req.body; // 从请求体中获取消息数组
    //     console.log('接收到的消息:', messages);
    //     const completion = await openai.chat.completions.create({
    //         model: "qwen-plus",  //使用的模型
    //         messages:[
    //             { role: "system", content: "你是一个友好的助手"},
    //             ...messages
    //         ]
    //     });

    //     console.log("AI接口调用成功");

    //     const aiResponse = completion.choices[0].message.content;  // 获取AI的回复
    //     const aiRole = completion.choices[0].message.role;  // 获取AI的角色

    //     console.log(`AI回复内容：${aiRole};${aiResponse.substring(0, 50)}...`); // 打印AI的回复
    //     res.json({
    //         message: aiResponse,
    //         role: aiRole
    //     }); // 返回AI的回复

    //     console.log("AI回复已发送给用户浏览器");
    // }catch (error) {
    //     console.error("AI接口调用失败：", error);
    // }

    try {
        const { messages } = req.body;  // 从请求体中获取消息数组

        const completion = await openai.chat.completions.create({
            model: "qwen-plus",   //使用的模型
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                ...messages
            ]
        });

        console.log("AI接口调用成功");

        const aiResponse = completion.choices[0].message.content;   //获取 AI 的回复
        const aiRole = completion.choices[0].message.role;   //获取 AI 的角色

        console.log(`AI回复：${aiRole};${aiResponse.substring(0, 50)}...`);   // 打印 AI 的回复
        res.json({
            message: aiResponse,
            role: aiRole
        });  // 将 AI 的回复作为响应体返回

        console.log("AI回复已发送给用户浏览器");
    } catch (error) {
        console.error('AI接口调用失败：', error);
    }
});

app.listen(port, () => {
    console.log(`服务器正在监听端口 ${port}`);
    console.log(`地址:http://localhost:${port}`);
});

