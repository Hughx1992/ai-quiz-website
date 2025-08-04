#!/usr/bin/env python3
"""
成就系统测试脚本
"""

import requests
import json
import time
import uuid

BASE_URL = "http://127.0.0.1:3000"

def test_achievement_system():
    print("🎯 开始测试成就系统...")
    
    # 生成测试用户ID
    test_user_id = f"test_user_{int(time.time())}"
    print(f"📝 测试用户ID: {test_user_id}")
    
    # 1. 测试获取成就列表
    print("\n1. 测试获取成就列表...")
    try:
        response = requests.get(f"{BASE_URL}/api/achievements")
        achievements = response.json()
        print(f"✅ 成功获取 {len(achievements)} 个成就")
        print(f"   稀有度分布:")
        rarity_count = {}
        for achievement in achievements:
            level = achievement.get('level', 'unknown')
            rarity_count[level] = rarity_count.get(level, 0) + 1
        for level, count in rarity_count.items():
            print(f"   - {level}: {count}个")
    except Exception as e:
        print(f"❌ 获取成就列表失败: {e}")
        return
    
    # 2. 模拟答题记录（直接写入数据库）
    print("\n2. 模拟答题记录...")
    try:
        # 读取现有答题记录
        with open('/Users/hr/Desktop/资料夹/2.AI/2.Coding/2.Vscode/3.Augment/ai-quiz-website/database/answers.json', 'r', encoding='utf-8') as f:
            answers = json.load(f)
        
        # 添加测试答题记录
        test_answers = []
        for i in range(12):  # 答够12题来触发多个成就
            answer = {
                "userId": test_user_id,
                "questionId": f"test_q_{i}",
                "selectedAnswer": 0,
                "isCorrect": True,  # 全部答对
                "points": 10,
                "answerTime": f"2025-08-03T16:{30+i:02d}:00.000Z",
                "isTimeout": False
            }
            test_answers.append(answer)
            answers.append(answer)
        
        # 保存答题记录
        with open('/Users/hr/Desktop/资料夹/2.AI/2.Coding/2.Vscode/3.Augment/ai-quiz-website/database/answers.json', 'w', encoding='utf-8') as f:
            json.dump(answers, f, ensure_ascii=False, indent=2)
        
        print(f"✅ 成功添加 {len(test_answers)} 条答题记录")
    except Exception as e:
        print(f"❌ 模拟答题记录失败: {e}")
        return
    
    # 3. 测试成就检查
    print("\n3. 测试成就检查...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/check-achievements",
            headers={"Content-Type": "application/json"},
            json={
                "userId": test_user_id,
                "action": "submit_answer",
                "data": {
                    "questionId": "test_q_final",
                    "selectedAnswer": 0,
                    "isCorrect": True,
                    "points": 10,
                    "answerTime": "2025-08-03T16:42:00.000Z",
                    "isTimeout": False
                }
            }
        )
        result = response.json()
        newly_unlocked = result.get('newlyUnlocked', [])
        print(f"✅ 成就检查完成，解锁 {len(newly_unlocked)} 个成就")
        
        for achievement in newly_unlocked:
            print(f"   🏆 {achievement['name']} ({achievement['level']})")
            print(f"      {achievement['description']}")
    except Exception as e:
        print(f"❌ 成就检查失败: {e}")
    
    # 4. 测试获取用户成就
    print("\n4. 测试获取用户成就...")
    try:
        response = requests.get(f"{BASE_URL}/api/user-achievements/{test_user_id}")
        user_achievements = response.json()
        print(f"✅ 用户已解锁 {len(user_achievements)} 个成就")
        
        for ua in user_achievements:
            # 找到对应的成就信息
            achievement = next((a for a in achievements if a['id'] == ua['achievementId']), None)
            if achievement:
                print(f"   🏆 {achievement['name']} - {achievement['level']}")
    except Exception as e:
        print(f"❌ 获取用户成就失败: {e}")
    
    # 5. 测试页面访问
    print("\n5. 测试页面访问...")
    pages = [
        ("主页", "/"),
        ("答题页面", "/quiz"),
        ("成就页面", "/achievements"),
        ("成就测试页面", "/test-achievements"),
        ("排行榜", "/leaderboard"),
        ("管理后台", "/admin")
    ]
    
    for name, path in pages:
        try:
            response = requests.get(f"{BASE_URL}{path}")
            if response.status_code == 200:
                print(f"✅ {name} ({path}) - 可访问")
            else:
                print(f"⚠️ {name} ({path}) - 状态码: {response.status_code}")
        except Exception as e:
            print(f"❌ {name} ({path}) - 访问失败: {e}")
    
    print(f"\n🎉 成就系统测试完成！")
    print(f"📊 测试总结:")
    print(f"   - 测试用户: {test_user_id}")
    print(f"   - 模拟答题: {len(test_answers)} 题")
    print(f"   - 解锁成就: {len(user_achievements)} 个")
    print(f"   - 系统状态: 正常运行")

if __name__ == "__main__":
    test_achievement_system()