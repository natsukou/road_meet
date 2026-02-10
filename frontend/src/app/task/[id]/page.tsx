'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getUser, getTaskById, saveTask, calculateMidpoint } from '@/utils/storage';
import { MeetTask, Location } from '@/types';

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [task, setTask] = useState<MeetTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    const taskId = params.id as string;
    const currentTask = getTaskById(taskId);
    if (!currentTask) {
      router.push('/dashboard');
      return;
    }
    setTask(currentTask);
    setLoading(false);
  }, [params.id, router]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('您的浏览器不支持地理定位');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(newLocation);
        
        if (task && user) {
          const updatedTask = { ...task };
          if (task.creatorPhone === user.phone) {
            updatedTask.creatorLocation = newLocation;
          } else {
            updatedTask.partnerLocation = newLocation;
          }
          
          if (updatedTask.creatorLocation && updatedTask.partnerLocation) {
            updatedTask.status = 'ongoing';
          }
          
          saveTask(updatedTask);
          setTask(updatedTask);
        }
      },
      (error) => {
        alert('无法获取位置信息，请检查权限设置');
      }
    );
  };

  const handleCancel = () => {
    if (!task || !user) return;
    
    const updatedTask = { ...task };
    updatedTask.status = 'cancelled';
    updatedTask.cancelledBy = user.phone;
    saveTask(updatedTask);
    setTask(updatedTask);
    setShowCancelModal(false);
  };

  const isCreator = task?.creatorPhone === user?.phone;
  const canViewMap = task?.creatorLocation && task?.partnerLocation;

  if (loading || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray hover:text-dark">
            ← 返回
          </Link>
          <h1 className="text-lg font-bold text-dark">见面详情</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Task Code */}
        <div className="bg-white rounded-2xl p-6 text-center mb-6">
          <p className="text-gray text-sm mb-2">见面代号</p>
          <div className="text-4xl font-bold text-primary tracking-wider">
            #{task.code}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs ${
              task.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              task.status === 'matched' ? 'bg-blue-100 text-blue-700' :
              task.status === 'ongoing' ? 'bg-green-100 text-green-700' :
              task.status === 'completed' ? 'bg-gray-100 text-gray-700' :
              'bg-red-100 text-red-700'
            }`}>
              {task.status === 'pending' && '等待匹配'}
              {task.status === 'matched' && '匹配成功'}
              {task.status === 'ongoing' && '见面中'}
              {task.status === 'completed' && '已完成'}
              {task.status === 'cancelled' && '已取消'}
            </span>
          </div>
        </div>

        {/* Location Status */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h3 className="font-medium text-dark mb-4">位置状态</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray">创建者位置</span>
              <span className={task.creatorLocation ? 'text-secondary' : 'text-gray'}>
                {task.creatorLocation ? '✓ 已共享' : '等待中...'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray">对方位置</span>
              <span className={task.partnerLocation ? 'text-secondary' : 'text-gray'}>
                {task.partnerLocation ? '✓ 已共享' : '等待中...'}
              </span>
            </div>
          </div>
          
          {!location && task.status !== 'cancelled' && task.status !== 'completed' && (
            <button
              onClick={getCurrentLocation}
              className="w-full mt-4 py-3 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              共享我的位置
            </button>
          )}
          
          {location && (
            <div className="mt-4 p-3 bg-blue-50 rounded-xl">
              <p className="text-sm text-primary">
                您的位置已共享<br />
                纬度: {location.lat.toFixed(6)}<br />
                经度: {location.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>

        {/* Map Button */}
        {canViewMap && (
          <Link
            href={`/map/${task.id}`}
            className="block w-full py-4 bg-secondary text-white rounded-xl text-center font-medium hover:bg-green-600 transition-colors mb-4"
          >
            查看地图和推荐地点 →
          </Link>
        )}

        {/* Edit Count */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h3 className="font-medium text-dark mb-4">编辑次数</h3>
          <div className="flex justify-between text-sm">
            <span className="text-gray">
              创建者: {isCreator ? task.editCount.creator : task.editCount.creator}/6
            </span>
            <span className="text-gray">
              对方: {isCreator ? task.editCount.partner : task.editCount.partner}/6
            </span>
          </div>
        </div>

        {/* Cancel Button */}
        {task.status !== 'cancelled' && task.status !== 'completed' && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full py-3 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
          >
            取消见面
          </button>
        )}
      </main>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-dark mb-4">确认取消见面？</h3>
            <p className="text-gray text-sm mb-6">
              取消后对方将收到通知，双方确认后任务将被删除。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-dark hover:bg-gray-50"
              >
                再想想
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                确认取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
