
# ClimbLink 智能匹配算法文档

## 一、设计背景与原则

### 1.1 设计背景
基于用户调研问卷，发现以下主要痛点：
- 41.38% 的用户反映 **找不到同水平的搭子**
- 37.93% 的用户反映 **时间/场馆难以匹配，约爬效率低**
- 24.14% 的用户担心 **陌生搭子不靠谱**
- 24.14% 的用户认为 **社群信息杂乱，寻找约爬信息耗时**

### 1.2 设计原则
- 以用户调研痛点为核心
- 多维度综合评分，不依赖单一标准
- 可解释性强，用户能理解匹配理由
- 易于迭代和优化

---

## 二、评分维度与权重总览

| 维度 | 权重 | 解决的核心问题 |
|------|------|----------------|
| 攀岩水平匹配 | 35% | 找不到同水平搭子 |
| 时间/场馆匹配 | 30% | 约爬效率低 |
| 性格标签匹配 | 10% | 提升体验和默契度 |
| 约爬请求标签匹配 | 10% | 此次攀爬类型匹配 |
| 历史互动评分 | 10% | 陌生搭子不靠谱 |
| 共同活动记录 | 5% | 增强匹配可靠性 |

**总分范围**：0 - 100 分

---

## 三、具体评分算法详解

### 3.1 攀岩水平匹配（35分）

#### 攀岩等级体系
```
等级层级定义：
- L1: V0
- L2: V1-V2
- L3: V3-V4
- L4: V5-V6
- L5: V7-V8
- L6: V9+
```

#### 评分规则

| 用户A等级 | 用户B等级 | 分数 | 说明 |
|-----------|-----------|------|------|
| L1 (V0) | L1 | 35分 | 完美匹配（同级） |
| L1 | L2 | 20分 | 可接受匹配 |
| L1 | L3 | 10分 | 差距不大 |
| L1 | L4-L6 | 5分 | 勉强匹配 |
| L2 (V1-V2) | L2 | 35分 | 完美匹配（同级） |
| L2 | L1, L3 | 20分 | 可接受匹配 |
| L2 | L4 | 10分 | 差距不大 |
| L2 | L5-L6 | 5分 | 勉强匹配 |
| L3 (V3-V4) | L3 | 35分 | 完美匹配（同级） |
| L3 | L2, L4 | 20分 | 可接受匹配 |
| L3 | L1, L5 | 10分 | 差距不大 |
| L3 | L6 | 5分 | 勉强匹配 |
| L4 (V5-V6) | L4 | 35分 | 完美匹配（同级） |
| L4 | L3, L5 | 20分 | 可接受匹配 |
| L4 | L2, L6 | 10分 | 差距不大 |
| L4 | L1 | 5分 | 勉强匹配 |
| L5 (V7-V8) | L5 | 35分 | 完美匹配（同级） |
| L5 | L4, L6 | 20分 | 可接受匹配 |
| L5 | L3 | 10分 | 差距不大 |
| L5 | L1-L2 | 5分 | 勉强匹配 |
| L6 (V9+) | L6 | 35分 | 完美匹配（同级） |
| L6 | L5 | 20分 | 可接受匹配 |
| L6 | L4 | 10分 | 差距不大 |
| L6 | L1-L3 | 5分 | 勉强匹配 |

#### 计算公式
```python
def calculate_level_score(level_a, level_b):
    level_map = {
        'V0': 1,
        'V1': 2,
        'V1-V2': 2,
        'V2': 2,
        'V0-V2 Beginner': 2,
        'V3': 3,
        'V3-V4': 3,
        'V3-V5 Intermediate': 3,
        'V4': 3,
        'V5': 4,
        'V5-V6': 4,
        'V6': 4,
        'V7': 5,
        'V7-V8': 5,
        'V8': 5,
        'V6-V8 Advanced': 5,
        'V9+': 6,
        'V9+ Expert': 6
    }
    
    l_a = level_map.get(level_a, 3)
    l_b = level_map.get(level_b, 3)
    diff = abs(l_a - l_b)
    
    if diff == 0:
        return 35
    elif diff == 1:
        return 20
    elif diff == 2:
        return 10
    else:
        return 5
```

---

### 3.2 时间/场馆匹配（30分）

#### 评分规则

| 匹配条件 | 分数 | 说明 |
|----------|------|------|
| 场馆相同 | 12分 | - |
| 日期相同 | 10分 | - |
| 时间重叠 ≥ 2小时 | 8分 | 或选择 Any Time |
| 时间重叠 1-2小时 | 5分 | - |
| 时间重叠 < 1小时 | 3分 | - |

