import React, { useState } from 'react';
import { Card, Switch, List, message } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const ProfileSettings = () => {
  // 从localStorage读取设置
  const getInitialSettings = () => {
    const defaultSettings = {
      notifications: true,
      privacyVisible: true,
    };
    
    // 读取并合并localStorage中的设置
    const privacyVisible = localStorage.getItem('privacyVisible') !== 'false'; // 默认公开
    
    return {
      ...defaultSettings,
      privacyVisible
    };
  };
  
  // 设置选项的状态
  const [settings, setSettings] = useState(getInitialSettings);

  // 处理设置变更
  const handleSettingChange = (settingKey) => (checked) => {
    setSettings({
      ...settings,
      [settingKey]: checked,
    });
    
    // 保存到localStorage (只持久化privacyVisible)
    if (settingKey === 'privacyVisible') {
      localStorage.setItem(settingKey, checked.toString());
    }
    
    // 模拟保存设置
    setTimeout(() => {
      message.success(settingKey === 'notifications' ? '通知设置已更新' : '隐私设置已更新');
    }, 300);
  };

  return (
    <Card title="账户设置" className="profile-settings-card">
      <div className="settings-container">
        {/* 常规设置 */}
        <Card title="通知设置" className="settings-card">
          <List
            bordered
            dataSource={[
              {
                key: 'notifications',
                title: '启用通知',
                description: '接收系统和游戏相关的通知',
                switch: settings.notifications,
              },
              {
                key: 'privacyVisible',
                title: '公开我的游戏库',
                description: '允许其他用户查看您的游戏库和收藏',
                switch: settings.privacyVisible,
              },
            ]}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Switch
                    checked={item.switch}
                    onChange={handleSettingChange(item.key)}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </Card>
  );
};

export default ProfileSettings;