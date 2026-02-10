import gradio as gr

def roadmeet_app():
    """RoadMeet GPS社交交友应用"""
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RoadMeet - 让相遇更有趣</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #F9FAFB; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #3B82F6; text-align: center; margin-bottom: 10px; }
            .subtitle { text-align: center; color: #6B7280; margin-bottom: 30px; }
            .feature { background: #F3F4F6; padding: 15px; border-radius: 12px; margin: 10px 0; }
            .feature h3 { margin: 0 0 8px 0; color: #1F2937; }
            .feature p { margin: 0; color: #6B7280; font-size: 14px; }
            .btn { display: block; width: 100%; padding: 15px; background: #3B82F6; color: white; text-align: center; border-radius: 12px; text-decoration: none; margin-top: 20px; font-weight: bold; }
            .btn:hover { background: #2563EB; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>RoadMeet</h1>
            <p class="subtitle">基于GPS的社交交友线下聚会应用</p>
            
            <div class="feature">
                <h3>📱 手机号注册/登录</h3>
                <p>简单快捷的注册流程，验证码：123456</p>
            </div>
            
            <div class="feature">
                <h3>🤝 创建/加入见面任务</h3>
                <p>生成16进制代号，分享给对方即可匹配</p>
            </div>
            
            <div class="feature">
                <h3>📍 GPS定位共享</h3>
                <p>实时共享位置，计算中间点</p>
            </div>
            
            <div class="feature">
                <h3>☕ 推荐见面地点</h3>
                <p>咖啡、餐厅、书店、公园等多种选择</p>
            </div>
            
            <a href="https://github.com/natsukou/road_meet" class="btn" target="_blank">查看项目源码</a>
        </div>
    </body>
    </html>
    """
    return html_content

# 创建Gradio界面
demo = gr.Interface(
    fn=roadmeet_app,
    inputs=[],
    outputs=gr.HTML(),
    title="RoadMeet - 让相遇更有趣",
    description="基于GPS的社交交友线下聚会应用",
)

if __name__ == "__main__":
    demo.launch()