**最高分：30分**

#### 计算公式
```python
def calculate_time_venue_score(request, my_request=None, any_time=False):
    score = 0
    
    # 场馆匹配
    if my_request and my_request['venue_name'] == request['venue_name']:
        score += 12
    
    # 日期匹配
    if my_request and my_request['climb_date'] == request['climb_date']:
        score += 10
    
    # 时间匹配（如果选any time，时间自动匹配2小时）
    overlap = 120 if any_time else calculate_time_overlap(
        my_request['climb_time'] if my_request else None,
        request['climb_time']
    )
    
    if overlap >= 120:
        score += 8
    elif overlap >= 60:
        score += 5
    elif overlap > 0:
        score += 3
    
    return min(score, 30)  # 封顶30分

def calculate_time_overlap(my_time, req_time):
    # 如果任意时间为空或者选择了any time，返回2小时作为默认
    if not my_time or not req_time or 'any' in str(my_time).lower() or 'any' in str(req_time).lower():
        return 120
    
    # 解析时间范围
    def parse_range(time_range):
        parts = str(time_range).split('-')
        if len(parts) == 2:
            return {
                'start': parse_time(parts[0]),
                'end': parse_time(parts[1])
            }
        single_time = parse_time(time_range)
        return {'start': single_time, 'end': single_time + 60}  # 假设1小时
    
    my_range = parse_range(my_time)
    req_range = parse_range(req_time)
    
    if not my_range['start'] or not my_range['end'] or not req_range['start'] or not req_range['end']:
        return 0
    
    overlap_start = max(my_range['start'], req_range['start'])
    overlap_end = min(my_range['end'], req_range['end'])
    
    if overlap_end > overlap_start:
        return overlap_end - overlap_start
    return 0
```

---

### 3.3 性格标签匹配（10分）

#### 可用性格标签列表
```
性格标签：
- Extrovert (外向)
- Introvert (内向)
- Adventurer (爱冒险)
- Planner (有计划)
- Competitive (好胜)
- Relaxed (佛系)
- Tech-focused (技术流)
- Fun-focused (娱乐流)
- Early Bird (早起型)
- Night Owl (夜猫子)
- Team Player (团队型)
- Independent (独立型)
```

#### 性格标签互补关系
```
互补标签对：
- Extrovert ↔ Introvert
- Planner ↔ Adventurer
- Competitive ↔ Relaxed
- Early Bird ↔ Night Owl
```

#### 性格标签评分规则

| 匹配情况 | 分数 |
|----------|------|
| ≥ 3个共同标签 | 10分 |
| 2个共同标签 | 8分 |
| 1个共同标签 | 5分 |
| 无共同标签但有互补标签 | 4分 |
| 无共同标签也无互补标签 | 2分 |

#### 性格标签计算公式
```python
def calculate_personality_label_score(labels_a, labels_b):
    if not labels_a or not labels_b:
        return 3
    
    labels_a = set(labels_a)
    labels_b = set(labels_b)
    
    common = labels_a & labels_b
    common_count = len(common)
    
    if common_count >= 3:
        return 10
    elif common_count == 2:
        return 8
    elif common_count == 1:
        return 5
    else:
        # 检查互补标签
        complementary_pairs = {
            ('Extrovert', 'Introvert'),
            ('Planner', 'Adventurer'),
            ('Competitive', 'Relaxed'),
            ('Early Bird', 'Night Owl'),
        }
        
        for pair in complementary_pairs:
            if (pair[0] in labels_a and pair[1] in labels_b) or \
               (pair[1] in labels_a and pair[0] in labels_b):
                return 4
        
        return 2
```

---

### 3.4 约爬请求标签匹配（10分）

#### 可用约爬请求标签
```
约爬请求标签（类型与强度）：
- bouldering (抱石) 🧗
- ropes (顶绳) 🪢
- lead (先锋) ⛓️
- speed (速度) ⚡
- beginner (新手友好) 🆕
- social (社交) 🎉
- training (训练) 💪
- project (挑战极限) 🎯
- relaxed (休闲) 😌
- intense (高强度) 🔥
```

#### 约爬请求标签评分规则

| 匹配情况 | 分数 |
|----------|------|
| 用户未选择标签 或 请求无标签 | 10分（满分） |
| ≥ 2个共同标签 | 10分 |
| 1个共同标签 | 7分 |
| 无共同标签但有相关标签 | 4分 |
| 完全不相关 | 2分 |

#### 相关标签映射
```
相关标签组：
- {bouldering, project}
- {ropes, lead}
- {training, intense}
- {beginner, relaxed, social}
```

