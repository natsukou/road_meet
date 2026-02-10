'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUser, getTasks, generateMeetCode, saveTask } from '@/utils/storage';
import { MeetTask } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<MeetTask[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    setTasks(getTasks().filter(t => 
      t.creatorPhone === currentUser.phone || t.partnerPhone === currentUser.phone
    ));
  }, [router]);

  const handleCreateTask = () => {
    if (!user) return;
    
    const newTask: MeetTask = {
      id: `task_${Date.now()}`,
      code: generateMeetCode(),
      creatorPhone: user.phone,
      status: 'pending',
      editCount: { creator: 0, partner: 0 },
      maxEdits: 6,
      createdAt: new Date().toISOString(),
    };
    
    saveTask(newTask);
    setShowCreateModal(false);
    router.push(`/task/${newTask.id}`);
  };

  const handleJoinTask = () => {
    if (!joinCode || !user) return;
    
    const allTasks = getTasks();
    const task = allTasks.find(t => t.code === joinCode.toUpperCase());
    
    if (!task) {
      alert('未找到该见面任务，请检查代号');
      return;
    }
    
    if (task.creatorPhone === user.phone) {
      alert('不能加入自己创建的任务');
      return;
    }
    
    if (task.partnerPhone) {
      alert('该任务已被其他人加入');
      return;
    }
    
    task.partnerPhone = user.phone;
    task.status = 'matched';
    saveTask(task);
    setShowJoinModal(false);
    router.push(`/task/${task.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('roadmeet_user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-dark">RoadMeet</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray hover:text-primary"
          >
            退出
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <p className="text-gray">欢迎回来</p>
          <p className="text-lg font-medium text-dark">{user.phone}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-white p-6 rounded-2xl text-center hover:bg-blue-600 transition-colors"
          >
            <div className="text-3xl mb-2">+</div>
            <div className="font-medium">创建见面</div>
          </button>
          <button
            onClick={() => setShowJoinModal(true)}
            className="bg-secondary text-white p-6 rounded-2xl text-center hover:bg-green-600 transition-colors"
          >
            <div className="text-3xl mb-2">#</div>
            <div className="font-medium">加入见面</div>
          </button>
        </div>

        {/* Task List */}
        <div>
          <h2 className="text-lg font-medium text-dark mb-4">我的见面</h2>
          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <p className="text-gray">暂无见面任务</p>
              <p className="text-sm text-gray mt-1">创建或加入一个见面吧</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/task/${task.id}`}
                  className="block bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-lg font-bold text-primary">#{task.code}</div>
                      <div className="text-sm text-gray mt-1">
                        {task.status === 'pending' && '等待匹配'}
                        {task.status === 'matched' && '匹配成功'}
                        {task.status === 'ongoing' && '见面中'}
                        {task.status === 'completed' && '已完成'}
                        {task.status === 'cancelled' && '已取消'}
                      </div>
                    </div>
                    <div className="text-xs text-gray">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-dark mb-4">创建见面任务</h3>
            <p className="text-gray text-sm mb-6">
              创建后将生成唯一的6位16进制代号，分享给对方即可匹配见面。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-dark hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleCreateTask}
                className="flex-1 py-3 bg-primary text-white rounded-xl hover:bg-blue-600"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-dark mb-4">加入见面任务</h3>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="输入6位代号（如：A3F9B2）"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mb-6"
              maxLength={6}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-dark hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleJoinTask}
                className="flex-1 py-3 bg-secondary text-white rounded-xl hover:bg-green-600"
              >
                加入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
