'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getUser, getTaskById, calculateMidpoint } from '@/utils/storage';
import { MeetTask } from '@/types';

// Mock places data for demo
const MOCK_PLACES = [
  { name: '星巴克咖啡', address: '距离中点 200米', type: 'coffee', rating: 4.5 },
  { name: '喜茶', address: '距离中点 350米', type: 'tea', rating: 4.3 },
  { name: '西西弗书店', address: '距离中点 500米', type: 'bookstore', rating: 4.7 },
  { name: '海底捞火锅', address: '距离中点 800米', type: 'restaurant', rating: 4.6 },
  { name: '城市公园', address: '距离中点 600米', type: 'park', rating: 4.4 },
];

export default function MapPage() {
  const router = useRouter();
  const params = useParams();
  const mapRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [task, setTask] = useState<MeetTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);

    const taskId = params.id as string;
    const currentTask = getTaskById(taskId);
    if (!currentTask || !currentTask.creatorLocation || !currentTask.partnerLocation) {
      router.push(`/task/${taskId}`);
      return;
    }
    setTask(currentTask);
    setLoading(false);
  }, [params.id, router]);

  const midpoint = task?.creatorLocation && task?.partnerLocation
    ? calculateMidpoint(task.creatorLocation, task.partnerLocation)
    : null;

  if (loading || !task || !midpoint) {
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
          <Link href={`/task/${task.id}`} className="text-gray hover:text-dark">
            ← 返回
          </Link>
          <h1 className="text-lg font-bold text-dark">选择见面地点</h1>
        </div>
      </header>

      {/* Map Placeholder */}
      <div className="max-w-md mx-auto">
        <div 
          ref={mapRef}
          className="h-64 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center relative overflow-hidden"
        >
          {/* Mock Map Visual */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" viewBox="0 0 400 300">
              {/* Grid lines */}
              {[...Array(10)].map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 30} x2="400" y2={i * 30} stroke="#cbd5e1" strokeWidth="1" />
              ))}
              {[...Array(14)].map((_, i) => (
                <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="300" stroke="#cbd5e1" strokeWidth="1" />
              ))}
              {/* Roads */}
              <line x1="100" y1="0" x2="100" y2="300" stroke="#94a3b8" strokeWidth="4" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="#94a3b8" strokeWidth="4" />
            </svg>
          </div>
          
          {/* Creator Marker */}
          {task.creatorLocation && (
            <div className="absolute" style={{ left: '30%', top: '40%' }}>
              <div className="relative">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  A
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
              </div>
              <p className="text-xs text-dark mt-1 bg-white px-2 py-1 rounded shadow">创建者</p>
            </div>
          )}
          
          {/* Partner Marker */}
          {task.partnerLocation && (
            <div className="absolute" style={{ left: '70%', top: '60%' }}>
              <div className="relative">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  B
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-secondary"></div>
              </div>
              <p className="text-xs text-dark mt-1 bg-white px-2 py-1 rounded shadow">对方</p>
            </div>
          )}
          
          {/* Midpoint Marker */}
          <div className="absolute" style={{ left: '50%', top: '50%' }}>
            <div className="relative">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg animate-pulse">
                ★
              </div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-accent"></div>
            </div>
            <p className="text-xs text-dark mt-1 bg-white px-2 py-1 rounded shadow font-medium">推荐中点</p>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white p-4 border-b">
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-gray">中点坐标</span>
              <p className="font-medium text-dark">
                {midpoint.lat.toFixed(4)}, {midpoint.lng.toFixed(4)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-gray">推荐地点</span>
              <p className="font-medium text-primary">{MOCK_PLACES.length} 个</p>
            </div>
          </div>
        </div>

        {/* Places List */}
        <div className="p-4">
          <h3 className="font-medium text-dark mb-3">推荐见面地点</h3>
          <div className="space-y-3">
            {MOCK_PLACES.map((place, index) => (
              <div
                key={index}
                onClick={() => setSelectedPlace(place)}
                className={`bg-white p-4 rounded-xl shadow-sm cursor-pointer transition-all ${
                  selectedPlace?.name === place.name ? 'ring-2 ring-primary' : 'hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-dark">{place.name}</h4>
                    <p className="text-sm text-gray mt-1">{place.address}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-blue-50 text-primary rounded">
                        {place.type === 'coffee' && '☕ 咖啡'}
                        {place.type === 'tea' && '🧋 茶饮'}
                        {place.type === 'bookstore' && '📚 书店'}
                        {place.type === 'restaurant' && '🍽️ 餐厅'}
                        {place.type === 'park' && '🌳 公园'}
                      </span>
                      <span className="text-xs text-accent">★ {place.rating}</span>
                    </div>
                  </div>
                  {selectedPlace?.name === place.name && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedPlace && (
            <button
              onClick={() => alert(`已选择 ${selectedPlace.name} 作为见面地点！`)}
              className="w-full mt-6 py-4 bg-primary text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
            >
              确认选择：{selectedPlace.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