#### 约爬请求标签计算公式
```python
def calculate_climb_request_label_score(tags_a, tags_b):
    if not tags_a or not tags_b or len(tags_a) == 0 or len(tags_b) == 0:
        return 10
    
    tags_a = set(tags_a)
    tags_b = set(tags_b)
    
    common = tags_a & tags_b
    common_count = len(common)
    
    if common_count >= 2:
        return 10
    elif common_count == 1:
        return 7
    else:
        # 检查相关标签
        related_groups = [
            {'bouldering', 'project'},
            {'ropes', 'lead'},
            {'training', 'intense'},
            {'beginner', 'relaxed', 'social'},
        ]
        
        for group in related_groups:
            if (tags_a & group) and (tags_b & group):
                return 4
        
        return 2
```

---

### 3.5 历史互动评分（10分）

#### 互动强度等级

| 互动类型 | 分数 | 说明 |
|----------|------|------|
| 成功约爬过 | 10分 | 最高信任度 |
| 多次消息往来（≥ 5次） | 9分 | 熟悉度高 |
| 有过消息往来（< 5次） | 7分 | 有过交流 |
| 收到过对方的申请 | 5分 | 有过连接 |
| 无任何互动 | 3分 | 基础分 |

#### 计算公式
```python
def calculate_interaction_score(user_a, user_b):
    # 检查是否有成功约爬记录
    if has_successful_climb(user_a, user_b):
        return 10
    
    # 检查消息记录数
    message_count = get_message_count(user_a, user_b)
    if message_count >= 5:
        return 9
    elif message_count > 0:
        return 7
    
    # 检查申请记录
    if has_application_between(user_a, user_b):
        return 5
    
    return 3
```

---

### 3.6 共同活动记录（5分）

#### 共同活动判定

| 共同活动情况 | 分数 |
|--------------|------|
| 相同场馆活动 ≥ 3次 | 5分 |
| 相同场馆活动 1-2次 | 3分 |
| 同城市其他场馆有交集 | 2分 |
| 无共同场馆记录 | 1分 |

#### 计算公式
```python
def calculate_activity_score(user_a, user_b):
    common_venues = get_common_venues(user_a, user_b)
    
    if not common_venues:
        # 检查同城市其他场馆
        if same_city_venues(user_a, user_b):
            return 2
        return 1
    
    max_gym_count = 0
    for venue in common_venues:
        count = min(
            get_gym_visit_count(user_a, venue),
            get_gym_visit_count(user_b, venue)
        )
        max_gym_count = max(max_gym_count, count)
    
    if max_gym_count >= 3:
        return 5
    elif max_gym_count >= 1:
        return 3
    
    return 1
```

---

## 四、总评分计算与排序

### 4.1 总评分公式

```python
def calculate_total_match_score(user_a, user_b, request_a, request_b):
    level_score = calculate_level_score(
        user_a['climbing_level'], 
        user_b['climbing_level']
    )
    
    time_venue_score = calculate_time_venue_score(request_a, request_b)
    
    personality_label_score = calculate_personality_label_score(
        user_a['labels'], 
        user_b['labels']
    )
    
    climb_request_label_score = calculate_climb_request_label_score(
        request_a['tags'], 
        request_b['tags']
    )
    
    interaction_score = calculate_interaction_score(user_a['user_id'], user_b['user_id'])
    
    activity_score = calculate_activity_score(user_a['user_id'], user_b['user_id'])
    
    total = level_score + time_venue_score + personality_label_score + \
            climb_request_label_score + interaction_score + activity_score
    
    return {
        'total': total,
        'breakdown': {
            'level': level_score,
            'time_venue': time_venue_score,
            'personality_label': personality_label_score,
            'climb_request_label': climb_request_label_score,
            'interaction': interaction_score,
            'activity': activity_score
        }
    }
```

### 4.2 排序与过滤策略

#### 过滤条件
1. **最低总分要求**：≥ 40分
2. **水平差异限制**：最大相差 2个等级
3. **排除自己**：不能匹配自己的请求

#### 排序优先级
```python
sorted_requests = sorted(match_results, 
                        key=lambda x: (-x['score']['total'], 
                                      -x['score']['breakdown']['level'],
                                      -x['score']['breakdown']['time_venue']))
```

#### 显示数量
- 推荐显示 **8-10个**最佳匹配
- 最多不超过 **15个**

---

## 五、匹配理由展示设计

### 5.1 匹配等级划分

| 总分区间 | 匹配等级 | 图标 |
|----------|----------|------|
| 80-100分 | 🌟 高度匹配 | 🌟 |
| 60-79分 | ⚡ 好匹配 | ⚡ |
| 40-59分 | 👍 不错匹配 | 👍 |

