// 当dom完全加载之后执行脚本，就是把这个html，css都渲染出来之后，再执行js文件
document.addEventListener("DOMContentLoaded", function () {

    const chatMessages = document.getElementById("chat-messages");  // 获取聊天记录的div

    const userInput = document.getElementById("user-input");  // 获取用户输入的文本框
    
    const sendBtn = document.getElementById("send-btn");    // 获取发送按钮

    let messages = [{
        role: "assistant",   // 角色
        content: "你好，我是基于阿里的ai助手！"
    }];  // 聊天记录

    // 发送消息的函数
    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return; 

        userInput.value = "";

        userInput.focus();

        appendMessage("user", userMessage);  // 添加用户消息

        messages.push({ 
            role: "user", 
            content: userMessage 
        });

            const loadingDiv = document.createElement("div");
            loadingDiv.className = "message assistant";
            loadingDiv.innerHTML = `
                    <div class="loading">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;

            chatMessages.appendChild(loadingDiv);  // 将加载动画添加到聊天界面

            chatMessages.scrollTop = chatMessages.scrollHeight;  // 滚动到底部

            axios.post('/api/chat', {messages}).then((response) => {
                chatMessages.removeChild(loadingDiv);
                appendMessage("assistant",response.data.message);
                messages.push({ 
                    role: response.data.role, 
                    content: response.data.message 
                });
            });
    }

    //定义将用户信息添加到聊天界面的函数
    function appendMessage(role, content) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${role}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;

        chatMessages.appendChild(messageDiv); //将消息添加到聊天界面
        chatMessages.scrollTop = chatMessages.scrollHeight; //滚动到底部
        
    }
    
    sendBtn.addEventListener("click",sendMessage);

    userInput.addEventListener("keydown", function(e) {
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();  //阻止默认换行
            sendMessage(); //发送消息
        }
    });
    userInput.addEventListener("input", function() {
        this.style.height = "auto";
        this.style.height = this.scrollHeight < 120 ? this.scrollHeight + "px" : "120px"; //设置最小高度

    });
    
});