### 5.2 匹配理由文案库

```javascript
const MATCH_REASONS = {
    level_perfect: '同水平，完美搭档',
    level_good: '水平相近，可以互相学习',
    venue_same: '同场馆，方便约爬',
    date_same: '相同日期',
    time_overlap: '时间完美匹配',
    personality_label_complementary: '性格互补，合作愉快',
    personality_label_similar: '性格相似，默契度高',
    climb_request_label_match: '攀爬类型匹配',
    climb_request_label_related: '攀爬类型相关',
    had_climb: '曾经一起约过，老朋友了',
    common_venue: '都是这家场馆的常客',
    multi_highlights: '多重优势匹配'
}
```

### 5.3 推荐展示格式

```
┌─────────────────────────────┐
│ 🌟 高度匹配                 │
│ 同水平 + 同场馆 + 攀爬类型匹配  │
├─────────────────────────────┤
│ 场馆：Rock Time Gym         │
│ 时间：周六 14:00-17:00     │
│ 等级：V3-V4                 │
│ 性格标签：Adventurer, Competitive │
│ 约爬标签：抱石, 训练       │
└─────────────────────────────┘
```

---

## 六、实现步骤与数据需求

### 6.1 实现步骤

#### 阶段一：基础匹配（MVP）
1. ✅ 实现水平匹配评分
2. ✅ 实现时间/场馆匹配评分
3. ✅ 实现基础排序与过滤

#### 阶段二：增强匹配
1. ✅ 添加性格标签匹配
2. ✅ 添加历史互动评分
3. ✅ 匹配理由展示

#### 阶段三：优化迭代
1. 🔄 收集用户反馈
2. 🔄 A/B 测试权重调整
3. 🔄 机器学习优化

### 6.2 数据需求表

| 数据项 | 来源 | 说明 |
|--------|------|------|
| 用户攀岩水平 | users.climbing_level | 必填 |
| 用户性格标签 | users.labels | 选填，默认空数组 |
| 约爬请求信息 | climb_requests | 场馆、日期、时间、等级、tags |
| 约爬请求标签 | climb_requests.tags | 攀爬类型与强度标签 |
| 历史消息记录 | chat_messages | 用户互动情况 |
| 成功约爬记录 | climb_request_participants.status='accepted' | 历史配对记录 |
| 场馆活动记录 | 隐含在 climb_requests 中 | 用户场馆偏好 |

---

## 七、后续优化方向

### 7.1 短期优化（1-2个月）

1. **用户反馈系统**
   - 用户可以对匹配结果进行评分（好/中/差）
   - 记录成功约爬率

2. **权重动态调整**
   - 根据反馈数据微调各维度权重
   - A/B 测试不同权重方案

3. **冷启动优化**
   - 新用户没有数据时的推荐策略
   - 使用同水平、同场馆的热门搭子

### 7.2 中期优化（3-6个月）

1. **协同过滤算法**
   - "喜欢A的人也喜欢B"的推荐逻辑
   - 用户行为模式挖掘

2. **更多匹配维度**
   - 性别偏好
   - 年龄范围
   - 攀岩风格（抱石/先锋/顶绳）
   - 目标（休闲/训练/备赛）

3. **智能推荐增强**
   - 推荐可能合适的搭子给用户
   - 推荐适合用户的场馆

### 7.3 长期优化（6个月+）

1. **机器学习模型**
   - 训练成功约爬预测模型
   - 使用图神经网络分析社交关系

2. **实时学习**
   - 在线学习用户偏好变化
   - 自适应调整推荐策略

---

## 八、异常处理与边界情况

### 8.1 边界情况处理

| 情况 | 处理方案 |
|------|----------|
| 新用户无性格标签 | 给予基础分3分，主要依赖水平和时间 |
| 用户未选择标签 或 约爬请求无标签 | 给予满分10分，不影响匹配得分 |
| 用户等级填写不规范 | 默认为L3 (V3-V4) |
| 时间格式不统一 | 标准化时间解析，容错处理 |
| 场馆名称有差异 | 使用场馆ID或模糊匹配 |
| 匹配结果过少 | 放宽过滤条件，降低最低分要求为30分 |

### 8.2 性能优化

1. **批量计算优化**
   - 预计算用户特征向量
   - 缓存常用计算结果

2. **异步处理**
   - 后台预计算潜在匹配
   - 用户请求时快速返回

3. **分页加载**
   - 只加载前N个最佳匹配
   - 按需加载更多

---

## 九、监控与评估指标

### 9.1 核心指标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 匹配点击率 | ≥ 30% | 用户点击匹配结果的比例 |
| 申请转化率 | ≥ 15% | 从点击到发送申请的比例 |
| 约爬成功率 | ≥ 8% | 申请被接受的比例 |
| 用户满意度评分 | ≥ 4.0/5.0 | 用户对匹配的评分 |
| 重复约爬率 | ≥ 20% | 成功配对后再次约爬的比例 |

### 9.2 A/B 测试框架

```
实验设计：
- 对照组：当前算法
- 实验组：改进算法
- 分流比例：50% vs 50%
- 实验周期：2周
- 统计显著性：p-value < 0.05
```

---

## 十、附录

### 10.1 数据结构示例

```javascript
// 用户信息
const user = {
    user_id: 'user_001',
    name: '攀岩达人',
    climbing_level: 'V3-V4',
    labels: ['Adventurer', 'Competitive', 'Early Bird'],
    avatar: 'https://...'
}

// 约爬请求
const climbRequest = {
    _id: 'request_001',
    user_id: 'user_001',
    venue_name: 'Rock Time Gym',
    climb_date: '2026-05-10',
    climb_time: '14:00-17:00',
    level_requirement: 'V3-V4',
    max_participants: 4,
    participant_count: 2,
    tags: ['bouldering', 'training'],
    description: '周六下午一起练抱石'
}

// 匹配结果
const matchResult = {
    request: climbRequest,
    user: user,
    score: {
        total: 82,
        breakdown: {
            level: 35,
            time_venue: 28,
            personality_label: 8,
            climb_request_label: 7,
            interaction: 3,
            activity: 1
        }
    },
    reasons: ['同水平，完美搭档', '同场馆，方便约爬', '攀爬类型匹配'],
    match_level: 'high'
}
```

### 10.2 参考资料

- 问卷调研数据：Climb Link攀岩APP用户需求调研问卷
- 数据库设计：database-design.md
- 产品需求：CPT208.02.L.DiscoveringRequirements.YL.2026.pdf

---

**文档版本**：v1.3  
**最后更新**：2026-05-05  
**维护者**：ClimbLink 产品团队

---

## 实现状态

### 已实现功能 ✅
1. **攀岩水平匹配**（35分）
   - L1-L6 等级分组
   - 支持多种等级格式（V0, V1-V2, V3-V5 Intermediate等）
   - 差异0级：35分，1级：20分，2级：10分，3级+：5分

2. **时间/场馆匹配**（30分）
   - 场馆相同：+12分
   - 日期相同：+10分
   - 时间重叠：+3-8分（支持 Any Time）
   - 时间重叠计算：≥2小时8分，1-2小时5分，<1小时3分

3. **性格标签匹配**（10分）
   - 共同标签≥3个：10分，2个：8分，1个：5分
   - 互补标签：4分
   - 无标签：3分

4. **约爬请求标签匹配**（10分）
   - 用户未选标签或请求无标签：满分10分
   - 共同标签≥2个：10分，1个：7分
   - 相关标签组：4分
   - 无匹配：2分

5. **历史互动评分**（10分）
   - 成功约过爬：10分
   - 消息≥5条：9分，<5条：7分
   - 收到过申请：5分
   - 无互动：3分

6. **共同活动记录**（5分）
   - 同场馆≥3次：5分，1-2次：3分
   - 同城市其他场馆：2分
   - 无共同记录：1分

7. **智能匹配排序**
   - 最低总分要求：≥40分
   - 按总分降序排序
   - 排除自己的请求

### 待实现功能 ⏳
1. 同城市不同场馆匹配加分
2. 日期相近匹配加分
3. 同场馆多次记录额外加分
4. 时间完全重叠额外加分

## 版本历史
- **v1.3** (2026-05-05)：
  - 更新等级评分规则：差异2级给10分（而非5分）
  - 更新时间/场馆匹配公式，与实际实现一致
  - 添加实现状态说明
  - 添加 Any Time 支持说明
  - 添加更多等级格式支持
- **v1.2** (2026-05-05)：
  - 更新约爬请求标签为英文版本（bouldering, ropes, lead等）
  - 修改约爬请求标签评分规则：用户未选择标签或请求无标签时直接给满分10分
  - 更新相关标签组映射
  - 更新数据结构示例中的标签
- **v1.1** (2026-05-05)：
  - 修改等级评分规则：必须同级才能完美匹配
  - 将标签匹配拆分为性格标签(10分)和约爬请求标签(10分)
  - 提高最低总分要求至≥40分
  - 增加约爬请求标签匹配的相关标签组
- **v1.0** (2026-05-05)：
  - 初始版本

